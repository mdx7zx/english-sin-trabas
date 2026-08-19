import { notFound } from "next/navigation";
import { ExercisePlayer } from "@/components/exercises/exercise-player";
import { getLesson, lessons } from "@/data/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  return <ExercisePlayer lesson={lesson} />;
}
