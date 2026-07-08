import { useEffect, useMemo, useState } from "react";

import PublicLayout from "@/components/layout/PublicLayout";
import PublicMatchesTable from "@/components/public/PublicMatchesTable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getMatches } from "@/services/matchService";
import { getTeams } from "@/services/teamService";

export default function Results() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamsMap, setTeamsMap] = useState({});

  const [category, setCategory] = useState("all");
  const [phase, setPhase] = useState("all");
  const [group, setGroup] = useState("all");

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);

    try {
      const [matchesData, teamsData] = await Promise.all([
  getMatches(),
  getTeams(),
]);

matchesData.sort((a, b) => a.time.localeCompare(b.time));

const map = {};
teamsData.forEach((team) => {
  map[team.id] = team;
});

setMatches(matchesData);
setTeamsMap(map);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const finishedMatches = useMemo(() => {
    return matches.filter((match) => match.status === "finished");
  }, [matches]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        finishedMatches
          .map((match) => match.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [finishedMatches]);

  const groups = useMemo(() => {
    return [
      ...new Set(
        finishedMatches
          .filter((match) => category === "all" || match.category === category)
          .filter((match) => match.phase === "groups")
          .map((match) => match.group || "Único")
      ),
    ].sort();
  }, [finishedMatches, category]);

  const filteredMatches = useMemo(() => {
    return finishedMatches.filter((match) => {
      const categoryOk =
        category === "all" ||
        match.category === category;

      const phaseOk =
        phase === "all" ||
        match.phase === phase;

      const groupOk =
        phase !== "groups" ||
        group === "all" ||
        (match.group || "Único") === group;

      return categoryOk && phaseOk && groupOk;
    });
  }, [finishedMatches, category, phase, group]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Resultados
          </h1>

          <p className="text-slate-500 mt-2">
            Consulta todos los partidos finalizados.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setGroup("all");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                Todas las categorías
              </SelectItem>

              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={phase}
            onValueChange={(value) => {
              setPhase(value);
              setGroup("all");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Fase" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                Todas las fases
              </SelectItem>

              <SelectItem value="groups">
                Fase de grupos
              </SelectItem>

              <SelectItem value="semifinal">
                Semifinal
              </SelectItem>

              <SelectItem value="final">
                Final
              </SelectItem>
            </SelectContent>
          </Select>

          {phase === "groups" && (
            <Select
              value={group}
              onValueChange={setGroup}
            >
              <SelectTrigger>
                <SelectValue placeholder="Grupo" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos los grupos
                </SelectItem>

                {groups.map((grp) => (
                  <SelectItem key={grp} value={grp}>
                    Grupo {grp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Cargando resultados...
          </div>
        ) : (
          <PublicMatchesTable
  matches={filteredMatches}
  teamsMap={teamsMap}
/>
        )}
      </div>
    </PublicLayout>
  );
}