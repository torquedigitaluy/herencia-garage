import { Wrench, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FASES, faseIndex, faseLabel } from "@/lib/fases";

export const metadata = { title: "Mi restauración — Herencia Garage" };

export default async function ClienteDashboardPage() {
  const supabase = await createClient();

  // RLS filtra automáticamente: el cliente solo ve sus propios proyectos.
  const { data: proyectos } = await supabase
    .from("proyectos_activos")
    .select("*, bitacora_fotos(*)")
    .order("created_at", { ascending: false });

  if (!proyectos || proyectos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 border border-dashed border-metal-oscuro p-16 text-center">
        <Wrench className="h-8 w-8 text-metal" strokeWidth={1.5} />
        <p className="font-display text-xl font-bold uppercase text-crema">
          Todavía no tenés proyectos activos
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-metal">
          Cuando tu auto entre al taller vas a poder seguir acá cada etapa de la
          restauración, con fotos del avance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {await Promise.all(
        proyectos.map(async (proyecto) => {
          const idx = faseIndex(proyecto.fase_actual);
          const bitacora = [...proyecto.bitacora_fotos].sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );

          // URLs firmadas (1 h) de las fotos de bitácora
          const fotos = new Map<string, string>();
          for (const entrada of bitacora) {
            const { data } = await supabase.storage
              .from("media")
              .createSignedUrl(entrada.url_foto, 3600);
            if (data?.signedUrl) fotos.set(entrada.id, data.signedUrl);
          }

          return (
            <section key={proyecto.id}>
              <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
                <span className="h-px w-10 bg-rojo" />
                Proyecto activo
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-tight text-crema">
                {proyecto.vehiculo}
              </h1>

              {/* Barra de progreso */}
              <div className="mt-8 border border-metal-oscuro bg-carbon p-6">
                <div className="flex items-end justify-between gap-4">
                  <p className="font-display text-xs uppercase tracking-widest text-metal">
                    Avance general
                  </p>
                  <p className="font-display text-3xl font-bold text-rojo">
                    {proyecto.porcentaje_avance}%
                  </p>
                </div>
                <div className="mt-3 h-2 w-full bg-negro">
                  <div
                    className="h-full bg-rojo transition-all"
                    style={{ width: `${proyecto.porcentaje_avance}%` }}
                  />
                </div>

                {/* Timeline de fases */}
                <ol className="mt-8 grid gap-4 sm:grid-cols-5">
                  {FASES.map((fase, i) => {
                    const completada = i < idx;
                    const actual = i === idx;
                    return (
                      <li key={fase.key} className="flex items-start gap-3 sm:block">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center border font-display text-xs sm:mb-3 ${
                            completada
                              ? "border-rojo bg-rojo text-crema"
                              : actual
                                ? "border-rojo text-rojo"
                                : "border-metal-oscuro text-metal-oscuro"
                          }`}
                        >
                          {completada ? <Check className="h-4 w-4" /> : `0${i + 1}`}
                        </span>
                        <p
                          className={`font-display text-xs uppercase tracking-widest ${
                            actual ? "text-crema" : completada ? "text-metal" : "text-metal-oscuro"
                          }`}
                        >
                          {fase.label}
                          {actual && (
                            <span className="mt-1 block text-[10px] text-rojo">En curso</span>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Bitácora */}
              <h2 className="mt-12 font-display text-2xl font-bold uppercase text-crema">
                Bitácora del taller
              </h2>
              {bitacora.length === 0 ? (
                <p className="mt-4 border border-dashed border-metal-oscuro p-8 text-center text-sm text-metal">
                  Todavía no hay actualizaciones. El taller irá subiendo fotos del avance.
                </p>
              ) : (
                <ol className="mt-6 space-y-8 border-l border-metal-oscuro pl-6">
                  {bitacora.map((entrada) => (
                    <li key={entrada.id} className="relative">
                      <span className="absolute -left-[1.85rem] top-1 h-2.5 w-2.5 bg-rojo" />
                      <time className="font-display text-xs uppercase tracking-widest text-metal">
                        {new Date(entrada.fecha).toLocaleDateString("es-UY", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      {entrada.descripcion && (
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-crema">
                          {entrada.descripcion}
                        </p>
                      )}
                      {fotos.has(entrada.id) && (
                        <a href={fotos.get(entrada.id)} target="_blank" className="mt-3 block w-fit">
                          {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal */}
                          <img
                            src={fotos.get(entrada.id)}
                            alt={entrada.descripcion ?? `Avance de ${proyecto.vehiculo}`}
                            className="max-h-80 border border-metal-oscuro object-cover transition-opacity hover:opacity-80"
                          />
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              <p className="mt-8 text-xs text-metal-oscuro">
                Fase actual: {faseLabel(proyecto.fase_actual)} · En el taller desde el{" "}
                {new Date(proyecto.created_at).toLocaleDateString("es-UY")}
              </p>
            </section>
          );
        })
      )}
    </div>
  );
}
