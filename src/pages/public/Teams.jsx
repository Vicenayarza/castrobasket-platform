import { useEffect, useMemo, useState } from "react";

import PublicLayout from "@/components/layout/PublicLayout";
import PublicTeamCard from "@/components/public/PublicTeamCard";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { getTeams } from "@/services/teamService";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");
  const [group, setGroup] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const data = await getTeams();

    data.sort((a, b) => a.name.localeCompare(b.name));

    setTeams(data);
    setLoading(false);
  }

  const categories = useMemo(() => {
    return [
      ...new Set(
        teams.map((team) => team.category).filter(Boolean)
      ),
    ].sort();
  }, [teams]);

  const groups = useMemo(() => {
    return [
      ...new Set(
        teams
          .filter((team) => category === "all" || team.category === category)
          .map((team) => team.group || "Único")
      ),
    ].sort();
  }, [teams, category]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const categoryOk =
        category === "all" || team.category === category;

      const groupOk =
        group === "all" || (team.group || "Único") === group;

      return categoryOk && groupOk;
    });
  }, [teams, category, group]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Equipos</h1>

          <p className="text-slate-500 mt-2">
            Consulta todos los equipos participantes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
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

          <Select value={group} onValueChange={setGroup}>
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
        </div>

        {loading ? (
          <div className="text-center py-20">
            Cargando equipos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <PublicTeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}