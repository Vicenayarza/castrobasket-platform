import { useEffect, useMemo, useState } from "react";

import PublicLayout from "@/components/layout/PublicLayout";
import StandingsCard from "@/components/public/StandingsCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getStandings } from "@/services/standingsService";

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await getStandings();

      setStandings(data);

      if (data.length > 0) {
        setCategory(data[0].category);
        setGroup(data[0].group);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const categories = useMemo(() => {
    return [...new Set(standings.map((item) => item.category))].sort();
  }, [standings]);

  const groups = useMemo(() => {
    return standings
      .filter((item) => item.category === category)
      .map((item) => item.group)
      .sort();
  }, [standings, category]);

  useEffect(() => {
    if (!category) return;

    const availableGroups = standings
      .filter((item) => item.category === category)
      .map((item) => item.group);

    if (!availableGroups.includes(group)) {
      setGroup(availableGroups[0] || "");
    }
  }, [category, standings]);

  const selectedTable = standings.find(
    (item) => item.category === category && item.group === group
  );

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Clasificaciones
          </h1>

          <p className="text-slate-500 mt-2">
            Consulta la clasificación por categoría y grupo.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            Cargando clasificaciones...
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>

                <SelectContent>
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
                  {groups.map((grp) => (
                    <SelectItem key={grp} value={grp}>
                      Grupo {grp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <StandingsCard
              category={`${category} · Grupo ${group}`}
              teams={selectedTable?.teams || []}
            />
          </>
        )}
      </div>
    </PublicLayout>
  );
}