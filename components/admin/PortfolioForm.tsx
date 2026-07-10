"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/portfolio";

const inputClass =
  "w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-amarillo focus:outline-none";

export function PortfolioForm() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [anio, setAnio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotoAntes, setFotoAntes] = useState<File | null>(null);
  const [fotoDespues, setFotoDespues] = useState<File | null>(null);
  const [destacado, setDestacado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      const supabase = createClient();
      const id = crypto.randomUUID();

      const subir = async (file: File, sufijo: string) => {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${id}/${sufijo}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file);
        if (error) throw new Error(`No se pudo subir la foto (${sufijo}): ${error.message}`);
        return path;
      };

      const antesPath = fotoAntes ? await subir(fotoAntes, "antes") : null;
      const despuesPath = fotoDespues ? await subir(fotoDespues, "despues") : null;

      const { error: insertError } = await supabase.from("portfolio_publico").insert({
        id,
        titulo: titulo.trim(),
        slug: slugify(`${titulo} ${anio}`),
        anio: anio.trim() || null,
        descripcion: descripcion.trim() || null,
        foto_antes_url: antesPath,
        foto_despues_url: despuesPath,
        destacado,
      });
      if (insertError) {
        throw new Error(
          insertError.code === "23505"
            ? "Ya existe un proyecto con ese título y año."
            : insertError.message
        );
      }

      setTitulo("");
      setAnio("");
      setDescripcion("");
      setFotoAntes(null);
      setFotoDespues(null);
      setDestacado(false);
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
        Publicar trabajo
      </h2>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Título
        </span>
        <input
          type="text"
          placeholder="Ej: Ford Mustang Fastback"
          className={inputClass}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Año
        </span>
        <input
          type="text"
          placeholder="Ej: 1967"
          className={inputClass}
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Descripción (opcional)
        </span>
        <textarea
          rows={3}
          placeholder="Trabajo realizado…"
          className={inputClass}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Foto ANTES (opcional)
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFotoAntes(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-metal file:mr-3 file:border file:border-metal-oscuro file:bg-negro file:px-3 file:py-2 file:font-display file:text-xs file:uppercase file:tracking-widest file:text-crema"
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
          Foto DESPUÉS (opcional)
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFotoDespues(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-metal file:mr-3 file:border file:border-metal-oscuro file:bg-negro file:px-3 file:py-2 file:font-display file:text-xs file:uppercase file:tracking-widest file:text-crema"
        />
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-metal">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
          className="h-4 w-4 accent-amarillo"
        />
        Destacado (aparece en grande en la landing)
      </label>

      <p className="text-xs leading-relaxed text-metal">
        La historia, los problemas, las soluciones y la galería se cargan
        después, editando el proyecto desde la lista.
      </p>

      {error && (
        <p role="alert" className="border border-amarillo/40 bg-amarillo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="flex w-full items-center justify-center gap-2 border border-amarillo bg-amarillo px-6 py-3 font-display text-sm uppercase tracking-widest text-negro transition-colors hover:border-amarillo-claro hover:bg-amarillo-claro disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {guardando ? "Publicando…" : "Publicar"}
      </button>
    </form>
  );
}
