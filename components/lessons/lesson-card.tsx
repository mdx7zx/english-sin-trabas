import Link from "next/link";
import { Check, ChevronRight, Clock3, LockKeyhole, Play } from "lucide-react";
import type { Lesson } from "@/types";
import { cn } from "@/lib/utils";

const backgrounds = { mint: "bg-mint/45", lime: "bg-lime/45", sky: "bg-sky/35", coral: "bg-coral/15" };

export function LessonCard({ lesson, completed, recommended, locked = false }: { lesson: Lesson; completed: boolean; recommended?: boolean; locked?: boolean }) {
  const content = (
    <div className={cn("group flex h-full items-center gap-4 rounded-3xl border p-4 transition sm:p-5", recommended ? "border-moss/30 bg-white shadow-card" : "border-forest/10 bg-white/75 hover:border-moss/25 hover:bg-white", locked && "opacity-55")}>
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black text-forest", backgrounds[lesson.color])}>{completed ? <Check size={20} strokeWidth={3} /> : locked ? <LockKeyhole size={17} /> : lesson.number}</span>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2">{recommended && <span className="rounded-full bg-lime px-2 py-1 text-[9px] font-black uppercase tracking-wider text-forest">Siguiente</span>}<span className="text-[10px] font-bold uppercase tracking-wider text-forest/40">Lección {lesson.number}</span></div><h3 className="mt-1 truncate text-sm font-black text-ink sm:text-base">{lesson.title}</h3><div className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-forest/40"><span className="flex items-center gap-1"><Clock3 size={12} /> {lesson.duration} min</span><span>+{lesson.xp} XP</span></div></div>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full transition", recommended ? "bg-forest text-white group-hover:translate-x-0.5" : "bg-cream text-forest/45")}>{recommended ? <Play size={14} fill="currentColor" /> : <ChevronRight size={17} />}</span>
    </div>
  );
  return locked ? content : <Link href={`/aprender/${lesson.id}`}>{content}</Link>;
}
