import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-3xl h-[320px] md:h-[420px] shadow-xl bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.png')",
        }}
      >
        {/* Gradiente mejorado: de arriba a abajo en móvil, de izquierda a derecha en escritorio */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-black/25" />

        {/* Padding responsivo (px-6 en móvil, px-12 en escritorio) */}
      
      </section>

      {/* Botones: 1 columna en móviles muy pequeños, 2 columnas a partir de sm: y 4 en escritorio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Button asChild className="h-14 text-lg">
          <Link to="/matches">Ver Partidos</Link>
        </Button>

        <Button variant="secondary" asChild className="h-14 text-lg">
          <Link to="/results">Resultados</Link>
        </Button>
      </div>
    </div>
  );
}