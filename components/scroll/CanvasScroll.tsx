"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 121; // frame_00001 … frame_00121

// TODO(móvil): usar una secuencia WebP optimizada aparte para pantallas chicas
// (p. ej. /assets/scroll-sequence/mobile/) y elegirla según el viewport.
const framePath = (i: number) =>
  `/assets/scroll-sequence/frame_${String(i).padStart(5, "0")}.webp`;

// Las 4 fases narran el proceso de restauración a lo largo del scroll.
const fases = [
  { n: "01", titulo: "Ingreso al taller", texto: "El clásico llega tal como está: óxido, golpes e historia." },
  { n: "02", titulo: "Chequeo a Fondo", texto: "Desarme e inspección panel por panel para mapear cada daño." },
  { n: "03", titulo: "Reparación de Chapa", texto: "Enderezado, soldadura y recuperación de la forma original." },
  { n: "04", titulo: "Imprimación y Pintura", texto: "Masillado, primer y color de exhibición: pulido y brillo de estudio." },
];

/** Dibuja la imagen cubriendo el canvas (object-fit: cover), en píxeles de dispositivo. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const ir = img.width / img.height;
  const cr = cw / ch;
  let dw: number, dh: number, dx: number, dy: number;
  if (cr > ir) {
    dw = cw;
    dh = cw / ir;
    dx = 0;
    dy = (ch - dh) / 2;
  } else {
    dh = ch;
    dw = ch * ir;
    dx = (cw - dw) / 2;
    dy = 0;
  }
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function CanvasScroll() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ i: 0 });

  const [progress, setProgress] = useState(0); // precarga 0–100
  const [ready, setReady] = useState(false);
  const [activeFase, setActiveFase] = useState(0);

  // --- Precarga de la secuencia ---
  useEffect(() => {
    let loaded = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded++;
        setProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  // --- Canvas + ScrollTrigger (una vez precargado) ---
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const trigger = triggerRef.current;
    if (!canvas || !trigger) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const img = images[frameRef.current.i];
      if (img) drawCover(ctx, img, canvas.width, canvas.height);
    };

    // Mantiene el backing store del canvas sincronizado con su tamaño CSS real.
    // Debe re-ejecutarse cuando el pin de ScrollTrigger cambia el ancho del canvas,
    // no solo en window.resize — de ahí el ResizeObserver (evita el estirado/achatado).
    const applySize = () => {
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      render();
    };

    const ro = new ResizeObserver(() => applySize());
    ro.observe(canvas);
    applySize();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Sin animación: mostramos el frame final estático.
      frameRef.current.i = FRAME_COUNT - 1;
      render();
      const raf = requestAnimationFrame(() => setActiveFase(fases.length - 1));
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctxGsap = gsap.context(() => {
      gsap.to(frameRef.current, {
        i: FRAME_COUNT - 1,
        ease: "none",
        snap: "i",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            render();
            const fase = Math.min(
              fases.length - 1,
              Math.floor(self.progress * fases.length)
            );
            setActiveFase((prev) => (prev === fase ? prev : fase));
          },
        },
      });
    }, triggerRef);

    // Si se llegó con un anchor (ej. /#portfolio desde una página interna),
    // el pin recién creado corre las secciones de abajo y además cancela el
    // scroll suave del navegador: re-scrolleamos al destino ya con el pin armado.
    if (window.location.hash) {
      const destino = document.querySelector(window.location.hash);
      if (destino) {
        requestAnimationFrame(() =>
          destino.scrollIntoView({ behavior: "instant" })
        );
      }
    }

    return () => {
      ro.disconnect();
      ctxGsap.revert(); // destruye el ScrollTrigger y el pin — evita memory leaks
    };
  }, [ready]);

  return (
    <section
      id="restauracion"
      ref={triggerRef}
      className="relative h-screen overflow-hidden border-t border-metal-oscuro bg-negro"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Degradados para legibilidad del texto sobre la imagen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-negro/85 via-negro/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-negro to-transparent" />

      {/* Overlay de fases */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
            <span className="h-px w-10 bg-amarillo" />
            Restauración por etapas
          </p>

          <div className="relative mt-6 h-52 sm:h-56">
            {fases.map((f, idx) => (
              <div
                key={f.n}
                aria-hidden={activeFase !== idx}
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  activeFase === idx
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <span className="font-display text-7xl font-bold text-amarillo sm:text-8xl">
                  {f.n}
                </span>
                <h3 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-crema sm:text-4xl">
                  {f.titulo}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-metal">
                  {f.texto}
                </p>
              </div>
            ))}
          </div>

          {/* Indicador de fases */}
          <div className="mt-6 flex gap-2" aria-hidden>
            {fases.map((f, idx) => (
              <span
                key={f.n}
                className={`h-1 flex-1 max-w-16 rounded-full transition-colors duration-300 ${
                  activeFase >= idx ? "bg-amarillo" : "bg-metal-oscuro"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overlay de precarga */}
      {!ready && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-negro">
          <p className="font-display text-xs uppercase tracking-[0.35em] text-metal">
            Cargando la secuencia
          </p>
          <div className="h-px w-48 overflow-hidden bg-metal-oscuro">
            <div
              className="h-full bg-amarillo transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-display text-2xl font-bold text-crema tabular-nums">
            {progress}%
          </p>
        </div>
      )}
    </section>
  );
}
