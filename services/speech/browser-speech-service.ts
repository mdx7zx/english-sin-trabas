import type { SpeechResult, SpeechService } from "./types";

type RecognitionResultEvent = Event & {
  results: { 0: { 0: { transcript: string; confidence: number } } };
};

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  start(): void;
};

type RecognitionConstructor = new () => RecognitionLike;

function recognitionConstructor() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as typeof window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
}

export const browserSpeechService: SpeechService = {
  speak(text, rate = 0.92) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  },
  transcribeAudio() {
    return new Promise<SpeechResult>((resolve, reject) => {
      const Recognition = recognitionConstructor();
      if (!Recognition) return reject(new Error("Reconocimiento de voz no disponible"));
      const recognition = new Recognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => resolve({ transcript: event.results[0][0].transcript, confidence: event.results[0][0].confidence });
      recognition.onerror = () => reject(new Error("No pudimos reconocer tu voz"));
      recognition.start();
    });
  },
  isRecognitionAvailable() { return Boolean(recognitionConstructor()); },
};
