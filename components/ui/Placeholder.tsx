import { ImageIcon } from "lucide-react";

/**
 * Bloque placeholder con textura "metal desnudo". Sustituye imágenes reales
 * durante la maquetación (Etapa 1). Reemplazar por <Image> / media de Supabase
 * en etapas posteriores.
 */
export function Placeholder({
  label,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  label?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-metal-oscuro ${ratio} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(135deg, #26282b 0%, #3a3d40 45%, #202225 55%, #303235 100%)",
      }}
    >
      {/* brillo diagonal tipo chapa */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-metal">
        <ImageIcon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
        {label && (
          <span className="font-display text-xs uppercase tracking-[0.2em]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
