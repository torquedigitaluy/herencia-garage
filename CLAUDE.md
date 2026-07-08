# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Idioma: el cliente y la spec están en español. Mantén textos de UI, nombres de secciones y comentarios orientados al usuario en español.

## Estado actual

Desarrollo inicial de "Herencia Garage", una plataforma web para un taller especializado en restauración de autos clásicos (exclusivamente chapa y pintura).
El proyecto usa Next.js (App Router) y Supabase, dividiendo el trabajo en un sitio público y un panel de administración (`/admin`).

**Etapas 1, 2 y 3 COMPLETAS.** Stack ya instalado:
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**.
- **Tailwind CSS v4** — sin `tailwind.config.ts`; los tokens de diseño viven en `@theme` dentro de `app/globals.css`.
- `gsap` (con `ScrollTrigger`), `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr` instalados.
- **Supabase conectado** (proyecto `cgqjdfpvpqgsgduroiyc`, credenciales en `.env.local`, MCP `supabase` configurado en `.mcp.json`).
- `PLAN.md` — roadmap de 5 etapas con criterios de aceptación. **Léelo antes de seguir**; define el orden de trabajo.

- **Etapa 1:** Home estática (`app/page.tsx`) que compone secciones en `components/sections/` + `components/layout/`, con textos Lorem Ipsum y placeholders (`components/ui/Placeholder.tsx`). Navbar con menú hamburguesa móvil.
- **Etapa 2:** animación de scroll "El Viaje del Metal" — `components/scroll/CanvasScroll.tsx` (client): precarga 121 frames WebP, los dibuja en `<canvas>` atados al progreso de `ScrollTrigger` (pin a 100vh, scrub), overlay de 4 fases, y limpia el ScrollTrigger al desmontar (`gsap.context().revert()`). Respeta `prefers-reduced-motion` (muestra frame final estático).
- **Etapa 3:** cotización funcional — `components/forms/CotizacionForm.tsx` (client): formulario multi-paso (vehículo → fotos → contacto) que sube hasta 5 fotos (10 MB c/u) a `media/cotizaciones/<leadId>/` e inserta en `leads_cotizacion` con el cliente browser de `lib/supabase/client.ts`. Checkbox "solo chapa y pintura" obligatorio (validado también por RLS). Tabla `leads_cotizacion` y bucket privado `media` creados vía migración; RLS: anon solo INSERT (leads con `estado='nuevo'` y checkbox aceptado; uploads solo bajo `cotizaciones/`), sin SELECT anónimo.

Falta backend de admin y portal cliente (Etapas 4 y 5).

> **Nota Tailwind v4:** para agregar colores/fuentes se editan las variables `--color-*` / `--font-*` en el bloque `@theme` de `globals.css`, NO un archivo de config JS.

## Comandos

