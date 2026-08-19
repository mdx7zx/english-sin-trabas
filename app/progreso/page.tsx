"use client";

import { Award, BookOpen, CalendarDays, CheckCircle2, Clock3, Flame, Shapes, Sparkles, Target } from "lucide-react";
import { useProgress } from "@/components/providers/progress-provider";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";

const skills = [
  { key: "listening" as const, label: "Listening", tone: "sky" as const },
  { key: "speaking" as const, label: "Speaking", tone: "coral" as const },
  { key: "writing" as const, label: "Writing", tone: "lime" as const },
  { key: "reading" as const, label: "Reading", tone: "forest" as const },
  { key: "grammar" as const, label: "Grammar", tone: "forest" as const },
];

export default function ProgressPage() {
  const { progress } = useProgress();
  const today = new Date();
  const weeks = Array.from({ length: 5 }, (_, index) => {
    const bucket = 4 - index;
    const value = progress.studyDates.filter((date) => {
      const studied = new Date(`${date}T12:00:00`);
      const daysAgo = Math.floor((today.getTime() - studied.getTime()) / 86_400_000);
      return daysAgo >= bucket * 7 && daysAgo < (bucket + 1) * 7;
    }).length;
    return { label: index === 4 ? "Esta" : `Sem ${index + 1}`, value };
  });
  const stats = [
    { icon: BookOpen, value: progress.completedLessons.length, label: "lecciones" },
    { icon: Shapes, value: progress.verbsMastered, label: "verbos" },
    { icon: Clock3, value: progress.minutes, label: "minutos" },
    { icon: Target, value: progress.exercisesCompleted, label: "ejercicios" },
    { icon: CheckCircle2, value: progress.correctedErrors, label: "errores corregidos" },
    { icon: CalendarDays, value: progress.studyDates.length, label: "días estudiados" },
  ];
  const currentLevelXp = progress.xp % 1000;
  const xpToNextLevel = 1000 - currentLevelXp;
  const hasSkillData = skills.some((skill) => progress.skillScores[skill.key] > 0);
  const strongest = skills.reduce((best, skill) => progress.skillScores[skill.key] > progress.skillScores[best.key] ? skill : best);
  const weakest = skills.reduce((lowest, skill) => progress.skillScores[skill.key] < progress.skillScores[lowest.key] ? skill : lowest);

  return (
    <div className="animate-rise">
      <PageHeader
        eyebrow="Tu avance"
        title="El progreso que sí importa"
        description="Mide lo que entiendes, construyes y usas; no solo cuántas pantallas terminaste."
        action={<div className="flex items-center gap-2 rounded-2xl bg-lime/60 px-4 py-3 text-sm font-black text-forest"><Flame size={17} className="fill-coral text-coral" /> {progress.streak} días de racha</div>}
      />

      <section className="mt-8 grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
        <div className="relative overflow-hidden rounded-4xl bg-forest p-7 text-white">
          <div className="absolute -right-16 -top-20 size-60 rounded-full border-[38px] border-white/[0.04]" />
          <span className="grid size-12 place-items-center rounded-2xl bg-lime text-forest"><Award size={22} /></span>
          <p className="mt-8 text-xs font-bold text-white/45">Nivel actual</p>
          <h2 className="mt-1 text-5xl font-black tracking-tight">{progress.level}</h2>
          <p className="mt-2 text-sm text-white/55">Recuperando las bases</p>
          <div className="mt-8 flex justify-between text-xs font-bold"><span>{currentLevelXp} XP</span><span className="text-white/40">1,000 XP</span></div>
          <ProgressBar className="mt-2 bg-white/10" value={(currentLevelXp / 1000) * 100} tone="lime" />
          <p className="mt-3 text-[10px] text-white/40">Te faltan {xpToNextLevel} XP para tu siguiente nivel.</p>
        </div>

        <div className="surface p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div><p className="eyebrow">Actividad</p><h2 className="mt-1 text-xl font-black text-ink">Días con práctica</h2></div>
            <span className="flex items-center gap-1 text-xs font-black text-moss"><CalendarDays size={15} /> Registro real</span>
          </div>
          <div className="mt-8 flex h-44 items-end gap-4">
            {weeks.map((week, index) => (
              <div key={week.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-bold text-forest/35">{week.value}d</span>
                <div
                  className={`w-full max-w-12 rounded-t-xl ${index === weeks.length - 1 ? "bg-lime" : "bg-mint"}`}
                  style={{ height: week.value === 0 ? "0%" : `${Math.max(14, (week.value / 7) * 100)}%` }}
                />
                <span className="text-[10px] font-bold text-forest/40">{week.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.label} className="surface p-4"><Icon size={17} className="text-moss" /><span className="mt-4 block text-2xl font-black text-ink">{stat.value}</span><span className="text-[10px] font-semibold text-forest/40">{stat.label}</span></div>;
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <div className="surface p-5 sm:p-7">
          <p className="eyebrow">Mapa de habilidades</p>
          <h2 className="mt-1 text-xl font-black text-ink">Dónde estás creciendo</h2>
          <div className="mt-6 space-y-5">
            {skills.map((skill) => <div key={skill.key}><div className="mb-2 flex justify-between text-xs font-bold"><span className="text-forest/60">{skill.label}</span><span className="text-forest">{progress.skillScores[skill.key]}%</span></div><ProgressBar value={progress.skillScores[skill.key]} tone={skill.tone} /></div>)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl bg-mint/45 p-6">
            <span className="grid size-10 place-items-center rounded-2xl bg-white text-moss"><Sparkles size={18} /></span>
            <p className="mt-5 text-sm font-black text-forest">{hasSkillData ? `Tu fortaleza: ${strongest.label}` : "Tu mapa comienza vacío"}</p>
            <p className="mt-2 text-xs leading-5 text-forest/55">{hasSkillData ? "Tus resultados se actualizan con cada práctica." : "Completa el diagnóstico o una práctica para ver tus primeras habilidades."}</p>
          </div>
          <div className="rounded-3xl bg-coral/10 p-6">
            <span className="grid size-10 place-items-center rounded-2xl bg-white text-coral"><Target size={18} /></span>
            <p className="mt-5 text-sm font-black text-forest">{hasSkillData ? `Siguiente foco: ${weakest.label}` : "Siguiente paso: diagnóstico"}</p>
            <p className="mt-2 text-xs leading-5 text-forest/55">{hasSkillData ? "Una práctica corta puede ayudarte a equilibrar esta habilidad." : "La evaluación inicial te dará una ruta personalizada sin bloquear contenido."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
