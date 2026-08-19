"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/providers/auth-provider";
import { getFirestoreDb } from "@/lib/firebase/client";
import type { ErrorCategory, Exercise, UserProgress } from "@/types";

const STORAGE_KEY = "english-sin-trabas.progress.v1";

function storageKey(userId: string | null) {
  return userId ? `${STORAGE_KEY}.${userId}` : STORAGE_KEY;
}

const demoProgress: UserProgress = {
  dataVersion: 1,
  name: "Alex",
  level: 1,
  xp: 680,
  streak: 6,
  minutes: 142,
  wordsLearned: 86,
  verbsMastered: 12,
  exercisesCompleted: 74,
  correctedErrors: 23,
  completedLessons: ["pronouns", "sentence-parts"],
  skillScores: {
    grammar: 68,
    listening: 54,
    speaking: 42,
    writing: 61,
    reading: 73,
  },
  mistakes: [
    {
      id: "seed-was-were",
      category: "to-be",
      exerciseId: "past-be-seed",
      prompt: "We ___ at home yesterday.",
      userAnswer: "was",
      correctAnswer: "were",
      explanation: "Con we usamos were en pasado.",
      count: 3,
      lastSeen: "2026-08-17T18:00:00.000Z",
      status: "review",
    },
    {
      id: "seed-third-person",
      category: "verbs",
      exerciseId: "third-person-seed",
      prompt: "She ___ to work every day.",
      userAnswer: "go",
      correctAnswer: "goes",
      explanation: "Con he, she e it agregamos -s o -es en presente simple.",
      count: 2,
      lastSeen: "2026-08-16T18:00:00.000Z",
      status: "learning",
    },
    {
      id: "seed-hungry",
      category: "word-order",
      exerciseId: "think-hungry-seed",
      prompt: "Expresa de forma natural: Tengo hambre.",
      userAnswer: "I have hunger",
      correctAnswer: "I am hungry",
      explanation: "En inglés, el hambre se expresa como un estado con to be.",
      count: 1,
      lastSeen: "2026-08-15T18:00:00.000Z",
      status: "new",
    },
  ],
  diagnosticCompleted: false,
  diagnosticFocus: [],
  studyDates: [],
};

const initialProgress: UserProgress = {
  dataVersion: 2,
  name: "Estudiante",
  level: 1,
  xp: 0,
  streak: 0,
  minutes: 0,
  wordsLearned: 0,
  verbsMastered: 0,
  exercisesCompleted: 0,
  correctedErrors: 0,
  completedLessons: [],
  skillScores: {
    grammar: 0,
    listening: 0,
    speaking: 0,
    writing: 0,
    reading: 0,
  },
  mistakes: [],
  diagnosticCompleted: false,
  diagnosticFocus: [],
  studyDates: [],
};

