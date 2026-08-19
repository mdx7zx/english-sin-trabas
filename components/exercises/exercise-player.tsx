"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Mic2, Sparkles, Trophy } from "lucide-react";
import type { Lesson } from "@/types";
import { isAnswerCorrect } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AudioButton } from "./audio-button";
import { FeedbackPanel } from "./feedback-panel";
import { browserSpeechService } from "@/services/speech/browser-speech-service";
import { useProgress } from "@/components/providers/progress-provider";

const colorStyles = {
  mint: "bg-mint",
  lime: "bg-lime",
  sky: "bg-sky",
  coral: "bg-coral/80",
};

export function ExercisePlayer({ lesson }: { lesson: Lesson }) {
  const [stage, setStage] = useState<"concept" | "exercise" | "done">("concept");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [earnedXp, setEarnedXp] = useState(0);
  const { progress, recordAnswer, completeLesson } = useProgress();

  const current = lesson.exercises[index];
  const response = current?.kind === "arrange" ? selectedWords.join(" ") : answer;
  const correct = current ? isAnswerCorrect(response, current.answer, current.acceptedAnswers) : false;
  const alreadyComplete = progress.completedLessons.includes(lesson.id);
  const availableWords = useMemo(() => {
    const used = [...selectedWords];
    return (current?.words ?? []).filter((word) => {
      const usedIndex = used.indexOf(word);
      if (usedIndex === -1) return true;
      used.splice(usedIndex, 1);
      return false;
    });
  }, [current?.words, selectedWords]);

  function submit() {
    if (!current || submitted || !response.trim()) return;
    const result = isAnswerCorrect(response, current.answer, current.acceptedAnswers);
    recordAnswer(current, response, result);
    setSubmitted(true);
  }

  function continueFlow() {
    if (!correct) {
      setAnswer("");
      setSelectedWords([]);
      setSubmitted(false);
      setShowHelp(true);
      return;
    }
    if (index === lesson.exercises.length - 1) {
      setEarnedXp(alreadyComplete && lesson.id !== "daily-practice" ? 0 : lesson.xp);
      completeLesson(lesson.id, lesson.xp, lesson.duration);
      setStage("done");
    } else {
      setAnswer("");
      setSelectedWords([]);
      setSubmitted(false);
      setShowHelp(false);
      setSpeechError("");
      setIndex((value) => value + 1);
    }
  }

  async function startSpeaking() {
    setSpeechError("");
    setRecording(true);
    try {
      const result = await browserSpeechService.transcribeAudio();
      setAnswer(result.transcript);
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : "No pudimos reconocer tu voz.");
    } finally {
      setRecording(false);
    }
  }

  if (stage === "concept") {
    return (
      <div className="mx-auto max-w-4xl animate-rise">
        <Link href="/aprender" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-forest/55 hover:text-forest"><ArrowLeft size={16} /> Volver a la ruta</Link>
        <div className="surface overflow-hidden">
          <div className={`${colorStyles[lesson.color]} soft-grid px-6 py-7 sm:px-10 sm:py-9`}>
            <div className="flex items-center justify-between gap-4"><span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-forest">Lección {lesson.number}</span><span className="text-xs font-bold text-forest/60">{lesson.duration} min · +{lesson.xp} XP</span></div>
            <p className="eyebrow mt-10">{lesson.eyebrow}</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-black tracking-[-0.04em] text-ink sm:text-5xl">{lesson.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-forest/65 sm:text-base">{lesson.description}</p>
          </div>
          <div className="px-6 py-7 sm:px-10 sm:py-9">
            <h2 className="text-xl font-black tracking-tight text-ink">{lesson.concept.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-forest/65">{lesson.concept.body}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {lesson.concept.examples.map((example) => (
                <div key={example.english} className="rounded-3xl border border-forest/10 bg-cream p-5">
                  <div className="flex items-start justify-between gap-3"><p className="text-lg font-black text-forest">{example.english}</p><AudioButton text={example.english} compact /></div>
                  <p className="mt-1 text-sm text-forest/50">{example.spanish}</p>
                  {example.parts && <div className="mt-4 flex flex-wrap gap-1.5">{example.parts.map((part) => <span key={part} className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-moss">{part}</span>)}</div>}
                </div>
              ))}
            </div>
            <button onClick={() => setStage("exercise")} className="primary-button mt-7 w-full sm:w-auto">Empezar práctica <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center text-center">
        <div className="surface w-full overflow-hidden p-7 sm:p-10">
          <div className="mx-auto grid size-24 place-items-center rounded-full bg-lime text-forest shadow-lg shadow-lime/30"><Trophy size={42} /></div>
          <p className="eyebrow mt-7">Lección completada</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">¡Una traba menos!</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-forest/60">Terminaste “{lesson.title}”. Tu práctica y tus errores ya se guardaron en este dispositivo.</p>
          <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 gap-3"><div className="rounded-2xl bg-cream p-4"><span className="block text-2xl font-black text-forest">+{earnedXp}</span><span className="text-xs font-semibold text-forest/45">XP ganados</span></div><div className="rounded-2xl bg-cream p-4"><span className="block text-2xl font-black text-forest">{lesson.exercises.length}</span><span className="text-xs font-semibold text-forest/45">ejercicios</span></div></div>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row"><Link href="/aprender" className="secondary-button">Ver mi ruta</Link><Link href="/practica-diaria" className="primary-button">Seguir practicando <ArrowRight size={17} /></Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/aprender" className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-forest shadow-sm"><ArrowLeft size={18} /></Link>
        <div className="min-w-0 flex-1"><div className="flex justify-between text-[11px] font-bold text-forest/50"><span>{lesson.title}</span><span>{index + 1} / {lesson.exercises.length}</span></div><ProgressBar className="mt-2" value={((index + (submitted && correct ? 1 : 0)) / lesson.exercises.length) * 100} tone="lime" /></div>
      </div>

      <section className="surface p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-mint/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-moss">Dificultad {current.difficulty}</span><button onClick={() => setShowHelp((value) => !value)} className="inline-flex items-center gap-1.5 text-xs font-bold text-forest/45 hover:text-forest"><HelpCircle size={16} /> No entiendo</button></div>
        <p className="mt-7 text-xs font-bold text-moss">{current.instruction ?? "Responde con la forma correcta."}</p>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-ink sm:text-3xl">{current.prompt}</h1>

        {showHelp && <div className="mt-5 flex gap-3 rounded-2xl bg-[#f0f7e5] p-4 text-sm leading-6 text-forest/65"><Sparkles className="mt-0.5 shrink-0 text-moss" size={18} /><div><strong className="block text-forest">Vamos por partes</strong>{current.hint}{current.breakdown && <div className="mt-2 flex flex-wrap gap-1.5">{current.breakdown.map((part) => <span key={part.label} className="rounded-lg bg-white px-2 py-1 text-xs"><b>{part.label}</b> · {part.role}</span>)}</div>}</div></div>}

        {current.kind === "choice" && <div className="mt-6 grid gap-2.5">{current.options?.map((option) => <button disabled={submitted} key={option} onClick={() => setAnswer(option)} className={`flex min-h-14 items-center justify-between rounded-2xl border px-4 text-left text-sm font-bold transition ${answer === option ? "border-moss bg-mint/40 text-forest ring-2 ring-moss/10" : "border-forest/10 bg-white text-forest/65 hover:border-moss/30"}`}><span>{option}</span><span className={`grid size-5 place-items-center rounded-full border ${answer === option ? "border-moss bg-moss text-white" : "border-forest/15"}`}>{answer === option && <Check size={12} />}</span></button>)}</div>}

        {current.kind === "arrange" && <div className="mt-6"><div className="flex min-h-[92px] flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-forest/15 bg-cream/60 p-3">{selectedWords.length === 0 && <span className="m-auto text-xs font-semibold text-forest/30">Toca las palabras para construir la frase</span>}{selectedWords.map((word, wordIndex) => <button disabled={submitted} key={`${word}-${wordIndex}`} onClick={() => setSelectedWords((value) => value.filter((_, i) => i !== wordIndex))} className="rounded-xl bg-forest px-3 py-2 text-sm font-bold text-white shadow-sm">{word}</button>)}</div><div className="mt-4 flex flex-wrap gap-2">{availableWords.map((word, wordIndex) => <button disabled={submitted} key={`${word}-${wordIndex}`} onClick={() => setSelectedWords((value) => [...value, word])} className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm font-bold text-forest shadow-sm hover:-translate-y-0.5">{word}</button>)}</div></div>}

        {(current.kind === "fill" || current.kind === "listen") && <div className="mt-6">{current.kind === "listen" && current.audioText && <div className="mb-4 flex flex-wrap gap-2"><AudioButton text={current.audioText} /><AudioButton text={current.audioText} slow /></div>}<input autoFocus value={answer} disabled={submitted} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} placeholder={current.kind === "listen" ? "Escribe lo que escuchaste…" : "Escribe tu respuesta…"} className="h-14 w-full rounded-2xl border border-forest/15 bg-white px-4 text-base font-semibold text-forest placeholder:text-forest/25 focus:border-moss" /></div>}

        {current.kind === "speak" && current.audioText && <div className="mt-6 rounded-3xl bg-cream p-5 text-center"><p className="text-lg font-black text-forest">“{current.audioText}”</p><div className="mt-4 flex justify-center gap-2"><AudioButton text={current.audioText} /><button onClick={startSpeaking} disabled={recording || submitted} className={`primary-button ${recording ? "recording-ring !bg-coral" : ""}`}><Mic2 size={18} /> {recording ? "Escuchando…" : "Tu turno"}</button></div>{answer && <div className="mt-4 rounded-2xl bg-white p-3 text-left text-sm"><span className="text-[10px] font-bold uppercase tracking-wider text-forest/40">Detectado</span><p className="mt-1 font-semibold text-forest">{answer}</p></div>}{speechError && <div className="mt-4 text-sm text-coral">{speechError} Puedes escribir la frase para continuar.</div>}{!browserSpeechService.isRecognitionAvailable() && <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Escribe aquí si tu navegador no admite micrófono" className="mt-4 h-12 w-full rounded-xl border border-forest/10 bg-white px-3 text-sm" />}</div>}

        {!submitted && <button onClick={submit} disabled={!response.trim()} className="primary-button mt-7 w-full sm:w-auto">Comprobar <ArrowRight size={17} /></button>}
      </section>

      {submitted && <div className="mt-4"><FeedbackPanel correct={correct} userAnswer={response} exercise={current} onContinue={continueFlow} /></div>}
    </div>
  );
}
