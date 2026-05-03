import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

import { auth, db } from "@/firebase/config";

const DEVICE_ID_KEY = "biomaster_device_id";
const AUTH_PERSIST_KEY = "biomaster_auth_persist";

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? "",
    displayName:
      u.displayName ??
      (u.email ? u.email.split("@")[0].replace(/[._]/g, " ") : "Student"),
  };
}

async function getDeviceId(): Promise<string> {
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;
  let id: string;
  if (Platform.OS === "web") {
    id = `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  } else {
    id =
      Device.osBuildId ??
      Device.osInternalBuildId ??
      `${Device.brand ?? "device"}-${Device.modelName ?? "unknown"}-${Date.now()}`;
  }
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

async function checkAndBindDevice(uid: string): Promise<void> {
  const deviceId = await getDeviceId();
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid,
      deviceId,
      deviceBound: true,
      boundAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      displayName: "",
      email: "",
    });
    return;
  }

  const data = snap.data();

  if (data.deviceId && data.deviceId !== deviceId) {
    await firebaseSignOut(auth);
    throw new Error("DEVICE_MISMATCH");
  }

  if (!data.deviceId) {
    await updateDoc(userRef, {
      deviceId,
      deviceBound: true,
      boundAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authUnsubscribed = false;

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (authUnsubscribed) return;
      if (firebaseUser) {
        const mapped = mapUser(firebaseUser);
        setUser(mapped);
        AsyncStorage.setItem(AUTH_PERSIST_KEY, JSON.stringify(mapped)).catch(() => {});
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    AsyncStorage.getItem(AUTH_PERSIST_KEY)
      .then((stored) => {
        if (stored && !auth.currentUser) {
          setUser(JSON.parse(stored));
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      authUnsubscribed = true;
      unsub();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!email.trim()) throw new Error("EMPTY_EMAIL");
    if (!password.trim()) throw new Error("EMPTY_PASSWORD");

    let firebaseUser: User;

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      firebaseUser = cred.user;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );
          firebaseUser = cred.user;
          const displayName = email.split("@")[0].replace(/[._]/g, " ");
          await updateProfile(firebaseUser, { displayName });
        } catch (createErr: unknown) {
          const createCode = (createErr as { code?: string }).code ?? "";
          if (createCode === "auth/email-already-in-use") {
            throw new Error("INVALID_CREDENTIALS");
          }
          if (createCode === "auth/weak-password") {
            throw new Error("WEAK_PASSWORD");
          }
          throw new Error("SIGN_IN_FAILED");
        }
      } else if (code === "auth/invalid-email") {
        throw new Error("INVALID_EMAIL");
      } else if (code === "auth/too-many-requests") {
        throw new Error("TOO_MANY_REQUESTS");
      } else if (code === "auth/network-request-failed") {
        throw new Error("NETWORK_ERROR");
      } else {
        throw new Error("SIGN_IN_FAILED");
      }
    }

    await checkAndBindDevice(firebaseUser.uid);

    const mapped = mapUser(firebaseUser);
    await AsyncStorage.setItem(AUTH_PERSIST_KEY, JSON.stringify(mapped));
    setUser(mapped);

    updateDoc(doc(db, "users", firebaseUser.uid), {
      displayName: mapped.displayName,
      email: mapped.email,
    }).catch(() => {});
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth).catch(() => {});
    await AsyncStorage.removeItem(AUTH_PERSIST_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
