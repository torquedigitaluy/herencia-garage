import { createClient } from "@/lib/supabase/server";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { PortfolioAcciones } from "@/components/admin/PortfolioAcciones";

export const metadata = { title: "Portfolio — Admin · Herencia Garage" };

export default async function PortfolioAdminPage() {
  const supabase = await createClient();
  const { data: proyectos, error } = await supabase
    .from("portfolio_publico")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-metal">Error al cargar el portfolio: {error.message}</p>;
  }

  const publicUrl = (path: string) =>
    supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-crema">Portfolio</h1>
      <p className="mt-2 text-sm text-metal">
        Los trabajos publicados acá aparecen en la sección &ldquo;Antes &amp; después&rdquo;
        de la landing.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PortfolioForm />
        </div>

        <div className="lg:col-span-2">
          {proyectos.length === 0 ? (
            <p className="border border-dashed border-metal-oscuro p-10 text-center text-metal">
              Todavía no hay trabajos publicados.
            </p>
          ) : (
            <ul className="space-y-4">
              {proyectos.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-4 border border-metal-oscuro bg-carbon p-4"
                >
                  <div className="flex gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl(p.foto_antes_url)}
                      alt={`${p.titulo} antes`}
                      className="h-20 w-28 border border-metal-oscuro object-cover"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl(p.foto_despues_url)}
                      alt={`${p.titulo} después`}
                      className="h-20 w-28 border border-metal-oscuro object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-crema">
                      {p.titulo}
                    </p>
                    {p.descripcion && (
                      <p className="mt-1 line-clamp-2 text-sm text-metal">{p.descripcion}</p>
                    )}
                  </div>
                  <PortfolioAcciones
                    id={p.id}
                    destacado={p.destacado}
                    fotos={[p.foto_antes_url, p.foto_despues_url]}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
