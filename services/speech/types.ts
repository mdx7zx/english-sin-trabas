export type SpeechResult = { transcript: string; confidence?: number };

export interface SpeechService {
  speak(text: string, rate?: number): void;
  transcribeAudio(): Promise<SpeechResult>;
  isRecognitionAvailable(): boolean;
}
