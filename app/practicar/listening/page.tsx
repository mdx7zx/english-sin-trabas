"use client";

import { ArrowRight, Check, Headphones, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { listeningChallenges } from "@/data/practice";
import { PageHeader } from "@/components/ui/page-header";
import { AudioButton } from "@/components/exercises/audio-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { localListeningService } from "@/services/listening";
import { normalizeAnswer } from "@/lib/utils";

export default function ListeningPage() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const challenge = listeningChallenges[index];
  const result = localListeningService.compare(input, challenge.text);
  const correct = normalizeAnswer(input) === normalizeAnswer(challenge.text);
  function next() { setIndex((value) => (value + 1) % listeningChallenges.length); setInput(""); setChecked(false); }
  return <div className="animate-rise"><PageHeader eyebrow="Listening" title="Escucha la idea, después las palabras" description="Puedes repetir cada frase a velocidad normal o lenta. Escribe exactamente lo que reconoces." /><div className="mx-auto mt-8 max-w-3xl"><div className="mb-3 flex justify-between text-[11px] font-bold text-forest/45"><span>Reto {index + 1} / {listeningChallenges.length}</span><span>Dificultad {challenge.level}</span></div><ProgressBar value={((index + 1) / listeningChallenges.length) * 100} tone="sky" /><section className="surface mt-4 p-6 sm:p-9"><div className="mx-auto grid size-20 place-items-center rounded-4xl bg-sky/45 text-forest"><Headphones size={32} /></div><p className="mt-6 text-center text-xs font-black uppercase tracking-[0.16em] text-moss">Escucha sin ver el texto</p><div className="mt-5 flex flex-wrap justify-center gap-2"><AudioButton text={challenge.text} /><AudioButton text={challenge.text} slow /></div><label className="mt-7 block"><span className="text-xs font-bold text-forest/55">¿Qué escuchaste?</span><input value={input} disabled={checked} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && input.trim()) setChecked(true); }} placeholder="Escribe la frase en inglés…" className="mt-2 h-14 w-full rounded-2xl border border-forest/15 px-4 text-sm font-semibold text-forest outline-none focus:border-moss" /></label>{!checked ? <button onClick={() => setChecked(true)} disabled={!input.trim()} className="primary-button mt-5 w-full">Comprobar <ArrowRight size={17} /></button> : <div className={`mt-5 animate-rise rounded-3xl p-5 ${correct ? "bg-mint/45" : "bg-coral/10"}`}><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-full ${correct ? "bg-moss" : "bg-coral"} text-white`}>{correct ? <Check size={16} /> : <Sparkles size={16} />}</span><p className="font-black text-ink">{correct ? "¡Escuchaste todo!" : `${result.accuracy}% de palabras reconocidas`}</p></div>{!correct && <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-white/70 p-3"><span className="text-[9px] font-black uppercase tracking-wider text-forest/35">Tu respuesta</span><p className="mt-1 text-sm font-semibold text-forest/60">{input}</p></div><div className="rounded-2xl bg-white/70 p-3"><span className="text-[9px] font-black uppercase tracking-wider text-forest/35">Frase correcta</span><p className="mt-1 text-sm font-bold text-forest">{challenge.text}</p></div></div>}{result.missing.length > 0 && <p className="mt-3 text-xs text-forest/60"><strong>Palabras que faltaron:</strong> {result.missing.join(", ")}</p>}<p className="mt-3 text-xs leading-5 text-forest/55"><strong>Cómo escucharlo:</strong> {challenge.tip}</p><div className="mt-4 flex gap-2"><button onClick={() => { setInput(""); setChecked(false); }} className="secondary-button"><RotateCcw size={15} /> Reintentar</button><button onClick={next} className="primary-button flex-1">Siguiente <ArrowRight size={16} /></button></div></div>}</section></div></div>;
}
