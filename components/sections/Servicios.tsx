const fases = [
  {
    n: "01",
    titulo: "Diagnóstico y desarme",
    texto:
      "Evaluamos la carrocería pieza por pieza y documentamos el estado real del metal antes de tocar un solo panel.",
  },
  {
    n: "02",
    titulo: "Chapa y estructura",
    texto:
      "Reparación de paneles, tratamiento de óxido y recuperación de la geometría original de fábrica.",
  },
  {
    n: "03",
    titulo: "Preparación e imprimación",
    texto:
      "Masillado, bloqueo y capas de primer hasta lograr una superficie perfecta, lista para el color.",
  },
  {
    n: "04",
    titulo: "Pintura y detallado",
    texto:
      "Aplicación en cabina, pulido espejo y ensamblaje final con acabado de exhibición.",
  },
];

export function Servicios() {
  return (
    <section
      id="servicios"
      className="border-t border-metal-oscuro bg-carbon py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
            <span className="h-px w-10 bg-amarillo" />
            El Proceso
          </p>
          <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Cuatro fases. Un solo estándar.
          </h2>
          <p className="mt-6 leading-relaxed text-metal">
            Sin atajos ni improvisación. Cada vehículo recorre el mismo
            camino: del metal desnudo al brillo final.
          </p>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-sm border border-metal-oscuro bg-metal-oscuro sm:grid-cols-2 lg:grid-cols-4">
          {fases.map((f) => (
            <li
              key={f.n}
              className="group bg-carbon p-8 transition-colors hover:bg-negro"
            >
              <span className="font-display text-5xl font-bold text-metal-oscuro transition-colors group-hover:text-amarillo">
                {f.n}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold uppercase tracking-wide text-crema">
                {f.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-metal">
                {f.texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
