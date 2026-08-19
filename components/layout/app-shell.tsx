"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Flame,
  Headphones,
  Home,
  Menu,
  MessageCircle,
  Mic2,
  PenLine,
  Play,
  Shapes,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { AccountMenu } from "@/components/auth/account-menu";
import { Logo } from "@/components/ui/logo";
import { useProgress } from "@/components/providers/progress-provider";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/aprender", label: "Aprender", icon: BookOpen },
  { href: "/practicar", label: "Practicar", icon: Target },
  { href: "/conversacion", label: "Conversación", icon: MessageCircle },
  { href: "/progreso", label: "Progreso", icon: BarChart3 },
];

const practiceNav = [
  { href: "/verbos", label: "Verbos", icon: Shapes },
  { href: "/practicar/listening", label: "Listening", icon: Headphones },
  { href: "/practicar/speaking", label: "Speaking", icon: Mic2 },
  { href: "/practicar/writing", label: "Writing", icon: PenLine },
  { href: "/errores", label: "Mis errores", icon: Sparkles },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { progress } = useProgress();
  const currentLevelXp = progress.xp % 1000;
  const xpToNextLevel = 1000 - currentLevelXp;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col border-r border-forest/10 bg-[#fbfcf7] px-5 py-6 lg:flex">
        <Logo />
        <nav className="mt-10 space-y-1.5" aria-label="Navegación principal">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition", active ? "bg-forest text-white shadow-md shadow-forest/10" : "text-forest/65 hover:bg-forest/5 hover:text-forest")}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-forest/35">Practica a tu manera</p>
        <nav className="space-y-0.5">
          {practiceNav.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition", active ? "bg-mint/70 text-forest" : "text-forest/55 hover:bg-forest/5 hover:text-forest")}>
                <Icon size={16} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-3xl bg-forest p-4 text-white">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Nivel {progress.level}</span>
            <span className="text-lime">{progress.xp} XP</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-lime" style={{ width: `${currentLevelXp / 10}%` }} /></div>
          <p className="mt-2 text-[11px] text-white/55">{xpToNextLevel} XP para tu siguiente nivel</p>
        </div>
      </aside>

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-forest/5 bg-cream/90 px-4 backdrop-blur-md sm:px-7 lg:h-[76px] lg:px-10">
          <div className="lg:hidden"><Logo compact /></div>
          <div className="hidden items-center gap-2 rounded-full border border-forest/10 bg-white px-4 py-2 text-xs font-semibold text-forest/60 lg:flex">
            <span className="size-2 rounded-full bg-moss" /> Tutor activo
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-forest shadow-sm"><Flame size={15} className="fill-coral text-coral" /> {progress.streak}</div>
            <AccountMenu />
            <button onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-full text-forest lg:hidden" aria-label="Abrir menú"><Menu size={21} /></button>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-76px)] max-w-[1500px] px-4 pb-28 pt-5 sm:px-7 lg:px-10 lg:pb-10 lg:pt-8">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-[22px] border border-white/70 bg-forest px-1.5 py-2 text-white shadow-float lg:hidden" aria-label="Navegación móvil">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const active = isCurrent(pathname, item.href);
          return <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-2xl py-1 text-[9px] font-semibold transition", active ? "text-lime" : "text-white/50")}><Icon size={19} strokeWidth={active ? 2.7 : 2} />{item.label}</Link>;
        })}
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <aside className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-cream p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><Logo /><button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-white"><X size={19} /></button></div>
            <p className="mb-2 mt-9 text-[10px] font-bold uppercase tracking-[0.18em] text-forest/40">Módulos de práctica</p>
            <nav className="space-y-1">
              {practiceNav.map((item) => { const Icon = item.icon; return <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold text-forest"><Icon size={18} />{item.label}</Link>; })}
            </nav>
            <Link onClick={() => setOpen(false)} href="/practica-diaria" className="primary-button mt-auto"><Play size={17} fill="currentColor" /> Mi práctica de hoy</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
