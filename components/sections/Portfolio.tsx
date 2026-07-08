import { Placeholder } from "@/components/ui/Placeholder";

const proyectos = [
  { titulo: "Ford Mustang Fastback", anio: "1967", destacado: true },
  { titulo: "Chevrolet Bel Air", anio: "1957" },
  { titulo: "Volkswagen Escarabajo", anio: "1965" },
  { titulo: "Dodge Charger", anio: "1969" },
  { titulo: "Fiat 600", anio: "1960" },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="border-t border-metal-oscuro py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
              <span className="h-px w-10 bg-rojo" />
              Portfolio
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Antes &amp; después
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-metal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Una
            selección de metales que volvieron a nacer en el taller.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((p) => (
            <article
              key={p.titulo}
              className={`group relative ${p.destacado ? "sm:col-span-2 lg:row-span-2" : ""}`}
            >
              <Placeholder
                label={`${p.titulo} · Después`}
                ratio={p.destacado ? "aspect-[4/3] lg:aspect-[4/5]" : "aspect-[4/3]"}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-negro/90 to-transparent p-5">
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-crema">
                    {p.titulo}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-metal">
                    {p.anio}
                  </p>
                </div>
                {p.destacado && (
                  <span className="border border-rojo px-2 py-1 font-display text-[10px] uppercase tracking-widest text-rojo">
                    Destacado
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
