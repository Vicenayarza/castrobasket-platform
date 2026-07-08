import { useEffect, useState } from "react";

import { getMatches } from "@/services/matchService";
import SponsorsTickerTV from "@/components/tv/SponsorsTickerTV";

export default function TV() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    const interval = setInterval(load, 10000);

    return () => clearInterval(interval);
  }, []);

  async function load() {
    const data = await getMatches();

    data.sort((a, b) => a.time.localeCompare(b.time));

    setMatches(data);
    setLoading(false);
  }

  function phaseLabel(match) {
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";
    return match.group ? `Grupo ${match.group}` : "Fase de grupos";
  }

  const live = matches.filter((m) => m.status === "live");

  const next = matches
    .filter((m) => m.status === "pending")
    .slice(0, 8);

  const results = matches
    .filter((m) => m.status === "finished")
    .slice(-6)
    .reverse();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-4xl font-bold">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-6xl font-black">
          CASTROBASKET 3x3
        </h1>

        <div className="text-2xl text-slate-300">
          Pantalla TV
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-red-400">
            🔴 EN DIRECTO
          </h2>

          <div className="space-y-6">
            {live.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-8 text-3xl text-slate-400">
                No hay partidos en juego
              </div>
            ) : (
              live.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-800 rounded-2xl p-8 border border-red-500"
                >
                  <div className="flex justify-between text-xl text-slate-300 mb-6">
                    <span>{match.courtName}</span>
                    <span>
                      {match.category} · {phaseLabel(match)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-5xl font-black">
                    <span>{match.homeTeamName}</span>
                    <span>{match.homeScore}</span>
                  </div>

                  <div className="my-5 border-t border-slate-700" />

                  <div className="flex justify-between items-center text-5xl font-black">
                    <span>{match.awayTeamName}</span>
                    <span>{match.awayScore}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-green-400">
              ⏰ PRÓXIMOS PARTIDOS
            </h2>

            <div className="space-y-4">
              {next.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-800 rounded-xl p-5 flex justify-between items-center"
                >
                  <div>
                    <div className="text-2xl font-black">
                      {match.time}
                    </div>

                    <div className="text-xl mt-2">
                      {match.homeTeamName} vs {match.awayTeamName}
                    </div>
                  </div>

                  <div className="text-right text-slate-300">
                    <div>{match.courtName}</div>
                    <div className="text-sm">
                      {match.category} · {phaseLabel(match)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6 text-blue-400">
              ✅ ÚLTIMOS RESULTADOS
            </h2>

            <div className="space-y-4">
              {results.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-800 rounded-xl p-5"
                >
                  <div className="flex justify-between text-slate-400 mb-2">
                    <span>{match.category} · {phaseLabel(match)}</span>
                    <span>{match.courtName}</span>
                  </div>

                  <div className="flex justify-between text-2xl font-bold">
                    <span>{match.homeTeamName}</span>
                    <span>
                      {match.homeScore} : {match.awayScore}
                    </span>
                    <span>{match.awayTeamName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SponsorsTickerTV />
    </div>
  );
}