"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function BitacoraForm({ proyectoId }: { proyectoId: string }) {
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
      const path = `proyectos/${proyectoId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(path, foto);
      if (uploadError) throw new Error(uploadError.message);

      const { error: insertError } = await supabase.from("bitacora_fotos").insert({
        proyecto_id: proyectoId,
        url_foto: path,
        descripcion: descripcion.trim() || null,
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
        Nueva actualización
      </h2>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Foto del avance
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
          rows={3}
          placeholder="Qué se hizo en esta etapa…"
          className="w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-rojo focus:outline-none"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {error && (
        <p role="alert" className="border border-rojo/40 bg-rojo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando || !foto}
        className="flex w-full items-center justify-center gap-2 border border-metal-oscuro px-6 py-3 font-display text-sm uppercase tracking-widest text-metal transition-colors hover:border-rojo hover:text-crema disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {guardando ? "Publicando…" : "Publicar en bitácora"}
      </button>
    </form>
  );
}
