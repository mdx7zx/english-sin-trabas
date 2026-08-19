"use client";

import { Volume2 } from "lucide-react";
import { browserSpeechService } from "@/services/speech/browser-speech-service";
import { cn } from "@/lib/utils";

export function AudioButton({ text, slow = false, compact = false }: { text: string; slow?: boolean; compact?: boolean }) {
  return (
    <button onClick={() => browserSpeechService.speak(text, slow ? 0.62 : 0.92)} className={cn("inline-flex items-center justify-center gap-2 rounded-2xl border border-forest/10 bg-white font-bold text-forest transition hover:border-moss/30 hover:bg-mint/30", compact ? "size-10" : "min-h-12 px-4 text-sm")} aria-label={slow ? "Escuchar lentamente" : "Escuchar frase"}>
      <Volume2 size={compact ? 17 : 19} />{!compact && (slow ? "Más lento" : "Escuchar")}
    </button>
  );
}
