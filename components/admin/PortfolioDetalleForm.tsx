"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify, type ProyectoPortfolio } from "@/lib/portfolio";

const inputClass =
  "w-full border border-metal-oscuro bg-negro px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-amarillo focus:outline-none";
const labelClass = "mb-2 block font-display text-xs uppercase tracking-widest text-metal";
const fileClass =
  "w-full text-sm text-metal file:mr-3 file:border file:border-metal-oscuro file:bg-negro file:px-3 file:py-2 file:font-display file:text-xs file:uppercase file:tracking-widest file:text-crema";

/** Textarea con un ítem por línea ⇄ text[] en la DB. */
const aLineas = (items: string[]) => items.join("\n");
const aArray = (texto: string) =>
  texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function PortfolioDetalleForm({ proyecto }: { proyecto: ProyectoPortfolio }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(proyecto.titulo);
  const [slug, setSlug] = useState(proyecto.slug);
  const [anio, setAnio] = useState(proyecto.anio ?? "");
  const [descripcion, setDescripcion] = useState(proyecto.descripcion ?? "");
  const [historia, setHistoria] = useState(proyecto.historia ?? "");
  const [problemas, setProblemas] = useState(aLineas(proyecto.problemas));
  const [soluciones, setSoluciones] = useState(aLineas(proyecto.soluciones));
  const [duracion, setDuracion] = useState(proyecto.duracion ?? "");
  const [destacado, setDestacado] = useState(proyecto.destacado);
  const [fotoAntes, setFotoAntes] = useState<File | null>(null);
  const [fotoDespues, setFotoDespues] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setGuardado(false);

    try {
      const supabase = createClient();

      // Reemplaza una foto principal: sube la nueva y borra la anterior.
      const reemplazar = async (file: File, sufijo: string, pathViejo: string | null) => {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${proyecto.id}/${sufijo}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file);
        if (error) throw new Error(`No se pudo subir la foto (${sufijo}): ${error.message}`);
        if (pathViejo) await supabase.storage.from("portfolio").remove([pathViejo]);
        return path;
      };

      const antesPath = fotoAntes
        ? await reemplazar(fotoAntes, "antes", proyecto.foto_antes_url)
        : proyecto.foto_antes_url;
      const despuesPath = fotoDespues
        ? await reemplazar(fotoDespues, "despues", proyecto.foto_despues_url)
        : proyecto.foto_despues_url;

      const { error: updateError } = await supabase
        .from("portfolio_publico")
        .update({
          titulo: titulo.trim(),
          slug: slugify(slug.trim() || `${titulo} ${anio}`),
          anio: anio.trim() || null,
          descripcion: descripcion.trim() || null,
          historia: historia.trim() || null,
          problemas: aArray(problemas),
          soluciones: aArray(soluciones),
          duracion: duracion.trim() || null,
          destacado,
          foto_antes_url: antesPath,
          foto_despues_url: despuesPath,
        })
        .eq("id", proyecto.id);
      if (updateError) {
        throw new Error(
          updateError.code === "23505"
            ? "Ya existe otro proyecto con ese slug."
            : updateError.message
        );
      }

      setFotoAntes(null);
      setFotoDespues(null);
      setGuardado(true);
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
        Datos del proyecto
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Título</span>
          <input
            type="text"
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className={labelClass}>Año</span>
          <input
            type="text"
            placeholder="Ej: 1967"
            className={inputClass}
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Slug (URL: /portfolio/…)</span>
        <input
          type="text"
          className={inputClass}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Duración</span>
          <input
            type="text"
            placeholder="Ej: 8 meses"
            className={inputClass}
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 pt-7 text-sm text-metal">
          <input
            type="checkbox"
            checked={destacado}
            onChange={(e) => setDestacado(e.target.checked)}
            className="h-4 w-4 accent-amarillo"
          />
          Destacado
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Descripción corta (card de la landing)</span>
        <textarea
          rows={2}
          className={inputClass}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Historia — cómo llegó al taller</span>
        <textarea
          rows={4}
          placeholder="De dónde vino, en qué estado, qué buscaba el dueño…"
          className={inputClass}
          value={historia}
          onChange={(e) => setHistoria(e.target.value)}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Problemas encontrados (uno por línea)</span>
        <textarea
          rows={4}
          placeholder={"Óxido perforante en pisos\nGuardabarros con masilla vieja"}
          className={inputClass}
          value={problemas}
          onChange={(e) => setProblemas(e.target.value)}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Soluciones / trabajos realizados (uno por línea)</span>
        <textarea
          rows={4}
          placeholder={"Fabricación de pisos nuevos a medida\nRepintado integral bicapa"}
          className={inputClass}
          value={soluciones}
          onChange={(e) => setSoluciones(e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>
            {proyecto.foto_antes_url ? "Reemplazar foto ANTES" : "Foto ANTES"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFotoAntes(e.target.files?.[0] ?? null)}
            className={fileClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>
            {proyecto.foto_despues_url ? "Reemplazar foto DESPUÉS" : "Foto DESPUÉS"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFotoDespues(e.target.files?.[0] ?? null)}
            className={fileClass}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="border border-amarillo/40 bg-amarillo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}
      {guardado && !error && (
        <p className="border border-metal-oscuro bg-negro p-3 text-sm text-metal">
          Cambios guardados. La landing se actualiza en ~1 minuto.
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="flex w-full items-center justify-center gap-2 border border-amarillo bg-amarillo px-6 py-3 font-display text-sm uppercase tracking-widest text-negro transition-colors hover:border-amarillo-claro hover:bg-amarillo-claro disabled:opacity-50"
      >
        {guardando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {guardando ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
