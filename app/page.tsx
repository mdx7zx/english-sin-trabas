"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  Headphones,
  MessageCircle,
  Mic2,
  PenLine,
  Play,
  Shapes,
  Sparkles,
  Target,
} from "lucide-react";
import { useProgress } from "@/components/providers/progress-provider";
import { ProgressBar } from "@/components/ui/progress-bar";
import { lessons } from "@/data/lessons";

const quickLinks = [
  { label: "Aprender", detail: "Tu ruta", href: "/aprender", icon: BookOpen, color: "bg-mint/55" },
  { label: "Verbos", detail: "38 familias", href: "/verbos", icon: Shapes, color: "bg-lime/55" },
  { label: "Listening", detail: "Afina el oído", href: "/practicar/listening", icon: Headphones, color: "bg-sky/45" },
  { label: "Speaking", detail: "Habla conmigo", href: "/practicar/speaking", icon: Mic2, color: "bg-coral/20" },
  { label: "Writing", detail: "Escribe mejor", href: "/practicar/writing", icon: PenLine, color: "bg-[#eee6ff]" },
  { label: "Reading", detail: "Lee y entiende", href: "/practicar/reading", icon: BookOpen, color: "bg-[#ffe9bd]" },
  { label: "Conversación", detail: "Situaciones reales", href: "/conversacion", icon: MessageCircle, color: "bg-mint/55" },
  { label: "Repaso", detail: "Tus errores", href: "/errores", icon: Sparkles, color: "bg-coral/20" },
];

const skillMeta = [
  { key: "listening" as const, label: "Listening", color: "sky" as const },
  { key: "speaking" as const, label: "Speaking", color: "coral" as const },
  { key: "writing" as const, label: "Writing", color: "lime" as const },
  { key: "grammar" as const, label: "Grammar", color: "forest" as const },
];

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const { progress } = useProgress();
  const recommended = lessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) ?? lessons[0];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weeklyValues = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return progress.studyDates.includes(localDateKey(date)) ? 92 : 0;
  });

  return (
    <div className="animate-rise space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="eyebrow">Martes · Tu espacio de práctica</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink sm:text-4xl">Hola, vamos a practicar inglés.</h1><p className="mt-2 text-sm text-forest/50">Pequeños pasos, frases que sí vas a usar.</p></div>
        {!progress.diagnosticCompleted && <Link href="/diagnostico" className="secondary-button self-start"><Target size={16} /> Hacer diagnóstico <ArrowRight size={16} /></Link>}
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_.75fr]">
        <div className="relative overflow-hidden rounded-4xl bg-forest p-6 text-white shadow-float sm:p-8">
          <div className="absolute -right-12 -top-20 size-64 rounded-full border-[42px] border-white/[0.035]" /><div className="absolute bottom-0 right-[20%] size-36 rounded-full bg-lime/[0.05] blur-2xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between"><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-lime">Recomendado para ti</span><span className="flex items-center gap-1 text-xs font-semibold text-white/45"><Clock3 size={14} /> {recommended.duration} min</span></div>
            <div className="mt-10 max-w-xl"><p className="text-xs font-bold text-white/45">Unidad 1 · Volviendo a las bases</p><h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-[40px] sm:leading-tight">{recommended.title}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/60">{recommended.description}</p></div>
            <div className="mt-9 flex flex-wrap items-center gap-3"><Link href={`/aprender/${recommended.id}`} className="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-lime px-5 py-3.5 text-sm font-black text-forest transition hover:-translate-y-0.5 hover:bg-white"><Play size={17} fill="currentColor" /> Continuar aprendiendo</Link><span className="text-xs font-semibold text-white/40">+{recommended.xp} XP al terminar</span></div>
          </div>
        </div>

        <div className="surface p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="eyebrow">Esta semana</p><h2 className="mt-1 text-lg font-black text-ink">Tu constancia cuenta</h2></div><span className="grid size-11 place-items-center rounded-2xl bg-coral/15 text-coral"><Flame size={21} fill="currentColor" /></span></div>
          <div className="mt-7 flex h-28 items-end justify-between gap-2">{weeklyValues.map((value, i) => <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full max-w-6 rounded-t-lg transition-all ${i === 5 ? "bg-lime" : "bg-mint"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-forest/35">{"LMMJVSD"[i]}</span></div>)}</div>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-forest/10 pt-5 text-center"><div><span className="block text-xl font-black text-ink">{progress.streak}</span><span className="text-[10px] font-semibold text-forest/40">días de racha</span></div><div><span className="block text-xl font-black text-ink">{progress.minutes}</span><span className="text-[10px] font-semibold text-forest/40">minutos</span></div><div><span className="block text-xl font-black text-ink">{progress.xp}</span><span className="text-[10px] font-semibold text-forest/40">XP total</span></div></div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{ icon: BookOpen, value: progress.wordsLearned, label: "palabras aprendidas", bg: "bg-sky/30" }, { icon: Shapes, value: progress.verbsMastered, label: "verbos dominados", bg: "bg-lime/35" }, { icon: CheckCircle2, value: progress.correctedErrors, label: "errores corregidos", bg: "bg-mint/50" }, { icon: Target, value: progress.exercisesCompleted, label: "ejercicios hechos", bg: "bg-coral/15" }].map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="surface p-4 sm:p-5"><span className={`grid size-9 place-items-center rounded-xl ${stat.bg} text-forest`}><Icon size={17} /></span><div className="mt-4"><span className="text-2xl font-black tracking-tight text-ink">{stat.value}</span><p className="mt-0.5 text-[11px] font-semibold text-forest/40">{stat.label}</p></div></div>; })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <div className="surface p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Tus habilidades</p><h2 className="mt-1 text-xl font-black text-ink">Un progreso equilibrado</h2></div><Link href="/progreso" className="text-xs font-bold text-moss">Ver detalle</Link></div><div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">{skillMeta.map((skill) => <div key={skill.key}><div className="mb-2 flex items-center justify-between text-xs font-bold"><span className="text-forest/60">{skill.label}</span><span className="text-forest">{progress.skillScores[skill.key]}%</span></div><ProgressBar value={progress.skillScores[skill.key]} tone={skill.color} /></div>)}</div></div>
        <div className="overflow-hidden rounded-3xl bg-lime/60 p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Sesión guiada</p><h2 className="mt-1 text-xl font-black text-ink">Mi práctica de hoy</h2></div><span className="grid size-11 place-items-center rounded-2xl bg-white/65 text-forest"><Clock3 size={20} /></span></div><p className="mt-3 text-sm leading-6 text-forest/60">15 minutos que mezclan repaso, verbos, listening, speaking y writing.</p><Link href="/practica-diaria" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-forest">Comenzar sesión <ArrowRight size={17} /></Link></div>
      </section>

      <section><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Explora y practica</p><h2 className="mt-1 text-xl font-black text-ink">Elige cómo quieres avanzar</h2></div><Link href="/practicar" className="hidden items-center gap-1 text-xs font-bold text-moss sm:flex">Ver todo <ChevronRight size={15} /></Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{quickLinks.map((item) => { const Icon = item.icon; return <Link key={item.label} href={item.href} className="surface group flex items-center gap-3 p-4 transition hover:-translate-y-1 hover:border-moss/20"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${item.color} text-forest`}><Icon size={20} /></span><span className="min-w-0"><span className="block text-sm font-black text-ink">{item.label}</span><span className="block truncate text-[10px] font-semibold text-forest/40">{item.detail}</span></span></Link>; })}</div></section>
    </div>
  );
}
