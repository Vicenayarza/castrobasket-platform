import { Card, CardContent } from "@/components/ui/card";

export default function LiveMatchCard({
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  courtName,
}) {

  return (

    <Card className="rounded-2xl shadow-sm border-l-4 border-red-500">

      <CardContent className="p-6">

        <div className="flex justify-between items-center mb-4">

          <span className="font-semibold text-slate-700">

            {courtName}

          </span>

          <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">

            EN DIRECTO

          </span>

        </div>

        <div className="space-y-4">

          <div className="flex justify-between items-center">

            <span className="font-medium text-slate-800">

              {homeTeamName}

            </span>

            <span className="text-3xl font-bold">

              {homeScore}

            </span>

          </div>

          <div className="flex justify-between items-center">

            <span className="font-medium text-slate-800">

              {awayTeamName}

            </span>

            <span className="text-3xl font-bold">

              {awayScore}

            </span>

          </div>

        </div>

      </CardContent>

    </Card>

  );

}