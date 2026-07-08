"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, UserRound } from "lucide-react";

const links = [
  { href: "#taller", label: "El Taller" },
  { href: "#servicios", label: "Servicios" },
  { href: "#viaje", label: "El Viaje" },
  { href: "#portfolio", label: "Portfolio" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Bloquear el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cerrar con la tecla Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-metal-oscuro/60 bg-negro/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-xl font-bold uppercase tracking-wide text-crema">
            Herencia
          </span>
          <span className="font-display text-xl font-medium uppercase tracking-[0.3em] text-rojo">
            Garage
          </span>
        </Link>

        {/* Enlaces desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-display text-sm uppercase tracking-widest text-metal transition-colors hover:text-crema"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/cliente/login"
            className="hidden items-center gap-1.5 px-3 py-2 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:text-crema md:flex"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.5} />
            Clientes
          </Link>
          <Link
            href="#contacto"
            className="hidden border border-rojo bg-rojo px-4 py-2 font-display text-xs uppercase tracking-widest text-crema transition-colors hover:bg-rojo-claro hover:border-rojo-claro sm:inline-block"
          >
            Cotizar
          </Link>

          {/* Botón hamburguesa (solo móvil) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-crema transition-colors hover:text-rojo md:hidden"
          >
            {open ? (
              <X className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* Panel móvil */}
      <div
        id="menu-movil"
        className={`overflow-hidden border-t border-metal-oscuro/60 bg-negro/95 backdrop-blur-md transition-[max-height] duration-300 ease-out md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-2">
          {links.map((l) => (
            <li key={l.href} className="border-b border-metal-oscuro/40 last:border-b-0">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-sm uppercase tracking-widest text-metal transition-colors hover:text-crema"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="border-b border-metal-oscuro/40">
            <Link
              href="/cliente/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-4 font-display text-sm uppercase tracking-widest text-metal transition-colors hover:text-crema"
            >
              <UserRound className="h-4 w-4" strokeWidth={1.5} />
              Acceso clientes
            </Link>
          </li>
          <li className="py-4">
            <Link
              href="#contacto"
              onClick={() => setOpen(false)}
              className="block border border-rojo bg-rojo px-4 py-3 text-center font-display text-sm uppercase tracking-widest text-crema transition-colors hover:bg-rojo-claro hover:border-rojo-claro"
            >
              Cotizar
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
