import { Card, CardContent } from "@/components/ui/card";

export default function NotificationCard() {

  return (

    <Card className="rounded-2xl">

      <CardContent className="p-6">

        <h3 className="font-bold mb-4">

          Avisos

        </h3>

        <div className="space-y-3 text-sm">

          <div className="rounded-lg bg-green-50 p-3 border border-green-200">
            ✅ Clasificaciones actualizadas
          </div>

          <div className="rounded-lg bg-yellow-50 p-3 border border-yellow-200">
            ⏱ El próximo partido comienza en 5 minutos
          </div>

          <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
            🏀 36 equipos registrados
          </div>

        </div>

      </CardContent>

    </Card>

  );

}