- `npm run dev` — servidor de desarrollo (Turbopack, `http://localhost:3000`).
- `npm run build` — build de producción (verifica TypeScript). Criterio de éxito de la Etapa 1: compila limpio.
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`). En Next 16 el script es solo `eslint` (sin `next lint`).

## Estructura

- `app/` — App Router. `layout.tsx` carga fuentes (Oswald display + Inter body vía `next/font`) y aplica `bg-negro text-crema`. `globals.css` define el sistema de diseño (`@theme`).
- `components/layout/` — `Navbar` (client, menú hamburguesa), `Footer`. `components/sections/` — Hero, Taller, Servicios, Portfolio, Contacto. `components/scroll/CanvasScroll.tsx` — animación de scroll. `components/ui/` — primitivos reutilizables.
- `lib/supabase/client.ts` — cliente browser (`createBrowserClient` de `@supabase/ssr`). El cliente server/middleware llegará en la Etapa 4. `components/forms/` — formularios client.
- `public/assets/scroll-sequence/` — **121 frames WebP a 1920×1080** ya copiados (`frame_00001`…`frame_00121`).
- **Pendiente conocido (móvil):** la animación carga siempre la secuencia full (1920px, ~1 GB decodificado con los 121 frames) — pesado en móvil. Se usará una secuencia WebP optimizada aparte para móvil más adelante (ver TODO en `CanvasScroll.tsx`).

## Roadmap (ver PLAN.md para el detalle)

1. ✅ **Scaffolding + maquetación estática** de toda la Home (Lorem Ipsum + placeholders).
2. ✅ **Animación de scroll "El Viaje del Metal"** — `<CanvasScroll>` con GSAP `ScrollTrigger`, pinning a 100vh, secuencia de 121 frames WebP.
3. ✅ **Backend Supabase + cotización** — formulario multi-paso que inserta en `leads_cotizacion` y sube fotos al bucket `media` (privado).
4. **Panel `/admin` (CMS)** — Auth con `@supabase/ssr`, rutas protegidas por middleware, revisión de leads y CRUD de portfolio.
5. **Portal del cliente** — `/cliente/dashboard` con seguimiento en vivo, protegido por RLS (cada cliente ve solo su auto).

## Assets de la animación de scroll (ya existen)

La carpeta `motion_design/` (fuera del futuro `app/`, ~250 MB, no versionar entera) contiene la fuente de la secuencia principal:

- `editables/HG_scroll.aep` — proyecto After Effects (fuente de la animación).
- `render/Scroll_animation_120.mp4` — render de referencia.
- `assets/images/scroll_animation/webp/` — **121 frames listos** (`frame_00001.webp` … `frame_00121.webp`). Estos son los que la Etapa 2 debe copiar/optimizar a `/public/assets/scroll-sequence/` para el `<canvas>`.
- `assets/images/scroll_animation/tif/` — los mismos frames en TIFF (fuente sin comprimir, `frame_00000`–`frame_00120`).
- `assets/images/*.jpeg` — renders conceptuales del vehículo (Ford Mustang Fastback '67) para referencia visual/placeholders.

## Flujo de Trabajo Inicial (Prioridad Visual)

**Instrucción estricta para Claude Code al iniciar el proyecto:**
1. Instalar todas las dependencias necesarias y crear la estructura de carpetas (`app/`, `components/`, etc.).
2. **Prioridad 1:** Comenzar **inmediatamente** por la maquetación visual completa de la página principal (Home). 
3. Crear todas las secciones planificadas de forma estática. Rellenar los textos con *Lorem Ipsum* y utilizar imágenes de placeholder genéricas (ej. vía Unsplash o marcadores grises) para todo el contenido visual.
4. **NO** avanzar a implementar lógica de bases de datos (Supabase), formularios funcionales ni animaciones complejas de scroll (GSAP) hasta que el usuario haya revisado y aprobado el esqueleto visual completo.

## Stack tecnológico (requisitos — no sustituir sin pedir)

-   **Framework**: Next.js 14+ con **App Router**. Server Components por defecto.
-   **Estilos**: Tailwind CSS, con enfoque **mobile-first** y completamente responsivo.
-   **Animaciones Principales**: GSAP (GreenSock) y `ScrollTrigger` para la secuencia de imágenes (WebP).
-   **Backend / DB**: Supabase. Autenticación con `@supabase/ssr`.
-   **Almacenamiento de Media**: Supabase Storage (`bucket: media`). 
-   **Iconos**: `lucide-react`.

## Sistema de diseño (Tailwind config)

Definir estos tokens en la config de Tailwind para mantener la estética "premium, vintage e industrial":

-   **Negro Mate/Estudio** `#0f0f0f` — Fondo principal de la web y de la animación 3D. Aporta elegancia y resalta el metal/pintura de los autos.
-   **Metal Desnudo (Gris Industrial)** `#8e9196` — Para bordes, divisores y tipografía secundaria.
-   **Rojo Automotriz (Acento Clásico)** `#9b111e` (Candy Apple Red) o un **Azul Vintage** `#1c39bb` — Colores para botones de CTA, enlaces activos o detalles sutiles.
-   **Off-white/Crema** `#f4f1ea` — Para el texto principal sobre los fondos oscuros.
-   **Tipografía**:
    -   Títulos: Una fuente Sans-Serif bold y mecánica, estilo *Oswald* o *Teko*.
    -   Cuerpo: Una fuente limpia y muy legible, estilo *Inter* o *Roboto*.

## Base de datos (Esquema Inicial Sugerido para Supabase)

-   `profiles`: (id, role).
-   `leads_cotizacion`: (id, nombre, vehiculo, descripcion, fotos_urls[], estado, fecha).
-   `proyectos_activos`: (id, cliente_id, vehiculo, fase_actual, porcentaje_avance).
-   `bitacora_fotos`: (id, proyecto_id, url_foto, descripcion, fecha).
-   `portfolio_publico`: (id, titulo, descripcion, foto_antes_url, foto_despues_url, destacado).

## Convenciones de Arquitectura para el Scroll 3D

-   **Optimización de Secuencia**: Las imágenes para la animación principal deben estar en `/public/assets/scroll-sequence/` en formato WebP.
-   **Precarga**: El componente del Canvas **DEBE** incluir lógica para precargar las imágenes antes de inicializar el `ScrollTrigger`.
-   **Limpieza de Eventos**: Asegurar que al desmontar el componente, se destruyan las instancias de GSAP `ScrollTrigger` para evitar *memory leaks*.