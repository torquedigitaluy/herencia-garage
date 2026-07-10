// Tipos y helpers del portfolio público (tabla portfolio_publico + portfolio_fotos).

export type ProyectoPortfolio = {
  id: string;
  titulo: string;
  slug: string;
  anio: string | null;
  descripcion: string | null;
  historia: string | null;
  problemas: string[];
  soluciones: string[];
  duracion: string | null;
  foto_antes_url: string | null;
  foto_despues_url: string | null;
  destacado: boolean;
  created_at: string;
};

export type FotoGaleria = {
  id: string;
  proyecto_id: string;
  url_foto: string;
  descripcion: string | null;
  orden: number;
  created_at: string;
};

/** Genera un slug URL-safe: "Volkswagen Escarabajo 1965" → "volkswagen-escarabajo-1965". */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita diacríticos (á → a)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
