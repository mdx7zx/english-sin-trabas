export interface ListeningService {
  compare(transcript: string, expected: string): { missing: string[]; extra: string[]; accuracy: number };
}

export const localListeningService: ListeningService = {
  compare(transcript, expected) {
    const actualWords = transcript.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
    const expectedWords = expected.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
    const missing = expectedWords.filter((word) => !actualWords.includes(word));
    const extra = actualWords.filter((word) => !expectedWords.includes(word));
    return { missing, extra, accuracy: Math.round(((expectedWords.length - missing.length) / expectedWords.length) * 100) };
  },
};
