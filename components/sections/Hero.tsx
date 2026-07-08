import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* atmósfera: viñeta radial sutil */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 65% 40%, rgba(155,17,30,0.10), transparent 55%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
            <span className="h-px w-10 bg-rojo" />
            Chapa &amp; Pintura · Autos Clásicos
          </p>

          <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            El viaje
            <br />
            del <span className="text-rojo">metal</span>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-metal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Devolvemos
            el alma a cada clásico: del óxido a la pieza de estudio, capa por
            capa, sin atajos.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#contacto"
              className="border border-rojo bg-rojo px-8 py-4 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:bg-rojo-claro hover:border-rojo-claro"
            >
              Solicitar cotización
            </Link>
            <Link
              href="#portfolio"
              className="border border-metal-oscuro px-8 py-4 font-display text-sm uppercase tracking-widest text-crema transition-colors hover:border-crema"
            >
              Ver restauraciones
            </Link>
          </div>
        </div>

        {/* placeholder del auto protagonista */}
        <div className="relative">
          <Placeholder label="Mustang '67 · Hero" ratio="aspect-[4/5]" />
          <div className="absolute -left-3 top-8 hidden -rotate-90 origin-left font-display text-xs uppercase tracking-[0.4em] text-metal lg:block">
            Fase 01 — Chapa desnuda
          </div>
        </div>
      </div>

      {/* indicador de scroll — el core del sitio es la secuencia al hacer scroll */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <span className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-metal">
          <ArrowDown className="h-4 w-4 animate-bounce text-rojo" strokeWidth={1.5} />
          Desliza para comenzar
        </span>
      </div>
    </section>
  );
}
