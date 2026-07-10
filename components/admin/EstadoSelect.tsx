"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ESTADOS = ["nuevo", "contactado", "cotizado", "descartado"] as const;

export function EstadoSelect({
  leadId,
  estadoActual,
}: {
  leadId: string;
  estadoActual: string;
}) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);

  async function cambiarEstado(estado: string) {
    setGuardando(true);
    setError(false);
    const { error } = await createClient()
      .from("leads_cotizacion")
      .update({ estado })
      .eq("id", leadId);
    setGuardando(false);
    if (error) {
      setError(true);
      return;
    }
    router.refresh();
  }

  return (
    <label className="flex items-center gap-3">
      <span className="font-display text-xs uppercase tracking-widest text-metal">
        Estado
      </span>
      {guardando && <LoaderCircle className="h-4 w-4 animate-spin text-amarillo" />}
      <select
        defaultValue={estadoActual}
        disabled={guardando}
        onChange={(e) => cambiarEstado(e.target.value)}
        className="border border-metal-oscuro bg-carbon px-4 py-2 font-display text-xs uppercase tracking-widest text-crema focus:border-amarillo focus:outline-none"
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-amarillo">No se pudo guardar</span>}
    </label>
  );
}
