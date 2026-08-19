export type AnalysisResult = {
  score: number;
  corrected: string;
  feedback: string;
  focus: string[];
};

export interface AIService {
  analyzeWriting(input: string, expected?: string): Promise<AnalysisResult>;
  analyzeSpeaking(transcript: string, expected: string): Promise<AnalysisResult>;
  generateConversationReply(input: string, context: string): Promise<string>;
  generateExercise(topic: string, difficulty: number): Promise<{ prompt: string; answer: string }>;
  explainError(input: string, corrected: string): Promise<string>;
}
