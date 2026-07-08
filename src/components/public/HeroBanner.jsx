import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function HeroBanner() {

  return (

    <section className="rounded-3xl bg-gradient-to-r from-green-700 to-green-500 text-white p-10 shadow-lg">

      <p className="uppercase tracking-widest text-green-100">

        CastroBasket 3x3

      </p>

      <h1 className="text-5xl font-black mt-3">

        TORNEO 2027

      </h1>

      <p className="mt-4 text-lg text-green-100">

        Sigue todos los partidos, resultados y clasificaciones en tiempo real.

      </p>

      <div className="flex flex-wrap gap-4 mt-8">

        <Button asChild>

          <Link to="/matches">

            Ver partidos

          </Link>

        </Button>

        <Button
          variant="secondary"
          asChild
        >

          <Link to="/results">

            Resultados

          </Link>

        </Button>

      </div>

    </section>

  );

}