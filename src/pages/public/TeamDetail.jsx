import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import PublicLayout from "@/components/layout/PublicLayout";

import { getTeams } from "@/services/teamService";
import { getMatches } from "@/services/matchService";

export default function TeamDetail() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [teamId]);

  async function load() {
    setLoading(true);

    const [teamsData, matchesData] = await Promise.all([
      getTeams(),
      getMatches(),
    ]);

    const selectedTeam = teamsData.find((t) => t.id === teamId);

    const teamMatches = matchesData
      .filter(
        (m) =>
          m.homeTeamId === teamId ||
          m.awayTeamId === teamId
      )
      .sort((a, b) => a.time.localeCompare(b.time));

    setTeam(selectedTeam);
    setMatches(teamMatches);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const finished = matches.filter((m) => m.status === "finished");

    let wins = 0;
    let pointsFor = 0;
    let pointsAgainst = 0;

    finished.forEach((match) => {
      const isHome = match.homeTeamId === teamId;

      const scored = isHome ? match.homeScore : match.awayScore;
      const conceded = isHome ? match.awayScore : match.homeScore;

      pointsFor += Number(scored || 0);
      pointsAgainst += Number(conceded || 0);

      if (scored > conceded) wins++;
    });

    return {
      played: finished.length,
      wins,
      winRate:
        finished.length === 0
          ? 0
          : Math.round((wins / finished.length) * 100),
      pointsPerGame:
        finished.length === 0
          ? 0
          : (pointsFor / finished.length).toFixed(1),
      pointsFor,
      pointsAgainst,
    };
  }, [matches, teamId]);

  function phaseLabel(match) {
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";
    return match.group ? `Grupo ${match.group}` : "Fase de grupos";
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20 text-center">Cargando equipo...</div>
      </PublicLayout>
    );
  }

  if (!team) {
    return (
      <PublicLayout>
        <div className="max-w-5xl mx-auto px-5 py-10">
          Equipo no encontrado.
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-5 py-10 space-y-8">
        <Link to="/teams" className="text-green-700 font-semibold">
          ← Volver a equipos
        </Link>

        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex items-center gap-6">
            {team.logo ? (
              <img
                src={team.logo}
                alt={team.name}
                className="w-24 h-24 rounded-2xl object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-green-100 flex items-center justify-center text-3xl font-black text-green-700">
                {team.name?.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-4xl font-black">{team.name}</h1>
              <p className="text-slate-500 mt-2">
                {team.club} · {team.category} · Grupo {team.group || "Único"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat title="Partidos jugados" value={stats.played} />
          <Stat title="Victorias" value={stats.wins} />
          <Stat title="Ratio victorias" value={`${stats.winRate}%`} />
          <Stat title="Puntos por partido" value={stats.pointsPerGame} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Stat title="Puntos logrados" value={stats.pointsFor} />
          <Stat title="Puntos recibidos" value={stats.pointsAgainst} />
        </div>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Team roster</h2>

          {team.players?.length ? (
            <div className="grid md:grid-cols-2 gap-3">
              {team.players.map((player, index) => (
                <div key={index} className="border rounded-xl p-3">
                  {player}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              Todavía no hay jugadores añadidos.
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Partidos</h2>

          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-bold">
                    {match.time} · {match.courtName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {match.category} · {phaseLabel(match)}
                  </p>
                </div>

                <div className="font-semibold text-lg">
                  {match.homeTeamName}
                  {" "}
                  {match.status === "finished"
                    ? `${match.homeScore} - ${match.awayScore}`
                    : "vs"}
                  {" "}
                  {match.awayTeamName}
                </div>

                <div className="text-sm text-slate-500">
                  {match.status === "finished"
                    ? "Finalizado"
                    : match.status === "live"
                    ? "En juego"
                    : "Pendiente"}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 text-center">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-black text-green-700 mt-2">{value}</p>
    </div>
  );
}