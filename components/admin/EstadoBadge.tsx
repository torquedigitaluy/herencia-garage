const estilos: Record<string, string> = {
  nuevo: "border-amarillo text-amarillo",
  contactado: "border-azul text-crema",
  cotizado: "border-metal text-crema",
  descartado: "border-metal-oscuro text-metal-oscuro",
};

export function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={`border px-2 py-1 font-display text-[10px] uppercase tracking-widest ${estilos[estado] ?? "border-metal text-metal"}`}
    >
      {estado}
    </span>
  );
}
