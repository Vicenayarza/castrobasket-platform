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

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [teamsMap, setTeamsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");
  const [phase, setPhase] = useState("all");
  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState("all");

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

      matchesData.sort((a, b) =>
        (a.time || "").localeCompare(b.time || "")
      );

      const map = {};

      teamsData.forEach((team) => {
        map[team.id] = team;
      });

      setMatches(matchesData);
      setTeamsMap(map);
    } catch (error) {
      console.error("Error cargando partidos:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return [
      ...new Set(
        matches
          .map((match) => match.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [matches]);

  const groups = useMemo(() => {
    return [
      ...new Set(
        matches
          .filter(
            (match) =>
              category === "all" ||
              match.category === category
          )
          .filter(
            (match) =>
              match.phase === "groups"
          )
          .map(
            (match) =>
              match.group || "Único"
          )
      ),
    ].sort();
  }, [matches, category]);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
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

      const statusOk =
        status === "all" ||
        match.status === status;

      return (
        categoryOk &&
        phaseOk &&
        groupOk &&
        statusOk
      );
    });
  }, [
    matches,
    category,
    phase,
    group,
    status,
  ]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Partidos
          </h1>

          <p className="text-slate-500 mt-2">
            Consulta todos los partidos del torneo.
          </p>
        </div>

        <div
          className={`grid gap-4 mb-8 ${
            phase === "groups"
              ? "md:grid-cols-4"
              : "md:grid-cols-3"
          }`}
        >
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
                <SelectItem
                  key={cat}
                  value={cat}
                >
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

              <SelectItem value="quarterfinal">
                Cuartos de final
              </SelectItem>

              <SelectItem value="semifinal">
                Semifinales
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
                  <SelectItem
                    key={grp}
                    value={grp}
                  >
                    {grp === "Único"
                      ? "Grupo único"
                      : `Grupo ${grp}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                Todos los estados
              </SelectItem>

              <SelectItem value="pending">
                Pendientes
              </SelectItem>

              <SelectItem value="live">
                En juego
              </SelectItem>

              <SelectItem value="finished">
                Finalizados
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Cargando partidos...
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