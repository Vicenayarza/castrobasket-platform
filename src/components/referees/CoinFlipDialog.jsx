import { useEffect, useMemo, useState } from "react";

import Coin3D from "@/components/referees/Coin3D";
import TeamIdentity from "@/components/shared/TeamIdentity";

import { Button } from "@/components/ui/button";

export default function CoinFlipDialog({
  open,
  match,
  teamsMap,
  onCancel,
  onConfirm,
}) {
  const [flipping, setFlipping] = useState(false);
  const [winner, setWinner] = useState(null);

  const homeLogo =
    teamsMap[match?.homeTeamId]?.logo ||
    match?.homeTeamLogo ||
    "";

  const awayLogo =
    teamsMap[match?.awayTeamId]?.logo ||
    match?.awayTeamLogo ||
    "";

  const winnerTeam = useMemo(() => {
    if (!winner || !match) return null;

    return winner === "home"
      ? {
          name: match.homeTeamName,
          logo: homeLogo,
        }
      : {
          name: match.awayTeamName,
          logo: awayLogo,
        };
  }, [winner, match, homeLogo, awayLogo]);

  useEffect(() => {
    if (!open) {
      setFlipping(false);
      setWinner(null);
    }
  }, [open]);

  if (!open || !match) return null;

  function startFlip() {
    setWinner(null);
    setFlipping(true);

    const result = Math.random() < 0.5 ? "home" : "away";

    setTimeout(() => {
      setWinner(result);
      setFlipping(false);

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }, 2600);
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-3">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-4 md:p-10 text-center my-6">
          <h2 className="text-2xl md:text-3xl font-black">
            Sorteo de saque
          </h2>

          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Decide qué equipo saca primero.
          </p>

          <div className="my-5 md:my-8 scale-75 md:scale-100">
            <Coin3D
              homeLogo={homeLogo}
              awayLogo={awayLogo}
              homeName={match.homeTeamName}
              awayName={match.awayTeamName}
              flipping={flipping}
              winner={winner}
            />
          </div>

          {!winner ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div className="rounded-2xl border p-3 flex justify-center">
                  <TeamIdentity
                    name={match.homeTeamName}
                    logo={homeLogo}
                    size="sm"
                  />
                </div>

                <div className="rounded-2xl border p-3 flex justify-center">
                  <TeamIdentity
                    name={match.awayTeamName}
                    logo={awayLogo}
                    size="sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onCancel}
                  disabled={flipping}
                >
                  Cancelar
                </Button>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={startFlip}
                  disabled={flipping}
                >
                  {flipping ? "Girando..." : "Lanzar moneda"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-green-50 border border-green-200 p-4 mb-5">
                <p className="text-sm uppercase text-green-700 font-bold">
                  Saca primero
                </p>

                <div className="flex justify-center mt-3">
                  <TeamIdentity
                    name={winnerTeam.name}
                    logo={winnerTeam.logo}
                    size="lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={startFlip}
                >
                  Repetir sorteo
                </Button>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => onConfirm(winner)}
                >
                  Comenzar partido
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}