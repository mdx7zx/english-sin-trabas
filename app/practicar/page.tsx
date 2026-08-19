import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Headphones, MessageCircle, Mic2, PenLine, Shapes, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const modules = [
  { title: "Laboratorio de Verbos", text: "Aprende cada verbo como una familia y úsalo en contexto.", href: "/verbos", icon: Shapes, color: "bg-lime/55", meta: "38 verbos" },
  { title: "Listening", text: "Escucha, reconoce y reconstruye frases a dos velocidades.", href: "/practicar/listening", icon: Headphones, color: "bg-sky/45", meta: "4 retos" },
  { title: "Habla conmigo", text: "Usa tu micrófono y compara las palabras que se detectan.", href: "/practicar/speaking", icon: Mic2, color: "bg-coral/20", meta: "Voz real" },
  { title: "Escribe en Inglés", text: "Construye frases y recibe correcciones breves y claras.", href: "/practicar/writing", icon: PenLine, color: "bg-[#eee6ff]", meta: "4 niveles" },
  { title: "Reading", text: "Lee textos breves y responde por significado, no traducción.", href: "/practicar/reading", icon: BookOpen, color: "bg-[#ffe9bd]", meta: "A1" },
  { title: "Piensa en Inglés", text: "Reemplaza traducciones literales por estructuras naturales.", href: "/practicar/piensa-en-ingles", icon: Brain, color: "bg-mint/55", meta: "5 patrones" },
  { title: "Conversación", text: "Practica situaciones reales con respuestas simuladas.", href: "/conversacion", icon: MessageCircle, color: "bg-sky/35", meta: "4 escenarios" },
  { title: "Mis errores", text: "Ataca los patrones que más se repiten en tu práctica.", href: "/errores", icon: Sparkles, color: "bg-coral/15", meta: "Repaso" },
];

export default function PracticePage() {
  return <div className="animate-rise"><PageHeader eyebrow="Entrena una habilidad" title="Práctica que se siente real" description="Elige una habilidad o deja que la sesión diaria mezcle el contenido por ti." action={<Link href="/practica-diaria" className="primary-button">Mi práctica de hoy <ArrowRight size={17} /></Link>} /><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{modules.map((module) => { const Icon = module.icon; return <Link key={module.title} href={module.href} className="surface group flex min-h-52 flex-col p-5 transition hover:-translate-y-1 hover:border-moss/20 sm:p-6"><div className="flex items-start justify-between"><span className={`grid size-12 place-items-center rounded-2xl ${module.color} text-forest`}><Icon size={22} /></span><span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold text-forest/40">{module.meta}</span></div><h2 className="mt-7 text-lg font-black text-ink">{module.title}</h2><p className="mt-2 text-sm leading-6 text-forest/50">{module.text}</p><span className="mt-auto flex items-center gap-1 pt-5 text-xs font-black text-moss">Empezar <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span></Link>; })}</div></div>;
}
