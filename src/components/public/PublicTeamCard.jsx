import { Link } from "react-router-dom";
import TeamIdentity from "@/components/shared/TeamIdentity";

export default function PublicTeamCard({ team }) {
  return (
    <Link to={`/teams/${team.id}`}>
      <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all border p-6">
        <div className="flex justify-between items-start gap-4">
          <TeamIdentity
            name={team.name}
            logo={team.logo}
            size="lg"
          />

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            Grupo {team.group || "Único"}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase text-slate-400">Categoría</p>
          <p className="font-medium">{team.category}</p>
        </div>
      </div>
    </Link>
  );
}