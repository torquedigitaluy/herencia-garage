import { Placeholder } from "@/components/ui/Placeholder";

const stats = [
  { valor: "25+", label: "Años restaurando" },
  { valor: "180", label: "Clásicos entregados" },
  { valor: "100%", label: "Chapa y pintura" },
];

export function Taller() {
  return (
    <section id="taller" className="border-t border-metal-oscuro py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-4">
          <Placeholder label="El taller" ratio="aspect-[3/4]" className="mt-8" />
          <Placeholder label="Detalle" ratio="aspect-[3/4]" />
        </div>

        <div>
          <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
            <span className="h-px w-10 bg-rojo" />
            El Taller
          </p>
          <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Oficio de estudio,
            <br />
            paciencia de coleccionista
          </h2>
          <p className="mt-6 leading-relaxed text-metal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation.
          </p>
          <p className="mt-4 leading-relaxed text-metal">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-metal-oscuro pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-4xl font-bold text-crema">
                  {s.valor}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-metal">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
