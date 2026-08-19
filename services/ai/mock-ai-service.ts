import type { AIService, AnalysisResult } from "./types";
import { normalizeAnswer } from "@/lib/utils";

function basicAnalysis(input: string, expected = ""): AnalysisResult {
  const correct = expected ? normalizeAnswer(input) === normalizeAnswer(expected) : input.trim().split(/\s+/).length >= 4;
  return {
    score: correct ? 100 : 65,
    corrected: expected || input.trim(),
    feedback: correct ? "La estructura y el orden son correctos." : "La idea se entiende. Revisa el verbo y el orden de las palabras.",
    focus: correct ? [] : ["estructura", "verbo"],
  };
}

export const mockAIService: AIService = {
  async analyzeWriting(input, expected) { return basicAnalysis(input, expected); },
  async analyzeSpeaking(transcript, expected) { return basicAnalysis(transcript, expected); },
  async generateConversationReply(input, context) {
    const value = input.toLowerCase();
    if (context === "meet") {
      if (value.includes("name") || value.includes("i'm") || value.includes("i am")) return "Nice to meet you! Where are you from?";
      if (value.includes("from") || value.includes("live")) return "That sounds great. What do you do?";
      return "Great! What do you like to do in your free time?";
    }
    if (context === "coffee") return value.includes("coffee") || value.includes("tea") ? "Of course. What size would you like?" : "We have coffee, tea, and hot chocolate. What would you like?";
    if (context === "hotel") return value.includes("yes") ? "Perfect. What name is the reservation under?" : "No problem. I can check our available rooms. How many nights?";
    return "Sure. Go straight for two blocks, then turn left. Do you understand?";
  },
  async generateExercise(topic) { return { prompt: `Escribe una frase corta sobre ${topic}.`, answer: "" }; },
  async explainError(_input, corrected) { return `Observa la estructura de la forma correcta: “${corrected}”.` },
};
