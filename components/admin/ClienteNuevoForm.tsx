"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, UserPlus } from "lucide-react";
import { crearCliente } from "@/app/admin/(panel)/proyectos/actions";

const inputClass =
  "w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-amarillo focus:outline-none";

export function ClienteNuevoForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creado, setCreado] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setCreado(null);

    const resultado = await crearCliente(email.trim(), password);

    setGuardando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setCreado(email.trim());
    setEmail("");
    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-metal-oscuro bg-carbon p-6">
      <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
        Crear cuenta de cliente
      </h2>
      <p className="text-xs leading-relaxed text-metal">
        El cliente entra a <span className="text-crema">/cliente/login</span> con estas
        credenciales para seguir su restauración. Pasáselas por WhatsApp.
      </p>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Email
        </span>
        <input
          type="email"
          placeholder="cliente@email.com"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Contraseña temporal
        </span>
        <input
          type="text"
          placeholder="Mínimo 8 caracteres"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>

      {error && (
        <p role="alert" className="border border-amarillo/40 bg-amarillo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}
      {creado && (
        <p className="border border-metal-oscuro bg-negro p-3 text-sm text-crema">
          Cuenta creada para <span className="text-amarillo">{creado}</span>. Ya podés
          asignarle un proyecto.
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="flex w-full items-center justify-center gap-2 border border-metal-oscuro px-6 py-3 font-display text-sm uppercase tracking-widest text-metal transition-colors hover:border-amarillo hover:text-crema disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        {guardando ? "Creando…" : "Crear cliente"}
      </button>
    </form>
  );
}
