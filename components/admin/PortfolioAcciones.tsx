"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function PortfolioAcciones({
  id,
  destacado,
  fotos,
}: {
  id: string;
  destacado: boolean;
  fotos: string[];
}) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState(false);

  async function toggleDestacado() {
    setOcupado(true);
    await createClient()
      .from("portfolio_publico")
      .update({ destacado: !destacado })
      .eq("id", id);
    setOcupado(false);
    router.refresh();
  }

  async function eliminar() {
    if (!confirm("¿Eliminar este trabajo del portfolio? Esta acción no se puede deshacer.")) {
      return;
    }
    setOcupado(true);
    const supabase = createClient();
    await supabase.from("portfolio_publico").delete().eq("id", id);
    await supabase.storage.from("portfolio").remove(fotos);
    setOcupado(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {ocupado && <LoaderCircle className="h-4 w-4 animate-spin text-amarillo" />}
      <button
        onClick={toggleDestacado}
        disabled={ocupado}
        title={destacado ? "Quitar destacado" : "Marcar como destacado"}
        className={`border p-2 transition-colors disabled:opacity-50 ${
          destacado
            ? "border-amarillo text-amarillo hover:border-metal hover:text-metal"
            : "border-metal-oscuro text-metal hover:border-amarillo hover:text-amarillo"
        }`}
      >
        <Star className="h-4 w-4" fill={destacado ? "currentColor" : "none"} />
      </button>
      <button
        onClick={eliminar}
        disabled={ocupado}
        title="Eliminar"
        className="border border-metal-oscuro p-2 text-metal transition-colors hover:border-amarillo hover:text-amarillo disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
