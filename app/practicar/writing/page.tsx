"use client";

import { ArrowRight, Check, Lightbulb, PenLine, RotateCcw } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { writingPrompts } from "@/data/practice";
import { isAnswerCorrect } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function WritingPage() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const prompt = writingPrompts[index];
  const correct = isAnswerCorrect(input, prompt.answer);
  function next() { setIndex((value) => (value + 1) % writingPrompts.length); setInput(""); setChecked(false); }
  return <div className="animate-rise"><PageHeader eyebrow="Escribe en Inglés" title="Construye antes de corregir" description="Escribe la idea completa y recibe una corrección enfocada en estructura, verbo, tiempo y orden." /><div className="mx-auto mt-8 max-w-3xl"><div className="mb-3 flex justify-between text-[11px] font-bold text-forest/45"><span>Ejercicio {index + 1} / {writingPrompts.length}</span><span>Enfoque: {prompt.focus}</span></div><ProgressBar value={((index + 1) / writingPrompts.length) * 100} tone="lime" /><section className="surface mt-4 p-6 sm:p-9"><span className="grid size-11 place-items-center rounded-2xl bg-[#eee6ff] text-forest"><PenLine size={20} /></span><p className="eyebrow mt-6">Escribe en inglés</p><h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">“{prompt.spanish}”</h2><textarea autoFocus value={input} disabled={checked} onChange={(event) => setInput(event.target.value)} placeholder="Escribe tu frase aquí…" className="mt-6 min-h-32 w-full resize-none rounded-3xl border border-forest/15 bg-cream/35 p-4 text-base font-semibold leading-7 text-forest outline-none focus:border-moss" />{!checked ? <button onClick={() => setChecked(true)} disabled={!input.trim()} className="primary-button mt-4 w-full">Revisar mi frase <ArrowRight size={17} /></button> : <div className={`mt-5 animate-rise rounded-3xl p-5 ${correct ? "bg-mint/45" : "bg-coral/10"}`}><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-full ${correct ? "bg-moss" : "bg-coral"} text-white`}>{correct ? <Check size={16} /> : <Lightbulb size={16} />}</span><p className="font-black text-ink">{correct ? "¡La estructura es correcta!" : "La idea se entiende; ajustemos la forma."}</p></div>{!correct && <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-white/75 p-3"><span className="text-[9px] font-black uppercase tracking-wider text-forest/35">Lo que escribiste</span><p className="mt-1 text-sm text-forest/60">{input}</p></div><div className="rounded-2xl bg-white/75 p-3"><span className="text-[9px] font-black uppercase tracking-wider text-forest/35">Versión corregida</span><p className="mt-1 text-sm font-bold text-forest">{prompt.answer}.</p></div></div>}<p className="mt-3 text-sm leading-6 text-forest/60"><strong className="text-forest">Qué ocurrió:</strong> {prompt.explanation}</p><p className="mt-2 text-xs text-moss"><strong>Cómo recordarlo:</strong> {prompt.focus}.</p><div className="mt-5 flex gap-2">{!correct && <button onClick={() => { setChecked(false); setInput(""); }} className="secondary-button"><RotateCcw size={15} /> Reintentar</button>}<button onClick={next} className="primary-button flex-1">Continuar <ArrowRight size={16} /></button></div></div>}</section></div></div>;
}
