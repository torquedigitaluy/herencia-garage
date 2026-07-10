import { TriangleAlert } from "lucide-react";
import { CotizacionForm } from "@/components/forms/CotizacionForm";

export function Contacto() {
  return (
    <section
      id="contacto"
      className="border-t border-metal-oscuro bg-carbon py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
            <span className="h-px w-10 bg-amarillo" />
            Cotización
          </p>
          <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Contanos sobre tu clásico
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-metal">
            Contanos en qué estado está tu vehículo y envianos unas fotos;
            preparamos una cotización y un plan de restauración a medida, sin
            compromiso.
          </p>

          <div className="mt-8 flex items-start gap-3 border border-amarillo/40 bg-amarillo/5 p-4">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amarillo" strokeWidth={1.5} />
            <p className="text-sm leading-relaxed text-metal">
              <span className="font-display uppercase tracking-wide text-crema">
                Solo chapa y pintura.
              </span>{" "}
              No realizamos trabajos de mecánica. La solicitud requiere aceptar
              esta condición.
            </p>
          </div>
        </div>

        <CotizacionForm />
      </div>
    </section>
  );
}
