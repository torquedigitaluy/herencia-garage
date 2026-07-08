"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FASES } from "@/lib/fases";

export function FaseAvanceForm({
  proyectoId,
  faseActual,
  porcentaje,
}: {
  proyectoId: string;
  faseActual: string;
  porcentaje: number;
}) {
  const router = useRouter();
  const [fase, setFase] = useState(faseActual);
  const [avance, setAvance] = useState(porcentaje);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const { error } = await createClient()
      .from("proyectos_activos")
      .update({ fase_actual: fase, porcentaje_avance: avance })
      .eq("id", proyectoId);

    setGuardando(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-metal-oscuro bg-carbon p-6">
      <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
        Fase y avance
      </h2>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Fase actual
        </span>
        <select
          value={fase}
          onChange={(e) => setFase(e.target.value)}
          className="w-full border border-metal-oscuro bg-negro px-4 py-3 font-display text-xs uppercase tracking-widest text-crema focus:border-rojo focus:outline-none"
        >
          {FASES.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 flex items-center justify-between font-display text-xs uppercase tracking-widest text-metal">
          Avance <span className="text-rojo">{avance}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={avance}
          onChange={(e) => setAvance(Number(e.target.value))}
          className="w-full accent-rojo"
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
        className="flex w-full items-center justify-center gap-2 border border-rojo bg-rojo px-6 py-3 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:border-rojo-claro hover:bg-rojo-claro disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {guardando ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
