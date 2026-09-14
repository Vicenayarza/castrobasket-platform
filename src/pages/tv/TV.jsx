import { useEffect, useState } from "react";

import { subscribeMatches } from "@/services/matchService";
import { getStandings } from "@/services/standingsService";

import SponsorsTickerTV from "@/components/tv/SponsorsTickerTV";

export default function TV() {
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);

  const [standingIndex, setStandingIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeMatches((data) => {
      const sortedMatches = [...data].sort((a, b) =>
        (a.time || "").localeCompare(b.time || "")
      );

      setMatches(sortedMatches);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadStandings() {
      try {
        const data = await getStandings();

        setStandings(data);
        setStandingIndex(0);
      } catch (error) {
        console.error("Error cargando clasificaciones:", error);
      }
    }

    loadStandings();

    const standingsRefreshInterval = setInterval(
      loadStandings,
      30000
    );

    return () => clearInterval(standingsRefreshInterval);
  }, []);

  useEffect(() => {
    if (standings.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setStandingIndex((current) => {
        const nextIndex = current + 1;

        return nextIndex >= standings.length
          ? 0
          : nextIndex;
      });
    }, 10000);

    return () => clearInterval(rotationInterval);
  }, [standings.length]);

  function phaseLabel(match) {
    if (match.phase === "quarterfinal") return "Cuartos";
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";

    return match.group
      ? `Grupo ${match.group}`
      : "Fase de grupos";
  }

  function groupLabel(group) {
    if (!group) return "Grupo único";

    const normalized = group
      .toString()
      .toLowerCase();

    if (
      normalized === "unico" ||
      normalized === "único"
    ) {
      return "Grupo único";
    }

    return `Grupo ${group}`;
  }

  const live = matches.filter(
    (match) => match.status === "live"
  );

  const next = matches
    .filter((match) => match.status === "pending")
    .slice(0, 5);

  const activeStanding =
    standings.length > 0
      ? standings[standingIndex]
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-4xl font-bold">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 xl:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl xl:text-6xl font-black">
          CASTROBASKET 3x3
        </h1>

        <div className="text-xl xl:text-2xl text-slate-300">
          Pantalla TV
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
        <section>
          <h2 className="text-3xl xl:text-4xl font-bold mb-6 text-red-400">
            🔴 EN DIRECTO
          </h2>

          <div className="space-y-5">
            {live.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-8 text-2xl text-slate-400">
                No hay partidos en juego
              </div>
            ) : (
              live.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-800 rounded-2xl p-6 border border-red-500"
                >
                  <div className="flex justify-between gap-4 text-lg text-slate-300 mb-5">
                    <span>{match.courtName}</span>

                    <span className="text-right">
                      {match.category} · {phaseLabel(match)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-5 text-3xl xl:text-5xl font-black">
                    <span className="min-w-0 break-words">
                      {match.homeTeamName}
                    </span>

                    <span className="shrink-0">
                      {match.homeScore}
                    </span>
                  </div>

                  <div className="my-5 border-t border-slate-700" />

                  <div className="flex justify-between items-center gap-5 text-3xl xl:text-5xl font-black">
                    <span className="min-w-0 break-words">
                      {match.awayTeamName}
                    </span>

                    <span className="shrink-0">
                      {match.awayScore}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="space-y-8">
          <section>
            <h2 className="text-3xl xl:text-4xl font-bold mb-6 text-green-400">
              ⏰ PRÓXIMOS PARTIDOS
            </h2>

            {next.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-6 text-xl text-slate-400">
                No hay próximos partidos
              </div>
            ) : (
              <div className="space-y-3">
                {next.map((match) => (
                  <div
                    key={match.id}
                    className="bg-slate-800 rounded-xl p-4 flex justify-between items-center gap-5"
                  >
                    <div className="min-w-0">
                      <div className="text-xl xl:text-2xl font-black">
                        {match.time}
                      </div>

                      <div className="text-base xl:text-xl mt-1 break-words">
                        {match.homeTeamName}
                        <span className="text-slate-500 mx-2">
                          vs
                        </span>
                        {match.awayTeamName}
                      </div>
                    </div>

                    <div className="shrink-0 text-right text-slate-300">
                      <div>{match.courtName}</div>

                      <div className="text-sm mt-1">
                        {match.category} · {phaseLabel(match)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-end gap-4 mb-5">
              <div>
                <h2 className="text-3xl xl:text-4xl font-bold text-blue-400">
                  🏆 CLASIFICACIÓN
                </h2>

                {activeStanding && (
                  <p className="text-xl text-slate-300 mt-2">
                    {activeStanding.category} ·{" "}
                    {groupLabel(activeStanding.group)}
                  </p>
                )}
              </div>

              {standings.length > 1 && (
                <span className="text-sm text-slate-500">
                  Cambia cada 10 segundos
                </span>
              )}
            </div>

            {!activeStanding ? (
              <div className="bg-slate-800 rounded-2xl p-6 text-xl text-slate-400">
                No hay clasificaciones disponibles
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700 text-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        #
                      </th>

                      <th className="px-4 py-3 text-left">
                        Equipo
                      </th>

                      <th className="px-3 py-3 text-center">
                        PJ
                      </th>

                      <th className="px-3 py-3 text-center">
                        PG
                      </th>

                      <th className="px-3 py-3 text-center">
                        PP
                      </th>

                      <th className="px-3 py-3 text-center">
                        DIF
                      </th>

                      <th className="px-3 py-3 text-center">
                        PTS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {activeStanding.teams.map(
                      (team, index) => (
                        <tr
                          key={team.id}
                          className="border-t border-slate-700"
                        >
                          <td className="px-4 py-3 font-bold">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3 font-semibold">
                            {team.name}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {team.played}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {team.wins}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {team.losses}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {team.difference > 0
                              ? `+${team.difference}`
                              : team.difference}
                          </td>

                          <td className="px-3 py-3 text-center font-black text-green-400">
                            {team.points}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {standings.length > 1 && (
                  <div className="flex justify-center gap-2 py-3 border-t border-slate-700">
                    {standings.map((standing, index) => (
                      <span
                        key={`${standing.category}-${standing.group}`}
                        className={`h-2 rounded-full transition-all ${
                          index === standingIndex
                            ? "w-8 bg-blue-400"
                            : "w-2 bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <SponsorsTickerTV />
    </div>
  );
}