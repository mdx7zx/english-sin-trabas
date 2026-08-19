import type { UserProgress } from "@/types";

export interface ProgressRepository {
  load(): UserProgress | null;
  save(progress: UserProgress): void;
}

export class LocalProgressRepository implements ProgressRepository {
  constructor(private readonly key: string) {}
  load() {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(this.key);
    return value ? (JSON.parse(value) as UserProgress) : null;
  }
  save(progress: UserProgress) {
    if (typeof window !== "undefined") window.localStorage.setItem(this.key, JSON.stringify(progress));
  }
}
