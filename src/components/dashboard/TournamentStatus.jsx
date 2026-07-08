import { Card, CardContent } from "@/components/ui/card";

export default function TournamentStatus() {
  return (
    <Card className="rounded-2xl">

      <CardContent className="p-6">

        <h3 className="font-bold text-lg mb-4">

          Estado del torneo

        </h3>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Partidos finalizados</span>
            <strong>24 / 48</strong>
          </div>

          <div className="flex justify-between">
            <span>Partidos en juego</span>
            <strong>2</strong>
          </div>

          <div className="flex justify-between">
            <span>Próximo partido</span>
            <strong>12:30</strong>
          </div>

          <div className="flex justify-between">
            <span>Retrasos</span>
            <strong className="text-green-600">
              Ninguno
            </strong>
          </div>

        </div>

      </CardContent>

    </Card>
  );
}