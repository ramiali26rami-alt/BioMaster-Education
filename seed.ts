/**
 * Firestore seed — run once to populate course data.
 * Called automatically on first app launch if units collection is empty.
 * Schema:
 *   /units/{unitId}   — Unit metadata
 *   /units/{unitId}/chapters/{chapterId}  — Chapter metadata
 *   /units/{unitId}/chapters/{chapterId}/lessons/{lessonId} — Lesson
 *   /quizzes/{lessonId}  — Quiz questions
 */
import {
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";

import { BIOLOGY_UNITS } from "@/constants/data";
import { QUIZZES } from "@/constants/quizData";
import { db } from "./config";

export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const currentUnitRef = doc(db, "units", "unit-nc-1");
    const currentUnitSnap = await getDoc(currentUnitRef);
    if (currentUnitSnap.exists()) return;

    const batch = writeBatch(db);

    for (const unit of BIOLOGY_UNITS) {
      const { chapters, ...unitMeta } = unit;
      const unitRef = doc(db, "units", unit.id);
      batch.set(unitRef, { ...unitMeta, createdAt: Date.now() });

      for (const chapter of chapters) {
        const { lessons, ...chapterMeta } = chapter;
        const chapterRef = doc(
          db,
          "units",
          unit.id,
          "chapters",
          chapter.id
        );
        batch.set(chapterRef, { ...chapterMeta, unitId: unit.id });

        for (const lesson of lessons) {
          const lessonRef = doc(
            db,
            "units",
            unit.id,
            "chapters",
            chapter.id,
            "lessons",
            lesson.id
          );
          batch.set(lessonRef, { ...lesson, chapterId: chapter.id, unitId: unit.id });
        }
      }
    }

    await batch.commit();

    const quizBatch = writeBatch(db);
    for (const [lessonId, quiz] of Object.entries(QUIZZES)) {
      const quizRef = doc(db, "quizzes", lessonId);
      quizBatch.set(quizRef, quiz);
    }
    await quizBatch.commit();

    console.log("[Seed] Firestore seeded successfully.");
  } catch (err) {
    console.warn("[Seed] Skipped (may already exist or offline):", err);
  }
}
