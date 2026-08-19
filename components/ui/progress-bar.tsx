import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "forest",
}: {
  value: number;
  className?: string;
  tone?: "forest" | "lime" | "coral" | "sky";
}) {
  const tones = { forest: "bg-moss", lime: "bg-lime", coral: "bg-coral", sky: "bg-sky" };
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-forest/10", className)}>
      <div className={cn("h-full rounded-full transition-all duration-700", tones[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
