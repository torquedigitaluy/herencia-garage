"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RestablecerPage() {
  const router = useRouter();
  const [sesionOk, setSesionOk] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // La página solo sirve si el link del email dejó una sesión activa.
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setSesionOk(!!user));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setGuardando(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setGuardando(false);
      return;
    }

    // Redirigir según el rol de la cuenta
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).single()
      : { data: null };

    router.push(profile?.role === "admin" ? "/admin" : "/cliente/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-negro px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <LockKeyhole className="h-6 w-6 text-rojo" strokeWidth={1.5} />
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-crema">
              Herencia Garage
            </p>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-metal">
              Nueva contraseña
            </p>
          </div>
        </div>

        {sesionOk === null ? (
          <div className="flex justify-center border border-metal-oscuro bg-carbon p-12">
            <LoaderCircle className="h-6 w-6 animate-spin text-rojo" />
          </div>
        ) : !sesionOk ? (
          <div className="space-y-4 border border-metal-oscuro bg-carbon p-8 text-center">
            <p className="text-sm leading-relaxed text-metal">
              Este enlace expiró o ya fue usado. Pedí uno nuevo para restablecer tu
              contraseña.
            </p>
            <Link
              href="/recuperar"
              className="inline-block border border-rojo px-6 py-3 font-display text-sm uppercase tracking-widest text-rojo transition-colors hover:bg-rojo hover:text-crema"
            >
              Pedir link nuevo
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 border border-metal-oscuro bg-carbon p-8">
            <label className="block">
              <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
                Nueva contraseña
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-rojo focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
                Repetir contraseña
              </span>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
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
              disabled={guardando}
              className="flex w-full items-center justify-center gap-2 border border-rojo bg-rojo px-6 py-4 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:border-rojo-claro hover:bg-rojo-claro disabled:opacity-50"
            >
              {guardando && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {guardando ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
