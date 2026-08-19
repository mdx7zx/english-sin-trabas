export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[.,!?¿¡']/g, "")
    .replace(/\s+/g, " ");
}

export function isAnswerCorrect(value: string, answer: string, accepted: string[] = []) {
  const normalized = normalizeAnswer(value);
  return [answer, ...accepted].some((candidate) => normalizeAnswer(candidate) === normalized);
}
