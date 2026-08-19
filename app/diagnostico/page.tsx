"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Headphones, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { AudioButton } from "@/components/exercises/audio-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useProgress } from "@/components/providers/progress-provider";

const questions = [
  { prompt: "I ___ from Mexico.", options: ["am", "is", "are"], answer: "am", topic: "verbo to be" },
  { prompt: "Laura is my teacher. ___ is very patient.", options: ["He", "She", "They"], answer: "She", topic: "pronombres" },
  { prompt: "Elige la frase con orden correcto.", options: ["Coffee I like.", "I like coffee.", "I coffee like."], answer: "I like coffee.", topic: "orden de palabras" },
  { prompt: "She ___ to work every day.", options: ["go", "goes", "going"], answer: "goes", topic: "verbos" },
  { prompt: "Yesterday, we ___ at home.", options: ["was", "were", "are"], answer: "were", topic: "tiempos verbales" },
  { prompt: "Tengo hambre.", options: ["I have hunger.", "I am hungry.", "I have hungry."], answer: "I am hungry.", topic: "pensar en inglés" },
  { prompt: "Escucha y elige lo que oyes.", audio: "Where are you going?", options: ["Where you going?", "Where are you going?", "Where do you go?"], answer: "Where are you going?", topic: "listening" },
  { prompt: "“Daniel works from home.” ¿Desde dónde trabaja Daniel?", options: ["From home", "From an office", "From school"], answer: "From home", topic: "reading" },
];

export default function DiagnosticPage() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [done, setDone] = useState(false);
  const { completeDiagnostic } = useProgress();
  const question = questions[index];

  function next() {
    const nextAnswers = [...answers, selected];
    if (index === questions.length - 1) {
      const score = nextAnswers.filter((answer, i) => answer === questions[i].answer).length;
      const focus = questions.filter((item, i) => nextAnswers[i] !== item.answer).map((item) => item.topic);
      completeDiagnostic(score, [...new Set(focus)].slice(0, 3));
      setAnswers(nextAnswers);
      setDone(true);
    } else {
      setAnswers(nextAnswers);
      setIndex((value) => value + 1);
      setSelected("");
    }
  }

  if (!started) return <div className="mx-auto max-w-3xl animate-rise"><Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-forest/55"><ArrowLeft size={16} /> Volver</Link><div className="surface overflow-hidden"><div className="soft-grid bg-sky/45 p-7 text-center sm:p-10"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-white/70 text-forest"><Target size={28} /></span><p className="eyebrow mt-6">Punto de partida</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Conozcamos tus bases</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-forest/60">8 preguntas rápidas sobre to be, verbos, construcción, listening y reading. El resultado personaliza tus recomendaciones, pero nunca bloquea contenido.</p></div><div className="p-6 sm:p-8"><div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-2xl bg-cream p-4"><b className="block text-xl text-ink">8</b><span className="text-[10px] font-semibold text-forest/40">preguntas</span></div><div className="rounded-2xl bg-cream p-4"><b className="block text-xl text-ink">~5</b><span className="text-[10px] font-semibold text-forest/40">minutos</span></div><div className="rounded-2xl bg-cream p-4"><b className="block text-xl text-ink">+24</b><span className="text-[10px] font-semibold text-forest/40">XP posible</span></div></div><button onClick={() => setStarted(true)} className="primary-button mt-6 w-full">Comenzar evaluación <ArrowRight size={17} /></button></div></div></div>;

  if (done) {
    const score = answers.filter((answer, i) => answer === questions[i].answer).length;
    const missedTopics = [...new Set(questions.filter((item, i) => answers[i] !== item.answer).map((item) => item.topic))];
    return <div className="mx-auto grid min-h-[72vh] max-w-2xl place-items-center animate-rise"><div className="surface w-full p-7 text-center sm:p-10"><span className="mx-auto grid size-20 place-items-center rounded-full bg-lime text-forest"><Sparkles size={34} /></span><p className="eyebrow mt-6">Ruta personalizada</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink">Tu base está en {Math.round((score / questions.length) * 100)}%</h1><p className="mt-2 text-sm text-forest/55">Acertaste {score} de {questions.length}. Este resultado es una guía, no una etiqueta.</p><div className="mt-6 rounded-3xl bg-cream p-5 text-left"><p className="text-xs font-black text-forest">Vamos a reforzar primero:</p><div className="mt-3 flex flex-wrap gap-2">{(missedTopics.length ? missedTopics : ["práctica conversacional"]).slice(0, 4).map((topic) => <span key={topic} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-moss">{topic}</span>)}</div></div><Link href="/aprender" className="primary-button mt-6 w-full">Ver mi ruta <ArrowRight size={17} /></Link></div></div>;
  }

  return <div className="mx-auto max-w-2xl animate-rise"><div className="mb-5 flex items-center gap-3"><Link href="/" className="grid size-10 place-items-center rounded-full bg-white"><ArrowLeft size={17} /></Link><div className="flex-1"><div className="mb-2 flex justify-between text-[11px] font-bold text-forest/45"><span>Evaluación inicial</span><span>{index + 1} / {questions.length}</span></div><ProgressBar value={((index + 1) / questions.length) * 100} tone="lime" /></div></div><section className="surface p-6 sm:p-8"><span className="eyebrow">Pregunta {index + 1}</span><h1 className="mt-4 text-2xl font-black tracking-tight text-ink">{question.prompt}</h1>{question.audio && <div className="mt-5"><AudioButton text={question.audio} /></div>}<div className="mt-7 grid gap-3">{question.options.map((option) => <button key={option} onClick={() => setSelected(option)} className={`flex min-h-14 items-center justify-between rounded-2xl border px-4 text-left text-sm font-bold ${selected === option ? "border-moss bg-mint/40 text-forest" : "border-forest/10 text-forest/60"}`}><span>{option}</span><span className={`grid size-5 place-items-center rounded-full border ${selected === option ? "border-moss bg-moss text-white" : "border-forest/15"}`}>{selected === option && <Check size={12} />}</span></button>)}</div><button disabled={!selected} onClick={next} className="primary-button mt-7 w-full">{index === questions.length - 1 ? "Ver resultado" : "Siguiente"}<ArrowRight size={17} /></button><p className="mt-3 flex items-center justify-center gap-1 text-[10px] font-semibold text-forest/35"><Headphones size={12} /> Puedes volver a escuchar cuando lo necesites</p></section></div>;
}
