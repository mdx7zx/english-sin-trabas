"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) return { ok: false, message: "Primero conecta el proyecto de Firebase." };

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true, message: "Sesión iniciada. Tu progreso ya se está sincronizando." };
    } catch (error) {
      return { ok: false, message: translateAuthError(error) };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) return { ok: false, message: "Primero conecta el proyecto de Firebase." };

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { ok: true, message: "Cuenta creada. Tu progreso ya se está sincronizando." };
    } catch (error) {
      return { ok: false, message: translateAuthError(error) };
    }
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return { ok: true };

    try {
      await firebaseSignOut(auth);
      return { ok: true, message: "Sesión cerrada. El progreso en la nube sigue guardado." };
    } catch (error) {
      return { ok: false, message: translateAuthError(error) };
    }
  }, []);

  const value = useMemo(
    () => ({ configured: isFirebaseConfigured, loading, user, signIn, signUp, signOut }),
    [loading, user, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

function translateAuthError(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : "";
  if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") return "El correo o la contraseña no coinciden.";
  if (code === "auth/email-already-in-use") return "Ese correo ya tiene una cuenta.";
  if (code === "auth/weak-password") return "La contraseña debe tener al menos 6 caracteres.";
  if (code === "auth/invalid-email") return "Escribe un correo electrónico válido.";
  if (code === "auth/too-many-requests") return "Hubo demasiados intentos. Espera un momento y vuelve a probar.";
  if (code === "auth/network-request-failed") return "No hay conexión. Revisa tu internet e inténtalo de nuevo.";
  return "No pudimos completar el acceso. Inténtalo de nuevo.";
}
