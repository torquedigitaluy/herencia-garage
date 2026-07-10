"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle, KeyRound, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function RecuperarForm() {
  const searchParams = useSearchParams();
  const linkInvalido = searchParams.get("error") === "link";

  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm?next=/restablecer`,
    });

    // Siempre mostramos éxito: no revelamos si el email existe o no.
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-4 border border-metal-oscuro bg-carbon p-8 py-12 text-center">
        <MailCheck className="h-10 w-10 text-amarillo" strokeWidth={1.5} />
        <h2 className="font-display text-xl font-bold uppercase text-crema">
          Revisá tu correo
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-metal">
          Si existe una cuenta para <span className="text-crema">{email.trim()}</span>,
          te enviamos un link para restablecer la contraseña. Puede tardar unos
          minutos y caer en spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-metal-oscuro bg-carbon p-8">
      {linkInvalido && (
        <p role="alert" className="border border-amarillo/40 bg-amarillo/5 p-3 text-sm text-crema">
          El link que usaste expiró o no es válido. Pedí uno nuevo.
        </p>
      )}
      <p className="text-sm leading-relaxed text-metal">
        Ingresá el email de tu cuenta y te mandamos un link para crear una
        contraseña nueva.
      </p>
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
          className="w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-amarillo focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={enviando}
        className="flex w-full items-center justify-center gap-2 border border-amarillo bg-amarillo px-6 py-4 font-display text-sm uppercase tracking-widest text-negro transition-colors hover:border-amarillo-claro hover:bg-amarillo-claro disabled:opacity-50"
      >
        {enviando && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {enviando ? "Enviando…" : "Enviar link de recuperación"}
      </button>
    </form>
  );
}

export default function RecuperarPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-negro px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <KeyRound className="h-6 w-6 text-amarillo" strokeWidth={1.5} />
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-crema">
              Herencia Garage
            </p>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-metal">
              Recuperar contraseña
            </p>
          </div>
        </div>
        <Suspense fallback={null}>
          <RecuperarForm />
        </Suspense>
      </div>
    </main>
  );
}
