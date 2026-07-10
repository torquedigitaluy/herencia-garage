# Páginas de detalle de proyectos del Portfolio

Fecha: 2026-07-10 · Estado: aprobado

## Objetivo

Cada card del portfolio de la landing representa un auto restaurado distinto y
linkea a una página propia con la historia completa del proyecto: cómo llegó,
qué problemas tenía, qué se hizo para solucionarlos, galería de fotos
(placeholders por ahora) e información relevante. Contenido gestionable desde
el CMS `/admin`.

## Decisiones

- **Fuente de contenido:** base de datos (extender el CMS existente), no
  hardcodeado. Elegido por el usuario.
- **Esquema:** extender `portfolio_publico` + tabla nueva `portfolio_fotos`
  (patrón `bitacora_fotos`). Elegido por el usuario sobre las alternativas
  (tabla 1:1 de detalle, columna JSONB).
- **Seed:** 5 proyectos inventados y distintos entre sí (Mustang Fastback '67
  destacado, Bel Air '57, Escarabajo '65, Charger '69, Fiat 600 '60), sin
  fotos → la UI muestra placeholders. Se aplica directo a la DB de producción
  (única DB del proyecto); el usuario está avisado.

## Base de datos

Columnas nuevas en `portfolio_publico`:

- `slug text unique not null` — generado del título (ej. `ford-mustang-fastback-1967`).
- `anio text` — año del vehículo.
- `historia text` — cómo llegó el auto al taller.
- `problemas text[]` — lista de problemas encontrados.
- `soluciones text[]` — lista de trabajos realizados.
- `duracion text` — ej. "8 meses".
- `foto_antes_url` / `foto_despues_url` pasan a **nullable** (proyecto sin
  fotos → placeholder en la UI).

Tabla nueva `portfolio_fotos`:

- `id uuid pk`, `proyecto_id uuid` FK → `portfolio_publico` (on delete
  cascade), `url_foto text`, `descripcion text`, `orden int`, `created_at`.
- RLS: SELECT público (anon), ALL para admin (`is_admin()`).
- Storage: bucket público `portfolio`, carpeta `galeria/<proyectoId>/`.

## Página pública `/portfolio/[slug]`

- Server Component con `createPublicClient`, `revalidate = 60`, `notFound()`
  si el slug no existe.
- Secciones: header (título, año, duración, volver), antes & después (fotos o
  placeholders), "Cómo llegó al taller" (historia), "Qué encontramos"
  (problemas), "Qué hicimos" (soluciones), galería (`portfolio_fotos` o
  placeholders), CTA a cotización (`/#contacto`).
- Los links de anchors del navbar pasan de `#seccion` a `/#seccion` para que
  funcionen desde rutas internas.

## Grilla del home

- Cada card de la DB se envuelve en `<Link href="/portfolio/[slug]">` con hint
  "Ver proyecto →". Se mantiene el hover antes/después.
- El fallback de placeholders (DB vacía) queda sin link; tras el seed no
  debería verse más.

## Admin

- `/admin/portfolio/[id]` (página nueva): editar todos los campos (título,
  slug, año, descripción, historia, problemas y soluciones como textarea con
  un ítem por línea, duración, destacado), reemplazar fotos antes/después y
  gestionar galería (subir foto con descripción, eliminar).
- La lista de `/admin/portfolio` linkea cada trabajo a su página de edición.
- El form de alta rápida actual no cambia; el slug se genera del título al
  crear.

## Verificación

- `npx tsc --noEmit` limpio (sin `npm run build` con el dev server activo).
- Navegación real: home → card → detalle; slug inexistente → 404; admin edita
  campos y sube foto de galería.
- `get_advisors` de Supabase sin alertas nuevas tras la migración.
