import { Card, CardContent } from "@/components/ui/card";

export default function UpcomingMatchCard({
  time,
  courtName,
  homeTeamName,
  awayTeamName,
  category,
}) {

  return (

    <Card className="rounded-2xl shadow-sm">

      <CardContent className="p-5">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-sm text-slate-500">

              {time}

            </p>

            <h3 className="font-semibold">

              {courtName}

            </h3>

            {

              category && (

                <p className="text-xs text-slate-400 mt-1">

                  {category}

                </p>

              )

            }

          </div>

          <div className="text-right">

            <p className="font-medium">

              {homeTeamName}

            </p>

            <p className="text-slate-400 text-sm">

              vs

            </p>

            <p className="font-medium">

              {awayTeamName}

            </p>

          </div>

        </div>

      </CardContent>

    </Card>

  );

}