type ProgressContextValue = {
  progress: UserProgress;
  hydrated: boolean;
  syncStatus: "local" | "loading" | "syncing" | "synced" | "error";
  completeLesson: (lessonId: string, xp: number, minutes: number) => void;
  recordAnswer: (exercise: Exercise, userAnswer: string, correct: boolean) => void;
  completeDiagnostic: (score: number, focus: string[]) => void;
  markMistakePracticed: (id: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const activeUserId = user?.uid ?? null;
  const activeOwner = activeUserId ?? "guest";
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [hydratedOwner, setHydratedOwner] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<ProgressContextValue["syncStatus"]>("local");
  const hydrated = !authLoading && hydratedOwner === activeOwner;

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    let frame: number | null = null;

    async function hydrateProgress() {
      const accountProgress = readLocalProgress(storageKey(activeUserId));
      const guestProgress = activeUserId ? readLocalProgress(STORAGE_KEY) : null;
      let nextProgress = accountProgress ?? guestProgress ?? initialProgress;
      let nextStatus: ProgressContextValue["syncStatus"] = activeUserId ? "loading" : "local";

      const firestore = activeUserId ? getFirestoreDb() : null;
      if (activeUserId && firestore) {
        try {
          const progressRef = doc(firestore, "user_progress", activeUserId);
          const snapshot = await getDoc(progressRef);

          if (snapshot.exists() && snapshot.data().progress) {
            nextProgress = normalizeProgress(snapshot.data().progress);
          } else {
            await setDoc(progressRef, { progress: nextProgress, updatedAt: serverTimestamp() });
          }
          nextStatus = "synced";
        } catch {
          nextStatus = "error";
        }
      }

      if (cancelled) return;
      writeLocalProgress(storageKey(activeUserId), nextProgress);
      frame = window.requestAnimationFrame(() => {
        if (cancelled) return;
        setProgress(nextProgress);
        setSyncStatus(nextStatus);
        setHydratedOwner(activeOwner);
      });
    }

    void hydrateProgress();

    return () => {
      cancelled = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [activeOwner, activeUserId, authLoading]);

  useEffect(() => {
    if (!hydrated) return;
    writeLocalProgress(storageKey(activeUserId), progress);

    const firestore = activeUserId ? getFirestoreDb() : null;
    if (!activeUserId || !firestore) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        await setDoc(
          doc(firestore, "user_progress", activeUserId),
          {
          progress,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        if (!cancelled) setSyncStatus("synced");
      } catch {
        if (!cancelled) setSyncStatus("error");
      }
    }, 650);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeUserId, hydrated, progress]);

  const completeLesson = useCallback((lessonId: string, xp: number, minutes: number) => {
    setProgress((current) => {
      const repeatable = lessonId === "daily-practice";
      if (current.completedLessons.includes(lessonId) && !repeatable) return current;
      const nextXp = current.xp + xp;
      return {
        ...current,
        ...studyDayUpdate(current),
        xp: nextXp,
        level: Math.floor(nextXp / 1000) + 1,
        minutes: current.minutes + minutes,
        completedLessons: current.completedLessons.includes(lessonId) ? current.completedLessons : [...current.completedLessons, lessonId],
      };
    });
  }, []);

  const recordAnswer = useCallback((exercise: Exercise, userAnswer: string, correct: boolean) => {
    setProgress((current) => {
      const skill = exercise.kind === "listen" ? "listening" : exercise.kind === "speak" ? "speaking" : "grammar";
      if (correct) {
        const nextXp = current.xp + 5;
        return {
          ...current,
          ...studyDayUpdate(current),
          xp: nextXp,
          level: Math.floor(nextXp / 1000) + 1,
          exercisesCompleted: current.exercisesCompleted + 1,
          skillScores: { ...current.skillScores, [skill]: Math.min(100, current.skillScores[skill] + 1) },
        };
      }

      const existing = current.mistakes.find((item) => item.exerciseId === exercise.id);
      const mistakes = existing
        ? current.mistakes.map((item) =>
            item.exerciseId === exercise.id
              ? { ...item, userAnswer, count: item.count + 1, lastSeen: new Date().toISOString(), status: "review" as const }
              : item,
          )
        : [
            {
              id: `${exercise.id}-${Date.now()}`,
              category: exercise.category,
              exerciseId: exercise.id,
              prompt: exercise.prompt,
              userAnswer,
              correctAnswer: exercise.answer,
              explanation: exercise.explanation,
              count: 1,
              lastSeen: new Date().toISOString(),
              status: "new" as const,
            },
            ...current.mistakes,
          ];

      return { ...current, ...studyDayUpdate(current), exercisesCompleted: current.exercisesCompleted + 1, mistakes };
    });
  }, []);

  const completeDiagnostic = useCallback((score: number, focus: string[]) => {
    setProgress((current) => {
      const nextXp = current.xp + Math.max(10, score * 3);
      return {
        ...current,
        ...studyDayUpdate(current),
        diagnosticCompleted: true,
        diagnosticFocus: focus,
        xp: nextXp,
        level: Math.floor(nextXp / 1000) + 1,
      };
    });
  }, []);

  const markMistakePracticed = useCallback((id: string) => {
    setProgress((current) => ({
      ...current,
      ...studyDayUpdate(current),
      correctedErrors: current.correctedErrors + 1,
      mistakes: current.mistakes.map((item) =>
        item.id === id ? { ...item, status: "learning" as const } : item,
      ),
    }));
  }, []);

  const value = useMemo(
    () => ({ progress, hydrated, syncStatus, completeLesson, recordAnswer, completeDiagnostic, markMistakePracticed }),
    [progress, hydrated, syncStatus, completeLesson, recordAnswer, completeDiagnostic, markMistakePracticed],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

function readLocalProgress(key: string) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? normalizeProgress(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

function writeLocalProgress(key: string, progress: UserProgress) {
  try {
    window.localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Local storage can be unavailable in privacy mode; the in-memory session still works.
  }
}

function normalizeProgress(value: unknown): UserProgress {
  if (!value || typeof value !== "object") return initialProgress;
  const saved = migrateDemoProgress(value as Partial<UserProgress>);

  return {
    ...initialProgress,
    ...saved,
    dataVersion: initialProgress.dataVersion,
    skillScores: { ...initialProgress.skillScores, ...(saved.skillScores ?? {}) },
    completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : initialProgress.completedLessons,
    mistakes: Array.isArray(saved.mistakes) ? saved.mistakes : initialProgress.mistakes,
    diagnosticFocus: Array.isArray(saved.diagnosticFocus) ? saved.diagnosticFocus : initialProgress.diagnosticFocus,
    studyDates: Array.isArray(saved.studyDates) ? saved.studyDates : initialProgress.studyDates,
  };
}

function migrateDemoProgress(saved: Partial<UserProgress>): Partial<UserProgress> {
  if ((saved.dataVersion ?? 1) >= initialProgress.dataVersion) return saved;

  const xp = Math.max(0, (saved.xp ?? demoProgress.xp) - demoProgress.xp);
  const skillKeys = Object.keys(demoProgress.skillScores) as Array<keyof UserProgress["skillScores"]>;
  const skillScores = Object.fromEntries(
    skillKeys.map((key) => [key, Math.max(0, (saved.skillScores?.[key] ?? demoProgress.skillScores[key]) - demoProgress.skillScores[key])]),
  ) as UserProgress["skillScores"];
  const seededLessonIds = new Set(demoProgress.completedLessons);
  const seededMistakeIds = new Set(demoProgress.mistakes.map((mistake) => mistake.id));

  return {
    ...saved,
    dataVersion: initialProgress.dataVersion,
    name: saved.name === demoProgress.name ? initialProgress.name : saved.name,
    level: Math.floor(xp / 1000) + 1,
    xp,
    streak: 0,
    minutes: Math.max(0, (saved.minutes ?? demoProgress.minutes) - demoProgress.minutes),
    wordsLearned: Math.max(0, (saved.wordsLearned ?? demoProgress.wordsLearned) - demoProgress.wordsLearned),
    verbsMastered: Math.max(0, (saved.verbsMastered ?? demoProgress.verbsMastered) - demoProgress.verbsMastered),
    exercisesCompleted: Math.max(0, (saved.exercisesCompleted ?? demoProgress.exercisesCompleted) - demoProgress.exercisesCompleted),
    correctedErrors: Math.max(0, (saved.correctedErrors ?? demoProgress.correctedErrors) - demoProgress.correctedErrors),
    completedLessons: (saved.completedLessons ?? demoProgress.completedLessons).filter((id) => !seededLessonIds.has(id)),
    skillScores,
    mistakes: (saved.mistakes ?? demoProgress.mistakes).filter((mistake) => !seededMistakeIds.has(mistake.id)),
    studyDates: [],
  };
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}

export const categoryLabels: Record<ErrorCategory, string> = {
  "to-be": "To be",
  verbs: "Verbos",
  "word-order": "Orden",
  articles: "Artículos",
  prepositions: "Preposiciones",
  "past-tense": "Pasado",
  participles: "Participios",
  pronunciation: "Pronunciación",
  listening: "Listening",
  vocabulary: "Vocabulario",
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function studyDayUpdate(progress: UserProgress): Pick<UserProgress, "streak" | "studyDates"> {
  const today = dateKey(new Date());
  if (progress.studyDates.includes(today)) {
    return { streak: progress.streak, studyDates: progress.studyDates };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const continued = progress.studyDates.includes(dateKey(yesterday));

  return {
    streak: continued ? progress.streak + 1 : 1,
    studyDates: [...progress.studyDates, today],
  };
}
