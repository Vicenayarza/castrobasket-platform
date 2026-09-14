import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Play,
  Flag,
  Plus,
  Minus,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import {
  getMatches,
  updateMatchStatus,
  startMatchWithCoinWinner,
  updateMatchStats,
} from "@/services/matchService";

import CoinFlipDialog from "@/components/referees/CoinFlipDialog";

import { getTeams } from "@/services/teamService";
import { logout } from "@/services/authService";

import TeamIdentity from "@/components/shared/TeamIdentity";
import { Button } from "@/components/ui/button";

export default function Referee() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [teamsMap, setTeamsMap] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [coinDialogMatch, setCoinDialogMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }

    const [matchesData, teamsData] = await Promise.all([
      getMatches(),
      getTeams(),
    ]);

    const map = {};

    teamsData.forEach((team) => {
      map[team.id] = team;
    });

    const myMatches = matchesData
      .filter((match) => match.refereeId === user.id)
      .sort((a, b) => a.time.localeCompare(b.time));

    setTeamsMap(map);
    setMatches(myMatches);
    setLoading(false);
  }

  const pendingMatches = useMemo(() => {
    return matches.filter((match) => match.status === "pending");
  }, [matches]);

  const liveMatches = useMemo(() => {
    return matches.filter((match) => match.status === "live");
  }, [matches]);

  const finishedMatches = useMemo(() => {
    return matches.filter((match) => match.status === "finished");
  }, [matches]);

  function logoOf(teamId) {
    return teamsMap[teamId]?.logo || "";
  }

  function handleStart(match) {
    setCoinDialogMatch(match);
  }

  async function confirmCoinWinner(winner) {
    if (!coinDialogMatch) return;

    await startMatchWithCoinWinner(
      coinDialogMatch.id,
      winner
    );

    const startedMatch = {
      ...coinDialogMatch,
      status: "live",
      coinWinner: winner,
    };

    setCoinDialogMatch(null);
    setSelectedMatch(startedMatch);

    loadMatches();
  }

  async function updateScore(homeScore, awayScore) {
  const homeFouls = selectedMatch.homeFouls || 0;
  const awayFouls = selectedMatch.awayFouls || 0;

  setSelectedMatch((current) => ({
    ...current,
    homeScore,
    awayScore,
  }));

  try {
    await updateMatchStats(
      selectedMatch.id,
      homeScore,
      awayScore,
      homeFouls,
      awayFouls
    );
  } catch (error) {
    console.error("Error actualizando el marcador:", error);
  }
}
  function homePlus() {
    updateScore(
      selectedMatch.homeScore + 1,
      selectedMatch.awayScore
    );
  }

  function homeMinus() {
    if (selectedMatch.homeScore <= 0) return;

    updateScore(
      selectedMatch.homeScore - 1,
      selectedMatch.awayScore
    );
  }

  function awayPlus() {
    updateScore(
      selectedMatch.homeScore,
      selectedMatch.awayScore + 1
    );
  }

  function awayMinus() {
    if (selectedMatch.awayScore <= 0) return;

    updateScore(
      selectedMatch.homeScore,
      selectedMatch.awayScore - 1
    );
  }

  async function handleFinish() {
    const ok = confirm(
      `¿Finalizar partido?\n\n${selectedMatch.homeTeamName} ${selectedMatch.homeScore} - ${selectedMatch.awayScore} ${selectedMatch.awayTeamName}`
    );

    if (!ok) return;

    await updateMatchStats(
  selectedMatch.id,
  selectedMatch.homeScore,
  selectedMatch.awayScore,
  selectedMatch.homeFouls || 0,
  selectedMatch.awayFouls || 0
);

    await updateMatchStatus(
      selectedMatch.id,
      "finished"
    );

    setSelectedMatch(null);
    loadMatches();
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function phaseLabel(match) {
    if (match.phase === "quarterfinal") return "Cuartos";
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";
    return match.group ? `Grupo ${match.group}` : "Fase de grupos";
  }

  function coinWinnerName(match) {
    if (!match.coinWinner) return "";

    return match.coinWinner === "home"
      ? match.homeTeamName
      : match.awayTeamName;
  }
  function homeFoulPlus() {
  setSelectedMatch((current) => ({
    ...current,
    homeFouls: (current.homeFouls || 0) + 1,
  }));
}

function homeFoulMinus() {
  if ((selectedMatch.homeFouls || 0) <= 0) return;

  setSelectedMatch((current) => ({
    ...current,
    homeFouls: (current.homeFouls || 0) - 1,
  }));
}

function awayFoulPlus() {
  setSelectedMatch((current) => ({
    ...current,
    awayFouls: (current.awayFouls || 0) + 1,
  }));
}

function awayFoulMinus() {
  if ((selectedMatch.awayFouls || 0) <= 0) return;

  setSelectedMatch((current) => ({
    ...current,
    awayFouls: (current.awayFouls || 0) - 1,
  }));
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        Cargando...
      </div>
    );
  }

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedMatch(null);
                loadMatches();
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>

          <div className="bg-white rounded-3xl shadow p-6 md:p-10">
            <div className="text-center mb-8">
              <p className="text-slate-500">
                {selectedMatch.time} · {selectedMatch.courtName}
              </p>

              <h1 className="text-3xl md:text-5xl font-black mt-2">
                Partido en juego
              </h1>

              <p className="text-green-700 font-semibold mt-2">
                {selectedMatch.category} · {phaseLabel(selectedMatch)}
              </p>

              {selectedMatch.coinWinner && (
                <p className="mt-3 text-lg font-bold text-orange-600">
                  🏀 Saca primero: {coinWinnerName(selectedMatch)}
                </p>
              )}
            </div>

            <div className="space-y-10">
              <div className="text-center border rounded-3xl p-6">
                <div className="flex justify-center mb-6">
                  <TeamIdentity
                    name={selectedMatch.homeTeamName}
                    logo={logoOf(selectedMatch.homeTeamId)}
                    size="lg"
                  />
                </div>

                <div className="flex justify-center items-center gap-5">
                  <Button size="lg" variant="outline" onClick={homeMinus}>
                    <Minus />
                  </Button>

                  <span className="text-7xl md:text-8xl font-black w-32">
                    {selectedMatch.homeScore}
                  </span>

                  <Button size="lg" onClick={homePlus}>
                    <Plus />
                  </Button>                  
                </div>
                <div className="mt-6 border-t pt-5">
                  <p className="text-sm text-slate-500 mb-3">
                    Faltas personales
                  </p>

                  <div className="flex justify-center items-center gap-4">
                    <Button variant="outline" onClick={homeFoulMinus}>
                      <Minus />
                    </Button>

                    <span className="text-4xl font-black">
                      {selectedMatch.homeFouls || 0}
                    </span>

                    <Button onClick={homeFoulPlus}>
                      <Plus />
                    </Button>
                  </div>

                  {(selectedMatch.homeFouls || 0) >= 6 && (
                    <p className="mt-3 text-red-600 font-bold">
                      ⚠️ Bonus: 2 tiros libres
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center border rounded-3xl p-6">
                <div className="flex justify-center mb-6">
                  <TeamIdentity
                    name={selectedMatch.awayTeamName}
                    logo={logoOf(selectedMatch.awayTeamId)}
                    size="lg"
                  />
                </div>

                <div className="flex justify-center items-center gap-5">
                  <Button size="lg" variant="outline" onClick={awayMinus}>
                    <Minus />
                  </Button>

                  <span className="text-7xl md:text-8xl font-black w-32">
                    {selectedMatch.awayScore}
                  </span>

                  <Button size="lg" onClick={awayPlus}>
                    <Plus />
                  </Button>
                </div>
                <div className="mt-6 border-t pt-5">
                  <p className="text-sm text-slate-500 mb-3">
                    Faltas personales
                  </p>

                  <div className="flex justify-center items-center gap-4">
                    <Button variant="outline" onClick={awayFoulMinus}>
                      <Minus />
                    </Button>

                    <span className="text-4xl font-black">
                      {selectedMatch.awayFouls || 0}
                    </span>

                    <Button onClick={awayFoulPlus}>
                      <Plus />
                    </Button>
                  </div>

                  {(selectedMatch.awayFouls || 0) >= 6 && (
                    <p className="mt-3 text-red-600 font-bold">
                    ⚠️ Bonus: 2 tiros libres
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-10 bg-red-600 hover:bg-red-700 text-lg py-6"
              onClick={handleFinish}
            >
              <Flag className="mr-2 h-5 w-5" />
              Finalizar partido
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-black">
              Panel árbitro
            </h1>

            <p className="text-slate-500 mt-2">
              Selecciona el partido que vas a arbitrar.
            </p>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>

        {liveMatches.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              🔴 En juego
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {liveMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teamsMap={teamsMap}
                  actionText="Abrir partido"
                  onAction={() => setSelectedMatch(match)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">
            ⏰ Partidos pendientes
          </h2>

          {pendingMatches.length === 0 ? (
            <Empty text="No tienes partidos pendientes." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {pendingMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teamsMap={teamsMap}
                  actionText="Empezar"
                  icon={<Play className="mr-2 h-4 w-4" />}
                  onAction={() => handleStart(match)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            ✅ Partidos finalizados
          </h2>

          {finishedMatches.length === 0 ? (
            <Empty text="Todavía no tienes partidos finalizados." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {finishedMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-2xl shadow p-5"
                >
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{match.time}</span>
                    <span>{match.courtName}</span>
                  </div>

                  <p className="text-sm text-green-700 font-semibold mt-2">
                    {match.category} · {phaseLabel(match)}
                  </p>

                  {match.coinWinner && (
                    <p className="text-sm text-orange-600 font-semibold mt-1">
                      🏀 Sacó primero: {coinWinnerName(match)}
                    </p>
                  )}

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <TeamIdentity
                        name={match.homeTeamName}
                        logo={logoOf(match.homeTeamId)}
                        size="sm"
                      />
                      <span className="font-black text-xl">
                        {match.homeScore}
                      </span>
                    </div>
                    

                    <div className="flex justify-between items-center">
                      <TeamIdentity
                        name={match.awayTeamName}
                        logo={logoOf(match.awayTeamId)}
                        size="sm"
                      />
                      <span className="font-black text-xl">
                        {match.awayScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <CoinFlipDialog
        open={!!coinDialogMatch}
        match={coinDialogMatch}
        teamsMap={teamsMap}
        onCancel={() => setCoinDialogMatch(null)}
        onConfirm={confirmCoinWinner}
      />
    </div>
  );
}

function MatchCard({
  match,
  teamsMap,
  actionText,
  onAction,
  icon,
}) {
  function phaseLabel(match) {
    if (match.phase === "quarterfinal") return "Cuartos";
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";
    return match.group ? `Grupo ${match.group}` : "Fase de grupos";
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex justify-between text-sm text-slate-500">
        <span>{match.time}</span>
        <span>{match.courtName}</span>
      </div>

      <p className="text-sm text-green-700 font-semibold mt-2">
        {match.category} · {phaseLabel(match)}
      </p>

      {match.coinWinner && (
        <p className="text-sm text-orange-600 font-semibold mt-1">
          🏀 Sacó primero:{" "}
          {match.coinWinner === "home"
            ? match.homeTeamName
            : match.awayTeamName}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <TeamIdentity
          name={match.homeTeamName}
          logo={teamsMap[match.homeTeamId]?.logo}
        />

        <p className="text-slate-400 text-sm">
          vs
        </p>

        <TeamIdentity
          name={match.awayTeamName}
          logo={teamsMap[match.awayTeamId]?.logo}
        />
      </div>

      <Button className="w-full mt-5" onClick={onAction}>
        {icon}
        {actionText}
      </Button>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center text-slate-500">
      {text}
    </div>
  );
}