"use client";

import { ArrowRight, Brain, Check, X } from "lucide-react";
import { useState } from "react";
import { thinkInEnglish } from "@/data/practice";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ThinkInEnglishPage() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = thinkInEnglish[index];
  return <div className="animate-rise"><PageHeader eyebrow="Modo especial" title="Piensa en Inglés" description="Aprende la estructura natural de la idea, sin traducir palabra por palabra." /><div className="mx-auto mt-8 max-w-3xl"><div className="mb-4 flex items-center justify-between text-xs font-bold text-forest/45"><span>Patrón {index + 1} de {thinkInEnglish.length}</span><span>{Math.round(((index + 1) / thinkInEnglish.length) * 100)}%</span></div><ProgressBar value={((index + 1) / thinkInEnglish.length) * 100} tone="lime" /><section className="surface mt-4 overflow-hidden"><div className="soft-grid bg-lime/55 p-7 text-center sm:p-10"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/65 text-forest"><Brain size={23} /></span><p className="eyebrow mt-5">La idea en español</p><h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">{item.spanish}</h2></div><div className="p-6 sm:p-8">{!revealed ? <div className="text-center"><p className="text-sm text-forest/55">Antes de revelar, piensa: ¿qué estructura usaría naturalmente una persona en inglés?</p><button onClick={() => setRevealed(true)} className="primary-button mt-5">Ver la estructura natural <ArrowRight size={17} /></button></div> : <div className="animate-rise"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-3xl border border-coral/20 bg-coral/10 p-5"><div className="flex items-center gap-2 text-xs font-black text-coral"><X size={15} /> Traducción literal</div><p className="mt-3 text-lg font-black text-forest/60 line-through decoration-coral/60">{item.literal}</p></div><div className="rounded-3xl border border-moss/20 bg-mint/40 p-5"><div className="flex items-center gap-2 text-xs font-black text-moss"><Check size={15} /> Inglés natural</div><p className="mt-3 text-lg font-black text-forest">{item.natural}</p></div></div><div className="mt-4 rounded-2xl bg-cream p-4 text-sm leading-6 text-forest/65"><strong className="text-forest">Qué cambió:</strong> {item.reason}</div><button onClick={() => { setIndex((value) => (value + 1) % thinkInEnglish.length); setRevealed(false); }} className="primary-button mt-5 w-full sm:w-auto">Siguiente patrón <ArrowRight size={17} /></button></div>}</div></section></div></div>;
}
