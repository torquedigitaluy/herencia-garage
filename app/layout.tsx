import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

// Títulos: Oswald (condensada, mecánica). Cuerpo: Inter (limpia, legible).
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Herencia Garage — Restauración de autos clásicos",
  description:
    "Taller especializado en chapa y pintura de autos clásicos. Devolvemos la vida al metal con estándar de estudio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-negro text-crema">
        {children}
      </body>
    </html>
  );
}
