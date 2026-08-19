import type { Lesson } from "@/types";
import { ExercisePlayer } from "@/components/exercises/exercise-player";

const dailyLesson: Lesson = {
  id: "daily-practice",
  unitId: "daily",
  number: 1,
  title: "Mi práctica de hoy",
  eyebrow: "Sesión guiada · 17 minutos",
  description: "Una mezcla breve de repaso, verbos, listening, speaking, writing y errores frecuentes.",
  duration: 17,
  xp: 85,
  color: "lime",
  concept: { title: "Hoy practicaremos seis habilidades", body: "Responde rápido, revisa el feedback y sigue avanzando. Los errores se guardan para tu próximo repaso.", examples: [{ english: "review → build → listen → speak → write", spanish: "repasa → construye → escucha → habla → escribe", parts: ["2 min · repaso", "4 min · verbos", "4 min · listening", "4 min · speaking", "3 min · writing"] }] },
  exercises: [
    { id: "daily-review", kind: "choice", prompt: "We ___ at home yesterday.", instruction: "2 min · Repaso de un error", options: ["was", "were", "are"], answer: "were", hint: "We usa were en pasado.", explanation: "Con we, you y they usamos were.", category: "past-tense", difficulty: 1 },
    { id: "daily-verb", kind: "choice", prompt: "She ___ English every evening.", instruction: "4 min · Verbos", options: ["study", "studies", "studied"], answer: "studies", hint: "Con she el verbo cambia.", explanation: "Study cambia a studies con he, she e it.", category: "verbs", difficulty: 2 },
    { id: "daily-order", kind: "arrange", prompt: "Construye una frase futura.", instruction: "Ordena los bloques", words: ["tomorrow", "I", "work", "will"], answer: "I will work tomorrow", hint: "Sujeto + will + verbo base + tiempo.", explanation: "Después de will usamos work, la forma base.", category: "word-order", difficulty: 2, breakdown: [{ label: "I", role: "sujeto" }, { label: "will", role: "auxiliar" }, { label: "work", role: "verbo" }, { label: "tomorrow", role: "tiempo" }] },
    { id: "daily-listen", kind: "listen", prompt: "Escucha y escribe.", instruction: "4 min · Listening", audioText: "I am learning English every day.", answer: "I am learning English every day", hint: "Escucha el bloque I am learning.", explanation: "Am + learning expresa una acción en progreso.", category: "listening", difficulty: 2 },
    { id: "daily-speak", kind: "speak", prompt: "Di la frase en voz alta.", instruction: "4 min · Speaking", audioText: "I work in Mexico.", answer: "I work in Mexico", hint: "Con I usamos work, no works.", explanation: "La frase sigue sujeto + verbo base + lugar.", category: "pronunciation", difficulty: 1 },
    { id: "daily-write", kind: "fill", prompt: "Traduce naturalmente: Tengo hambre.", instruction: "3 min · Writing y pensar en inglés", answer: "I am hungry", hint: "En inglés es un estado, no una posesión.", explanation: "Usamos to be + hungry: I am hungry.", category: "word-order", difficulty: 2 },
  ],
};

export default function DailyPracticePage() { return <ExercisePlayer lesson={dailyLesson} />; }
