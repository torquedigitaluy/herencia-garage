import { Upload, TriangleAlert } from "lucide-react";

export function Contacto() {
  return (
    <section
      id="contacto"
      className="border-t border-metal-oscuro bg-carbon py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
            <span className="h-px w-10 bg-rojo" />
            Cotización
          </p>
          <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Contanos sobre tu clásico
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-metal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Envianos las
            fotos y el estado del vehículo; preparamos un plan de restauración a
            medida.
          </p>

          <div className="mt-8 flex items-start gap-3 border border-rojo/40 bg-rojo/5 p-4">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rojo" strokeWidth={1.5} />
            <p className="text-sm leading-relaxed text-metal">
              <span className="font-display uppercase tracking-wide text-crema">
                Solo chapa y pintura.
              </span>{" "}
              No realizamos trabajos de mecánica. La solicitud requiere aceptar
              esta condición.
            </p>
          </div>
        </div>

        {/* Vista previa estática del formulario multi-paso (Etapa 3) */}
        <form className="space-y-5 border border-metal-oscuro bg-negro p-8" aria-label="Formulario de cotización (maqueta)">
          <div className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-metal">
            <span className="text-rojo">Paso 1</span> / 3 · Datos del vehículo
          </div>

          <Field label="Nombre">
            <input type="text" placeholder="Tu nombre" className={inputClass} />
          </Field>
          <Field label="Vehículo">
            <input type="text" placeholder="Marca, modelo y año" className={inputClass} />
          </Field>
          <Field label="Descripción del trabajo">
            <textarea rows={3} placeholder="Contanos qué necesita tu auto…" className={inputClass} />
          </Field>

          <div>
            <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
              Fotos del vehículo
            </span>
            <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-metal-oscuro bg-carbon px-4 py-8 text-center text-metal">
              <Upload className="h-6 w-6 text-rojo" strokeWidth={1.5} />
              <span className="text-sm">Arrastrá tus imágenes o seleccioná archivos</span>
              <span className="text-xs text-metal-oscuro">JPG · PNG · WEBP</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full border border-rojo bg-rojo px-6 py-4 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:bg-rojo-claro hover:border-rojo-claro"
          >
            Continuar
          </button>
          <p className="text-center text-xs text-metal-oscuro">
            Maqueta sin funcionalidad — se conecta a Supabase en la Etapa 3.
          </p>
        </form>
      </div>
    </section>
  );
}

const inputClass =
  "w-full border border-metal-oscuro bg-carbon px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-rojo focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
        {label}
      </span>
      {children}
    </label>
  );
}
