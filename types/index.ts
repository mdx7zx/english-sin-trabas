export type Skill = "grammar" | "listening" | "speaking" | "writing" | "reading";

export type ExerciseKind = "choice" | "arrange" | "fill" | "listen" | "speak";

export type Exercise = {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  instruction?: string;
  options?: string[];
  words?: string[];
  answer: string;
  acceptedAnswers?: string[];
  hint: string;
  explanation: string;
  breakdown?: { label: string; role: string }[];
  category: ErrorCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  audioText?: string;
};

export type Lesson = {
  id: string;
  unitId: string;
  number: number;
  title: string;
  eyebrow: string;
  description: string;
  duration: number;
  xp: number;
  color: "mint" | "lime" | "sky" | "coral";
  concept: {
    title: string;
    body: string;
    examples: { english: string; spanish: string; parts?: string[] }[];
  };
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  level: number;
  title: string;
  description: string;
  status: "active" | "upcoming";
  lessonIds: string[];
};

export type Verb = {
  base: string;
  third: string;
  past: string;
  participle: string;
  gerund: string;
  meaning: string;
  irregular?: boolean;
};

export type ErrorCategory =
  | "to-be"
  | "verbs"
  | "word-order"
  | "articles"
  | "prepositions"
  | "past-tense"
  | "participles"
  | "pronunciation"
  | "listening"
  | "vocabulary";

export type Mistake = {
  id: string;
  category: ErrorCategory;
  exerciseId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  count: number;
  lastSeen: string;
  status: "new" | "learning" | "review" | "mastered";
};

export type UserProgress = {
  name: string;
  level: number;
  xp: number;
  streak: number;
  minutes: number;
  wordsLearned: number;
  verbsMastered: number;
  exercisesCompleted: number;
  correctedErrors: number;
  completedLessons: string[];
  skillScores: Record<Skill, number>;
  mistakes: Mistake[];
  diagnosticCompleted: boolean;
  diagnosticFocus: string[];
};
