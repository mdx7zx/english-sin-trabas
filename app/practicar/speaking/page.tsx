"use client";

import { ArrowRight, Check, Mic2, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { AudioButton } from "@/components/exercises/audio-button";
import { browserSpeechService } from "@/services/speech/browser-speech-service";
import { localListeningService } from "@/services/listening";
import { ProgressBar } from "@/components/ui/progress-bar";

const phrases = ["I work in Mexico.", "She is studying English.", "We were at home yesterday.", "I will go to work tomorrow."];

export default function SpeakingPage() {
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [previous, setPrevious] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const phrase = phrases[index];
  const result = transcript ? localListeningService.compare(transcript, phrase) : null;
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRecognitionAvailable(browserSpeechService.isRecognitionAvailable()));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  async function record() { setRecording(true); setError(""); try { const speech = await browserSpeechService.transcribeAudio(); setTranscript(speech.transcript); } catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos reconocer tu voz."); } finally { setRecording(false); } }
  function retry() { if (result) setPrevious(result.accuracy); setTranscript(""); setAttempt((value) => value + 1); }
  function next() { setIndex((value) => (value + 1) % phrases.length); setTranscript(""); setAttempt(1); setPrevious(null); }
  return <div className="animate-rise"><PageHeader eyebrow="Habla conmigo" title="Tu voz también aprende" description="Escucha, repite y revisa qué palabras reconoce tu navegador. Esta versión mide coincidencia de palabras, no fonética avanzada." /><div className="mx-auto mt-8 max-w-3xl"><section className="surface overflow-hidden"><div className="soft-grid bg-coral/15 p-7 text-center sm:p-10"><span className="eyebrow">Frase {index + 1} · Intento {attempt}</span><h2 className="mx-auto mt-4 max-w-xl text-3xl font-black tracking-tight text-ink sm:text-4xl">“{phrase}”</h2><div className="mt-5 flex justify-center"><AudioButton text={phrase} /></div></div><div className="p-6 sm:p-8"><div className="flex flex-col items-center"><button onClick={record} disabled={recording} className={`grid size-20 place-items-center rounded-full bg-forest text-white shadow-float transition hover:scale-105 ${recording ? "recording-ring !bg-coral" : ""}`} aria-label="Grabar voz"><Mic2 size={29} /></button><p className="mt-3 text-xs font-bold text-forest/45">{recording ? "Te escucho…" : "Toca y di la frase"}</p></div>{error && <div className="mt-5 rounded-2xl bg-coral/10 p-4 text-center text-sm text-coral">{error}<input value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="Puedes escribir tu frase para probar la comparación" className="mt-3 h-11 w-full rounded-xl border border-coral/15 bg-white px-3 text-forest" /></div>}{!recognitionAvailable && !error && <div className="mt-5 rounded-2xl bg-[#fff6e6] p-4 text-sm text-forest/60">Tu navegador no expone reconocimiento de voz. Puedes probar la lógica escribiendo lo que dijiste.<input value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="Escribe la frase detectada…" className="mt-3 h-11 w-full rounded-xl border border-forest/10 bg-white px-3" /></div>}{result && <div className="mt-6 animate-rise rounded-3xl bg-cream p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-mint text-moss">{result.accuracy >= 85 ? <Check size={16} /> : <Sparkles size={16} />}</span><p className="font-black text-ink">{result.accuracy >= 85 ? "¡Muy claro!" : "Casi correcto"}</p></div><span className="text-xl font-black text-forest">{result.accuracy}%</span></div><ProgressBar value={result.accuracy} tone={result.accuracy >= 85 ? "forest" : "coral"} className="mt-4" /><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-white p-3"><span className="text-[9px] font-black uppercase tracking-wider text-forest/35">Esperado</span><p className="mt-1 text-sm font-bold text-forest">{phrase}</p></div><div className="rounded-2xl bg-white p-3"><span className="text-[9px] font-black uppercase tracking-wider text-forest/35">Detectado</span><p className="mt-1 text-sm font-semibold text-forest/60">{transcript}</p></div></div><div className="mt-3 flex flex-wrap gap-3 text-xs text-forest/55"><span><strong>Omitidas:</strong> {result.missing.length ? result.missing.join(", ") : "ninguna"}</span>{previous !== null && <span className={result.accuracy >= previous ? "text-moss" : "text-coral"}><strong>Desde el intento anterior:</strong> {result.accuracy - previous >= 0 ? "+" : ""}{result.accuracy - previous}%</span>}</div><div className="mt-5 flex gap-2"><button onClick={retry} className="secondary-button"><RotateCcw size={15} /> Intentar otra vez</button><button onClick={next} className="primary-button flex-1">Siguiente <ArrowRight size={16} /></button></div></div>}</div></section></div></div>;
}
