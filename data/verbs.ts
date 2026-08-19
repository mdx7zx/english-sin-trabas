import type { Verb } from "@/types";

export const verbs: Verb[] = [
  { base: "be", third: "is", past: "was / were", participle: "been", gerund: "being", meaning: "ser / estar", irregular: true },
  { base: "have", third: "has", past: "had", participle: "had", gerund: "having", meaning: "tener", irregular: true },
  { base: "do", third: "does", past: "did", participle: "done", gerund: "doing", meaning: "hacer", irregular: true },
  { base: "go", third: "goes", past: "went", participle: "gone", gerund: "going", meaning: "ir", irregular: true },
  { base: "come", third: "comes", past: "came", participle: "come", gerund: "coming", meaning: "venir", irregular: true },
  { base: "eat", third: "eats", past: "ate", participle: "eaten", gerund: "eating", meaning: "comer", irregular: true },
  { base: "drink", third: "drinks", past: "drank", participle: "drunk", gerund: "drinking", meaning: "beber", irregular: true },
  { base: "work", third: "works", past: "worked", participle: "worked", gerund: "working", meaning: "trabajar" },
  { base: "study", third: "studies", past: "studied", participle: "studied", gerund: "studying", meaning: "estudiar" },
  { base: "live", third: "lives", past: "lived", participle: "lived", gerund: "living", meaning: "vivir" },
  { base: "want", third: "wants", past: "wanted", participle: "wanted", gerund: "wanting", meaning: "querer" },
  { base: "need", third: "needs", past: "needed", participle: "needed", gerund: "needing", meaning: "necesitar" },
  { base: "like", third: "likes", past: "liked", participle: "liked", gerund: "liking", meaning: "gustar" },
  { base: "love", third: "loves", past: "loved", participle: "loved", gerund: "loving", meaning: "amar / encantar" },
  { base: "know", third: "knows", past: "knew", participle: "known", gerund: "knowing", meaning: "saber / conocer", irregular: true },
  { base: "think", third: "thinks", past: "thought", participle: "thought", gerund: "thinking", meaning: "pensar", irregular: true },
  { base: "say", third: "says", past: "said", participle: "said", gerund: "saying", meaning: "decir", irregular: true },
  { base: "tell", third: "tells", past: "told", participle: "told", gerund: "telling", meaning: "decir / contar", irregular: true },
  { base: "speak", third: "speaks", past: "spoke", participle: "spoken", gerund: "speaking", meaning: "hablar", irregular: true },
  { base: "see", third: "sees", past: "saw", participle: "seen", gerund: "seeing", meaning: "ver", irregular: true },
  { base: "look", third: "looks", past: "looked", participle: "looked", gerund: "looking", meaning: "mirar" },
  { base: "watch", third: "watches", past: "watched", participle: "watched", gerund: "watching", meaning: "ver / observar" },
  { base: "hear", third: "hears", past: "heard", participle: "heard", gerund: "hearing", meaning: "oír", irregular: true },
  { base: "listen", third: "listens", past: "listened", participle: "listened", gerund: "listening", meaning: "escuchar" },
  { base: "make", third: "makes", past: "made", participle: "made", gerund: "making", meaning: "hacer / crear", irregular: true },
  { base: "take", third: "takes", past: "took", participle: "taken", gerund: "taking", meaning: "tomar / llevar", irregular: true },
  { base: "give", third: "gives", past: "gave", participle: "given", gerund: "giving", meaning: "dar", irregular: true },
  { base: "get", third: "gets", past: "got", participle: "gotten", gerund: "getting", meaning: "obtener / llegar", irregular: true },
  { base: "buy", third: "buys", past: "bought", participle: "bought", gerund: "buying", meaning: "comprar", irregular: true },
  { base: "bring", third: "brings", past: "brought", participle: "brought", gerund: "bringing", meaning: "traer", irregular: true },
  { base: "find", third: "finds", past: "found", participle: "found", gerund: "finding", meaning: "encontrar", irregular: true },
  { base: "feel", third: "feels", past: "felt", participle: "felt", gerund: "feeling", meaning: "sentir", irregular: true },
  { base: "leave", third: "leaves", past: "left", participle: "left", gerund: "leaving", meaning: "salir / dejar", irregular: true },
  { base: "put", third: "puts", past: "put", participle: "put", gerund: "putting", meaning: "poner", irregular: true },
  { base: "read", third: "reads", past: "read", participle: "read", gerund: "reading", meaning: "leer", irregular: true },
  { base: "write", third: "writes", past: "wrote", participle: "written", gerund: "writing", meaning: "escribir", irregular: true },
  { base: "learn", third: "learns", past: "learned", participle: "learned", gerund: "learning", meaning: "aprender" },
  { base: "understand", third: "understands", past: "understood", participle: "understood", gerund: "understanding", meaning: "entender", irregular: true },
];

export const verbExamples: Record<string, { label: string; sentence: string; note: string }[]> = {
  be: [
    { label: "Present", sentence: "I am ready.", note: "Estado actual" },
    { label: "Past", sentence: "I was tired yesterday.", note: "Estado pasado" },
    { label: "Future", sentence: "I will be there tomorrow.", note: "Estado futuro" },
    { label: "Perfect", sentence: "I have been there before.", note: "Experiencia" },
    { label: "Continuous", sentence: "You are being very kind.", note: "Conducta temporal" },
  ],
  go: [
    { label: "Present", sentence: "I go to work every day.", note: "Rutina" },
    { label: "Past", sentence: "I went to work yesterday.", note: "Acción terminada" },
    { label: "Future", sentence: "I will go to work tomorrow.", note: "Plan futuro" },
    { label: "Perfect", sentence: "I have gone there before.", note: "Experiencia" },
    { label: "Continuous", sentence: "I am going to work.", note: "Ahora / en camino" },
  ],
};

export function examplesForVerb(verb: Verb) {
  if (verbExamples[verb.base]) return verbExamples[verb.base];
  return [
    { label: "Present", sentence: `I ${verb.base} every day.`, note: "Rutina" },
    { label: "Third person", sentence: `She ${verb.third} every day.`, note: "He / she / it" },
    { label: "Past", sentence: `I ${verb.past} yesterday.`, note: "Acción terminada" },
    { label: "Future", sentence: `I will ${verb.base} tomorrow.`, note: "Futuro" },
    { label: "Continuous", sentence: `I am ${verb.gerund} now.`, note: "En progreso" },
  ];
}
