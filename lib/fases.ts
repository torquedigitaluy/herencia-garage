/** Fases de restauración — mismas 4 del "Viaje del Metal" + entrega. */
export const FASES = [
  { key: "chapa_desnuda", label: "Chapa desnuda" },
  { key: "reparacion_chapa", label: "Reparación de chapa" },
  { key: "imprimacion", label: "Imprimación" },
  { key: "pintura_final", label: "Pintura final" },
  { key: "entregado", label: "Entregado" },
] as const;

export type FaseKey = (typeof FASES)[number]["key"];

export function faseLabel(key: string) {
  return FASES.find((f) => f.key === key)?.label ?? key;
}

export function faseIndex(key: string) {
  return Math.max(0, FASES.findIndex((f) => f.key === key));
}
