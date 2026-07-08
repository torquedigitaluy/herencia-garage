"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-rojo focus:outline-none";

export function ProyectoNuevoForm({
  clientes,
}: {
  clientes: { id: string; email: string | null }[];
}) {
  const router = useRouter();
  const [clienteId, setClienteId] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const { error } = await createClient().from("proyectos_activos").insert({
      cliente_id: clienteId,
      vehiculo: vehiculo.trim(),
    });

    setGuardando(false);
    if (error) {
      setError(error.message);
      return;
    }
    setClienteId("");
    setVehiculo("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-metal-oscuro bg-carbon p-6">
      <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
        Nuevo proyecto
      </h2>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Cliente
        </span>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
          className={inputClass}
        >
          <option value="" disabled>
            Elegí un cliente…
          </option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.email ?? c.id}
            </option>
          ))}
        </select>
        {clientes.length === 0 && (
          <span className="mt-2 block text-xs text-metal">
            No hay clientes aún — creá uno con el formulario de abajo.
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Vehículo
        </span>
        <input
          type="text"
          placeholder="Marca, modelo y año"
          className={inputClass}
          value={vehiculo}
          onChange={(e) => setVehiculo(e.target.value)}
          required
        />
      </label>

      {error && (
        <p role="alert" className="border border-rojo/40 bg-rojo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando || clientes.length === 0}
        className="flex w-full items-center justify-center gap-2 border border-rojo bg-rojo px-6 py-3 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:border-rojo-claro hover:bg-rojo-claro disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {guardando ? "Creando…" : "Crear proyecto"}
      </button>
    </form>
  );
}
