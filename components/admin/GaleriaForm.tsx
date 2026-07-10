"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function GaleriaForm({
  proyectoId,
  ordenSiguiente,
}: {
  proyectoId: string;
  ordenSiguiente: number;
}) {
  const router = useRouter();
  const [foto, setFoto] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!foto) return;
    setGuardando(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = foto.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `galeria/${proyectoId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, foto);
      if (uploadError) throw new Error(uploadError.message);

      const { error: insertError } = await supabase.from("portfolio_fotos").insert({
        proyecto_id: proyectoId,
        url_foto: path,
        descripcion: descripcion.trim() || null,
        orden: ordenSiguiente,
      });
      if (insertError) throw new Error(insertError.message);

      setFoto(null);
      setDescripcion("");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-metal-oscuro bg-carbon p-6">
      <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
        Agregar foto a la galería
      </h2>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Foto
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-metal file:mr-3 file:border file:border-metal-oscuro file:bg-negro file:px-3 file:py-2 file:font-display file:text-xs file:uppercase file:tracking-widest file:text-crema"
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Descripción (opcional)
        </span>
        <textarea
          rows={2}
          placeholder="Qué muestra esta foto…"
          className="w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-amarillo focus:outline-none"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {error && (
        <p role="alert" className="border border-amarillo/40 bg-amarillo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando || !foto}
        className="flex w-full items-center justify-center gap-2 border border-metal-oscuro px-6 py-3 font-display text-sm uppercase tracking-widest text-metal transition-colors hover:border-amarillo hover:text-crema disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {guardando ? "Subiendo…" : "Agregar a la galería"}
      </button>
    </form>
  );
}
