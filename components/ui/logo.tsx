import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="English Sin Trabas, inicio">
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-lime text-lg font-black text-forest shadow-sm transition group-hover:-rotate-3">
        E<span className="absolute bottom-1 right-1 size-2 rounded-full bg-coral" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[15px] font-black tracking-[-0.03em] text-ink">English</span>
          <span className="mt-1 block text-[11px] font-bold tracking-[0.12em] text-moss">SIN TRABAS</span>
        </span>
      )}
    </Link>
  );
}
