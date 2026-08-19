export const thinkInEnglish = [
  { spanish: "Tengo 25 años.", literal: "I have 25 years.", natural: "I am 25 years old.", reason: "En inglés, la edad se expresa como un estado con to be." },
  { spanish: "Tengo hambre.", literal: "I have hunger.", natural: "I am hungry.", reason: "Hungry es un adjetivo: describe cómo te sientes." },
  { spanish: "Hace frío.", literal: "It makes cold.", natural: "It is cold.", reason: "El clima usa it + to be." },
  { spanish: "Estoy de acuerdo.", literal: "I am of agreement.", natural: "I agree.", reason: "Agree ya es un verbo; no necesita to be." },
  { spanish: "¿Cómo te llamas?", literal: "How do you call yourself?", natural: "What's your name?", reason: "La pregunta cotidiana en inglés usa name." },
];

export const listeningChallenges = [
  { id: "listen-standalone-1", text: "I work from home on Fridays.", tip: "Busca primero quién y la acción principal.", level: 1 },
  { id: "listen-standalone-2", text: "Where are you going this afternoon?", tip: "No pierdas la palabra are en la pregunta.", level: 2 },
  { id: "listen-standalone-3", text: "She went to the market before work.", tip: "Went indica una acción en el pasado.", level: 2 },
  { id: "listen-standalone-4", text: "We have been very busy this week.", tip: "Escucha el bloque have been.", level: 3 },
];

export const writingPrompts = [
  { spanish: "Yo trabajo en México.", answer: "I work in Mexico", focus: "Sujeto + verbo + lugar", explanation: "Con I usamos la forma base work." },
  { spanish: "Ella estudia inglés todos los días.", answer: "She studies English every day", focus: "Tercera persona", explanation: "Con she, study cambia a studies." },
  { spanish: "Ayer estuvimos en casa.", answer: "We were at home yesterday", focus: "Pasado de to be", explanation: "Con we usamos were y yesterday marca pasado." },
  { spanish: "Mañana iré al trabajo.", answer: "I will go to work tomorrow", focus: "Futuro", explanation: "Después de will usamos la forma base go." },
];

export const readingStory = {
  title: "A quiet morning",
  level: "A1 · 54 palabras",
  text: "My name is Daniel. I live in Puebla with my sister. I work in a small office near my home. Every morning, I drink coffee and walk to work. My sister studies English online. In the evening, we cook dinner together and talk about our day.",
  questions: [
    { prompt: "Where does Daniel live?", options: ["In Puebla", "In Mexico City", "Near his school"], answer: "In Puebla" },
    { prompt: "How does Daniel go to work?", options: ["By bus", "He walks", "By car"], answer: "He walks" },
    { prompt: "What does his sister study?", options: ["English", "Cooking", "Business"], answer: "English" },
  ],
};

export const conversationScenarios = [
  { id: "meet", icon: "👋", title: "Conocer a alguien", context: "Una reunión informal", opening: "Hi! I'm Emma. What's your name?" },
  { id: "coffee", icon: "☕", title: "Pedir un café", context: "Una cafetería", opening: "Good morning! What would you like to drink?" },
  { id: "hotel", icon: "🛎️", title: "Llegar al hotel", context: "Recepción", opening: "Welcome! Do you have a reservation?" },
  { id: "directions", icon: "🧭", title: "Pedir indicaciones", context: "En la calle", opening: "Hello! Can I help you find something?" },
];
