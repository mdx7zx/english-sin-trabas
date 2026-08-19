"use client";

import { Check, ChevronRight, Lightbulb, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import type { Exercise } from "@/types";

export function FeedbackPanel({ correct, userAnswer, exercise, onContinue }: { correct: boolean; userAnswer: string; exercise: Exercise; onContinue: () => void }) {
  const [showWhy, setShowWhy] = useState(false);
  return (
    <div className={`animate-rise rounded-3xl border p-5 sm:p-6 ${correct ? "border-moss/20 bg-mint/35" : "border-coral/25 bg-[#fff2ed]"}`}>
      <div className="flex items-start gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${correct ? "bg-moss text-white" : "bg-coral text-white"}`}>{correct ? <Check size={21} /> : <X size={21} />}</span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-black tracking-tight text-ink">{correct ? "¡Exacto!" : "Casi. Vamos a verlo."}</p>
          {!correct && <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div className="rounded-2xl bg-white/75 p-3"><span className="block text-[10px] font-bold uppercase tracking-wider text-forest/45">Tu respuesta</span><span className="mt-1 block font-semibold text-forest/70">{userAnswer || "Sin respuesta"}</span></div><div className="rounded-2xl bg-white/75 p-3"><span className="block text-[10px] font-bold uppercase tracking-wider text-forest/45">Forma correcta</span><span className="mt-1 block font-bold text-forest">{exercise.answer}</span></div></div>}
          <p className="mt-3 text-sm leading-6 text-forest/70">{exercise.explanation}</p>
          {showWhy && <div className="mt-3 flex gap-2 rounded-2xl bg-white/70 p-3 text-sm text-forest/70"><Lightbulb className="mt-0.5 shrink-0 text-moss" size={17} /><span><strong className="text-forest">Cómo recordarlo:</strong> {exercise.hint}</span></div>}
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setShowWhy((value) => !value)} className="secondary-button"><Lightbulb size={16} /> ¿Por qué?</button>
            <button onClick={onContinue} className="primary-button flex-1 sm:flex-none">{correct ? "Continuar" : "Practicar otra parecida"}{correct ? <ChevronRight size={17} /> : <RotateCcw size={16} />}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
