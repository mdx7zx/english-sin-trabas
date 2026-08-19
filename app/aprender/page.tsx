"use client";

import { Check, ChevronDown, Flag, LockKeyhole, Map, Sparkles } from "lucide-react";
import { useState } from "react";
import { lessons, units } from "@/data/lessons";
import { useProgress } from "@/components/providers/progress-provider";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonCard } from "@/components/lessons/lesson-card";

export default function LearnPage() {
  const { progress } = useProgress();
  const [openUnits, setOpenUnits] = useState(["unit-1", "unit-2"]);
  const activeLessons = lessons.filter((lesson) => lesson.unitId === "unit-1");
  const completedCount = activeLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;

  return (
    <div className="animate-rise">
      <PageHeader eyebrow="Tu ruta personal" title="Aprende con un camino claro" description="Cada lección conecta comprensión, construcción y práctica real. Puedes entrar a cualquier contenido sin bloqueos." action={<div className="rounded-2xl bg-white px-4 py-3 shadow-sm"><div className="flex items-center gap-2 text-xs font-black text-forest"><Map size={16} /> Nivel {progress.level}</div></div>} />

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_310px]">
        <div className="space-y-4">
          {units.map((unit) => {
            const unitLessons = lessons.filter((lesson) => lesson.unitId === unit.id);
            const completed = unitLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
            const isOpen = openUnits.includes(unit.id);
            return (
              <section key={unit.id} className={`overflow-hidden rounded-4xl border ${unit.status === "upcoming" ? "border-forest/5 bg-white/40" : "border-forest/10 bg-white"}`}>
                <button onClick={() => setOpenUnits((current) => current.includes(unit.id) ? current.filter((id) => id !== unit.id) : [...current, unit.id])} className="flex w-full items-center gap-4 p-5 text-left sm:p-6">
                  <span className={`grid size-14 shrink-0 place-items-center rounded-2xl font-black ${unit.status === "upcoming" ? "bg-forest/5 text-forest/30" : unit.id === "unit-1" ? "bg-lime text-forest" : "bg-mint text-forest"}`}>{unit.status === "upcoming" ? <LockKeyhole size={20} /> : unit.level}</span>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="eyebrow">Nivel {unit.level}</span>{unit.id === "unit-1" && <span className="rounded-full bg-mint px-2 py-1 text-[9px] font-black uppercase tracking-wider text-forest">En curso</span>}{unit.status === "upcoming" && <span className="text-[10px] font-bold text-forest/30">Próximamente</span>}</div><h2 className="mt-1 text-lg font-black text-ink sm:text-xl">{unit.title}</h2><p className="mt-1 text-xs text-forest/45">{unit.description}</p></div>
                  {unit.status === "active" && <div className="hidden w-28 sm:block"><div className="mb-1 flex justify-between text-[10px] font-bold text-forest/40"><span>{completed}/{unitLessons.length}</span><span>{unitLessons.length ? Math.round((completed / unitLessons.length) * 100) : 0}%</span></div><ProgressBar value={unitLessons.length ? (completed / unitLessons.length) * 100 : 0} tone="lime" /></div>}
                  <ChevronDown size={19} className={`shrink-0 text-forest/35 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && unit.status === "active" && <div className="grid gap-3 border-t border-forest/5 bg-cream/35 p-4 sm:grid-cols-2 sm:p-6">{unitLessons.map((lesson) => { const done = progress.completedLessons.includes(lesson.id); const firstIncomplete = unitLessons.find((item) => !progress.completedLessons.includes(item.id)); return <LessonCard key={lesson.id} lesson={lesson} completed={done} recommended={firstIncomplete?.id === lesson.id} />; })}</div>}
                {isOpen && unit.status === "upcoming" && <div className="border-t border-forest/5 px-6 py-4 text-sm text-forest/40">Esta unidad se habilitará en una próxima versión; tu ruta actual no está bloqueada por el diagnóstico.</div>}
              </section>
            );
          })}
        </div>

        <aside className="space-y-4">
          <div className="surface p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-lime text-forest"><Flag size={18} /></span><div><p className="text-sm font-black text-ink">Meta de la unidad</p><p className="text-[11px] text-forest/45">Dominar las bases de to be</p></div></div><div className="mt-5 flex items-end gap-2"><span className="text-4xl font-black tracking-tight text-ink">{completedCount}</span><span className="mb-1 text-sm font-bold text-forest/35">de {activeLessons.length}</span></div><ProgressBar className="mt-3" value={(completedCount / activeLessons.length) * 100} tone="lime" /><div className="mt-5 space-y-2 text-xs font-semibold text-forest/60"><div className="flex items-center gap-2"><Check size={14} className="text-moss" /> Identificar sujeto y verbo</div><div className="flex items-center gap-2"><Check size={14} className="text-moss" /> Usar am, is y are</div><div className="flex items-center gap-2"><Sparkles size={14} className="text-coral" /> Construir sin traducir literal</div></div></div>
          <div className="rounded-3xl bg-sky/35 p-5"><p className="eyebrow">Consejo del tutor</p><p className="mt-2 text-sm font-bold leading-6 text-forest">No memorices “am = soy”. Aprende el bloque completo: “I am ready”, “I am tired”, “I am here”.</p></div>
        </aside>
      </div>
    </div>
  );
}
