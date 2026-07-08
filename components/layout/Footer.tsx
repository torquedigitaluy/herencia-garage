import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-metal-oscuro bg-negro">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold uppercase tracking-wide">
                Herencia
              </span>
              <span className="font-display text-2xl font-medium uppercase tracking-[0.3em] text-rojo">
                Garage
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-metal">
              Chapa y pintura de autos clásicos con estándar de estudio. No
              hacemos mecánica: hacemos que el metal vuelva a brillar.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-crema">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-metal">
              <li><Link href="#taller" className="hover:text-crema">El Taller</Link></li>
              <li><Link href="#servicios" className="hover:text-crema">Servicios</Link></li>
              <li><Link href="#portfolio" className="hover:text-crema">Portfolio</Link></li>
              <li><Link href="#contacto" className="hover:text-crema">Cotizar</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-crema">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-metal">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rojo" strokeWidth={1.5} />
                Lorem ipsum 1234, Ciudad
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rojo" strokeWidth={1.5} />
                +00 000 000 000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rojo" strokeWidth={1.5} />
                hola@herenciagarage.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-metal-oscuro pt-6 text-xs text-metal md:flex-row">
          <p>© {new Date().getFullYear()} Herencia Garage. Todos los derechos reservados.</p>
          <p className="font-display uppercase tracking-widest">Restauración · Chapa · Pintura</p>
        </div>
      </div>
    </footer>
  );
}
