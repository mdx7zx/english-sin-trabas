"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Cloud, CloudOff, Loader2, LogOut, UserRound, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useProgress } from "@/components/providers/progress-provider";

export function AccountMenu() {
  const { configured, loading, user, signIn, signUp, signOut } = useAuth();
  const { progress, syncStatus } = useProgress();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);
    const result = mode === "sign-in" ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);
    setNotice({ tone: result.ok ? "success" : "error", text: result.message ?? "Listo." });
    if (result.ok) setPassword("");
  }

  async function handleSignOut() {
    setSubmitting(true);
    const result = await signOut();
    setSubmitting(false);
    setNotice({ tone: result.ok ? "success" : "error", text: result.message ?? "Sesión cerrada." });
  }

  const initial = user?.email?.charAt(0).toUpperCase() ?? progress.name.charAt(0).toUpperCase() ?? "A";
  const online = Boolean(user) && syncStatus !== "error";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setNotice(null);
          setOpen(true);
        }}
        className="relative grid size-9 place-items-center rounded-full bg-mint text-xs font-black text-forest transition hover:bg-lime"
        aria-label={user ? "Abrir mi cuenta" : "Guardar progreso en la nube"}
        title={user ? "Mi cuenta" : "Guardar progreso"}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : initial}
        <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-cream ${online ? "bg-moss" : "bg-forest/25"}`} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="account-title" className="w-full max-w-md rounded-[28px] bg-cream p-5 shadow-float sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="grid size-11 place-items-center rounded-2xl bg-mint text-forest">
                  {user ? <Cloud size={20} /> : <UserRound size={20} />}
                </span>
                <h2 id="account-title" className="mt-4 text-2xl font-black tracking-[-0.03em] text-ink">
                  {user ? "Tu progreso está protegido" : configured ? mode === "sign-in" ? "Entra a tu cuenta" : "Crea tu cuenta" : "Conecta el guardado en línea"}
                </h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-forest" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            {!configured ? (
              <div className="mt-5">
                <p className="text-sm leading-6 text-forest/60">La app sigue guardando en este dispositivo. Para activar la nube, agrega la configuración pública de tu aplicación web de Firebase en el archivo <code className="rounded bg-white px-1.5 py-0.5 text-xs font-bold">.env.local</code>.</p>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 text-xs font-semibold text-forest/55">
                  <CloudOff size={19} className="shrink-0 text-coral" /> Guardado local activo
                </div>
              </div>
            ) : user ? (
              <div className="mt-5">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-moss">Cuenta conectada</p>
                  <p className="mt-1 break-all text-sm font-bold text-forest">{user.email}</p>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-2xl bg-mint/45 p-4 text-xs font-semibold text-forest/65">
                  {syncStatus === "syncing" || syncStatus === "loading" ? <Loader2 size={18} className="shrink-0 animate-spin text-moss" /> : syncStatus === "error" ? <CloudOff size={18} className="shrink-0 text-coral" /> : <Check size={18} className="shrink-0 text-moss" />}
                  {syncStatus === "syncing" || syncStatus === "loading" ? "Sincronizando tus avances…" : syncStatus === "error" ? "No se pudo sincronizar; tu copia local está segura." : "Progreso sincronizado en la nube."}
                </div>
                <button type="button" onClick={handleSignOut} disabled={submitting} className="secondary-button mt-5 w-full">
                  {submitting ? <Loader2 size={17} className="animate-spin" /> : <LogOut size={17} />} Cerrar sesión
                </button>
              </div>
            ) : (
              <form className="mt-5" onSubmit={handleSubmit}>
                <p className="text-sm leading-6 text-forest/55">{mode === "sign-in" ? "Continúa exactamente donde te quedaste, desde cualquier dispositivo." : "Tu progreso actual se copiará a tu nueva cuenta."}</p>
                <label className="mt-5 block text-xs font-black text-forest" htmlFor="account-email">Correo electrónico</label>
                <input id="account-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-forest/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-moss" placeholder="tu@correo.com" />
                <label className="mt-4 block text-xs font-black text-forest" htmlFor="account-password">Contraseña</label>
                <input id="account-password" type="password" required minLength={6} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-forest/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-moss" placeholder="Mínimo 6 caracteres" />
                {notice && <p className={`mt-4 rounded-2xl px-4 py-3 text-xs font-semibold ${notice.tone === "success" ? "bg-mint/55 text-forest" : "bg-coral/10 text-[#9b3e2d]"}`}>{notice.text}</p>}
                <button type="submit" disabled={submitting} className="primary-button mt-5 w-full">
                  {submitting && <Loader2 size={17} className="animate-spin" />} {mode === "sign-in" ? "Iniciar sesión" : "Crear cuenta y guardar"}
                </button>
                <button type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setNotice(null); }} className="mt-4 w-full text-center text-xs font-bold text-moss">
                  {mode === "sign-in" ? "¿Primera vez? Crea una cuenta" : "Ya tengo cuenta"}
                </button>
              </form>
            )}

            {notice && user && <p className={`mt-4 rounded-2xl px-4 py-3 text-xs font-semibold ${notice.tone === "success" ? "bg-mint/55 text-forest" : "bg-coral/10 text-[#9b3e2d]"}`}>{notice.text}</p>}
          </section>
        </div>
      )}
    </>
  );
}
