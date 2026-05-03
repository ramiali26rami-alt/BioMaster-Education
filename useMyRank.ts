import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { BIOLOGY_UNITS } from "@/constants/data";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";

const TOTAL_LESSONS = BIOLOGY_UNITS.filter((u) => !u.locked).reduce(
  (s, u) => s + u.chapters.reduce((cs, ch) => cs + ch.lessons.length, 0),
  0
);

export interface MyRankResult {
  myRank: number;
  totalUsers: number;
  myPct: number;
  myCompletedCount: number;
  loading: boolean;
  refresh: () => void;
}

export function useMyRank(): MyRankResult {
  const { user } = useAuth();
  const [myRank, setMyRank] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [myPct, setMyPct] = useState(0);
  const [myCompletedCount, setMyCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const snap = await getDocs(collection(db, "users"));
      const list: { uid: string; completedCount: number }[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const completedLessons: string[] = data.completedLessons ?? [];
        list.push({ uid: d.id, completedCount: completedLessons.length });
      });
      list.sort((a, b) => b.completedCount - a.completedCount);
      const rank = list.findIndex((e) => e.uid === user.uid) + 1;
      const me = list.find((e) => e.uid === user.uid);
      setMyRank(rank > 0 ? rank : 1);
      setTotalUsers(list.length);
      setMyCompletedCount(me?.completedCount ?? 0);
      setMyPct(
        TOTAL_LESSONS > 0
          ? Math.round(((me?.completedCount ?? 0) / TOTAL_LESSONS) * 100)
          : 0
      );
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { myRank, totalUsers, myPct, myCompletedCount, loading, refresh: fetch };
}
