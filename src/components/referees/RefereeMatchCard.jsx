import { Button } from "@/components/ui/button";

import ScoreButton from "./ScoreButton";

export default function RefereeMatchCard({

  match,

  onStart,

  onFinish,

  onHomePlus,

  onHomeMinus,

  onAwayPlus,

  onAwayMinus,

}) {

  return (

    <div className="rounded-2xl border bg-white shadow p-6">

      <div className="flex justify-between">

        <div>

          <h2 className="text-xl font-bold">

            {match.homeTeamName}

            {" vs "}

            {match.awayTeamName}

          </h2>

          <p className="text-slate-500">

            {match.time}

          </p>

        </div>

        <div>

          {match.status}

        </div>

      </div>

      {

        match.status==="pending" && (

          <div className="mt-8">

            <Button
              className="w-full"
              onClick={()=>onStart(match)}
            >

              Iniciar partido

            </Button>

          </div>

        )

      }

      {

        match.status==="live" && (

          <>

            <div className="mt-8 flex justify-center items-center gap-12">

              <div className="text-center">

                <div className="text-6xl font-bold">

                  {match.homeScore}

                </div>

                <div className="mt-4 flex gap-2">

                  <ScoreButton

                    text="+"

                    onClick={()=>onHomePlus(match)}

                  />

                  <ScoreButton

                    text="-"

                    onClick={()=>onHomeMinus(match)}

                  />

                </div>

              </div>

              <div className="text-center">

                <div className="text-6xl font-bold">

                  {match.awayScore}

                </div>

                <div className="mt-4 flex gap-2">

                  <ScoreButton

                    text="+"

                    onClick={()=>onAwayPlus(match)}

                  />

                  <ScoreButton

                    text="-"

                    onClick={()=>onAwayMinus(match)}

                  />

                </div>

              </div>

            </div>

            <Button

              className="mt-8 w-full"

              variant="destructive"

              onClick={()=>onFinish(match)}

            >

              Finalizar partido

            </Button>

          </>

        )

      }

    </div>

  );

}