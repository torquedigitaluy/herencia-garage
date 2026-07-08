"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales incorrectas. Verificá el email y la contraseña.");
      setEnviando(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-negro px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Wrench className="h-6 w-6 text-rojo" strokeWidth={1.5} />
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-crema">
              Herencia Garage
            </p>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-metal">
              Panel de administración
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-metal-oscuro bg-carbon p-8"
        >
          <label className="block">
            <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-rojo focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-rojo focus:outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="border border-rojo/40 bg-rojo/5 p-3 text-sm text-crema">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center gap-2 border border-rojo bg-rojo px-6 py-4 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:border-rojo-claro hover:bg-rojo-claro disabled:opacity-50"
          >
            {enviando && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {enviando ? "Ingresando…" : "Ingresar"}
          </button>

          <Link
            href="/recuperar"
            className="block text-center text-xs text-metal transition-colors hover:text-crema"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </form>
      </div>
    </main>
  );
}
