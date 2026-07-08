// La Home es estática pero se regenera cada 60 s para reflejar cambios del portfolio.
export const revalidate = 60;

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Taller } from "@/components/sections/Taller";
import { Servicios } from "@/components/sections/Servicios";
import { CanvasScroll } from "@/components/scroll/CanvasScroll";
import { Portfolio } from "@/components/sections/Portfolio";
import { Contacto } from "@/components/sections/Contacto";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Taller />
        <Servicios />
        <CanvasScroll />
        <Portfolio />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
