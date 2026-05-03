import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BIOLOGY_UNITS } from "@/constants/data";
import { db } from "@/firebase/config";
import { useAuth } from "./AuthContext";

const PROGRESS_CACHE_KEY = "biomaster_progress_cache";

interface ProgressContextType {
  completedIds: Set<string>;
  isComplete: (lessonId: string) => boolean;
  markComplete: (lessonId: string) => Promise<void>;
  totalCompleted: number;
  totalLessons: number;
  unitProgress: (unitId: string) => { completed: number; total: number };
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!user) {
      setCompletedIds(new Set());
      return;
    }

    AsyncStorage.getItem(PROGRESS_CACHE_KEY)
      .then((cached) => {
        if (cached) {
          try {
            const arr: string[] = JSON.parse(cached);
            setCompletedIds(new Set(arr));
          } catch {
          }
        }
      })
      .catch(() => {});

    const userRef = doc(db, "users", user.uid);

    const unsub = onSnapshot(
      userRef,
      (snap) => {
        const data = snap.data();
        const ids: string[] = data?.completedLessons ?? [];
        setCompletedIds(new Set(ids));
        AsyncStorage.setItem(PROGRESS_CACHE_KEY, JSON.stringify(ids)).catch(() => {});
      },
      () => {}
    );

    unsubRef.current = unsub;
    return () => {
      unsub();
      unsubRef.current = null;
    };
  }, [user?.uid]);

  const isComplete = useCallback(
    (lessonId: string) => completedIds.has(lessonId),
    [completedIds]
  );

  const markComplete = useCallback(
    async (lessonId: string) => {
      if (!user || completedIds.has(lessonId)) return;

      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.add(lessonId);
        AsyncStorage.setItem(
          PROGRESS_CACHE_KEY,
          JSON.stringify([...next])
        ).catch(() => {});
        return next;
      });

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          await updateDoc(userRef, {
            completedLessons: arrayUnion(lessonId),
          });
        } else {
          await setDoc(
            userRef,
            { completedLessons: [lessonId] },
            { merge: true }
          );
        }
      } catch {
      }
    },
    [user, completedIds]
  );

  const totalLessons = useMemo(
    () =>
      BIOLOGY_UNITS.filter((u) => !u.locked).reduce(
        (s, u) =>
          s +
          u.chapters.reduce((cs, ch) => cs + ch.lessons.length, 0),
        0
      ),
    []
  );

  const totalCompleted = useMemo(() => {
    let count = 0;
    for (const unit of BIOLOGY_UNITS) {
      for (const chapter of unit.chapters) {
        for (const lesson of chapter.lessons) {
          if (completedIds.has(lesson.id)) count++;
        }
      }
    }
    return count;
  }, [completedIds]);

  const unitProgress = useCallback(
    (unitId: string) => {
      const unit = BIOLOGY_UNITS.find((u) => u.id === unitId);
      if (!unit) return { completed: 0, total: 0 };
      let completed = 0;
      let total = 0;
      for (const chapter of unit.chapters) {
        for (const lesson of chapter.lessons) {
          total++;
          if (completedIds.has(lesson.id)) completed++;
        }
      }
      return { completed, total };
    },
    [completedIds]
  );

  return (
    <ProgressContext.Provider
      value={{
        completedIds,
        isComplete,
        markComplete,
        totalCompleted,
        totalLessons,
        unitProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
