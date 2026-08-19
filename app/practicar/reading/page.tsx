"use client";

import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { readingStory } from "@/data/practice";
import { AudioButton } from "@/components/exercises/audio-button";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ReadingPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const question = readingStory.questions[index];
  const correct = selected === question.answer;
  function next() { setIndex((value) => (value + 1) % readingStory.questions.length); setSelected(""); setChecked(false); }
  return <div className="animate-rise"><PageHeader eyebrow="Reading" title="Lee para entender, no para traducir" description="Busca personas, acciones y detalles clave. El contexto suele darte más que cada palabra aislada." /><div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><article className="surface p-6 sm:p-8"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#ffe9bd] text-forest"><BookOpen size={21} /></span><AudioButton text={readingStory.text} compact /></div><p className="eyebrow mt-7">{readingStory.level}</p><h2 className="mt-2 text-2xl font-black tracking-tight text-ink">{readingStory.title}</h2><p className="mt-5 text-[17px] leading-8 text-forest/70">{readingStory.text}</p><div className="mt-6 rounded-2xl bg-mint/35 p-4 text-xs leading-5 text-forest/60"><strong className="text-forest">Estrategia:</strong> subraya mentalmente Daniel, live, work, morning y evening. Son las anclas del texto.</div></article><section className="surface p-6 sm:p-8"><div className="flex items-center justify-between"><span className="eyebrow">Comprensión</span><span className="text-[11px] font-bold text-forest/40">{index + 1}/{readingStory.questions.length}</span></div><ProgressBar value={((index + 1) / readingStory.questions.length) * 100} tone="lime" className="mt-3" /><h3 className="mt-7 text-xl font-black text-ink">{question.prompt}</h3><div className="mt-5 grid gap-2.5">{question.options.map((option) => <button disabled={checked} key={option} onClick={() => setSelected(option)} className={`flex min-h-13 items-center justify-between rounded-2xl border px-4 text-left text-sm font-bold ${selected === option ? "border-moss bg-mint/40 text-forest" : "border-forest/10 text-forest/60"}`}>{option}{selected === option && <Check size={15} />}</button>)}</div>{!checked ? <button disabled={!selected} onClick={() => setChecked(true)} className="primary-button mt-6 w-full">Comprobar <ArrowRight size={16} /></button> : <div className={`mt-5 rounded-2xl p-4 ${correct ? "bg-mint/45" : "bg-coral/10"}`}><div className="flex items-center gap-2"><Sparkles size={17} className={correct ? "text-moss" : "text-coral"} /><p className="text-sm font-black text-ink">{correct ? "¡Correcto!" : `La respuesta es: ${question.answer}`}</p></div><p className="mt-2 text-xs leading-5 text-forest/55">La respuesta aparece directamente en el texto. Localiza la oración que menciona la misma persona o acción.</p><button onClick={next} className="primary-button mt-4 w-full">Siguiente <ArrowRight size={16} /></button></div>}</section></div></div>;
}
