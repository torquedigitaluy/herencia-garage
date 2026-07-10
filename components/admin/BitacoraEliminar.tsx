"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function BitacoraEliminar({
  entradaId,
  fotoPath,
}: {
  entradaId: string;
  fotoPath: string;
}) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState(false);

  async function eliminar() {
    if (!confirm("¿Eliminar esta actualización de la bitácora?")) return;
    setOcupado(true);
    const supabase = createClient();
    await supabase.from("bitacora_fotos").delete().eq("id", entradaId);
    await supabase.storage.from("media").remove([fotoPath]);
    setOcupado(false);
    router.refresh();
  }

  return (
    <button
      onClick={eliminar}
      disabled={ocupado}
      title="Eliminar"
      className="shrink-0 border border-metal-oscuro p-2 text-metal transition-colors hover:border-amarillo hover:text-amarillo disabled:opacity-50"
    >
      {ocupado ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
