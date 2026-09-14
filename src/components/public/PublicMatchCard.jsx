import {
  Clock3,
  MapPin,
  PlayCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";

import TeamIdentity from "@/components/shared/TeamIdentity";

export default function PublicMatchCard({
  match,
  homeLogo,
  awayLogo,
}) {
  function getStatus() {
    switch (match.status) {
      case "live":
        return {
          text: "EN DIRECTO",
          color: "bg-red-600 text-white animate-pulse",
          icon: <PlayCircle className="h-4 w-4" />,
        };

      case "finished":
        return {
          text: "FINALIZADO",
          color: "bg-green-600 text-white",
          icon: <CheckCircle2 className="h-4 w-4" />,
        };

      default:
        return {
          text: "PENDIENTE",
          color: "bg-yellow-400 text-slate-900",
          icon: <Circle className="h-4 w-4" />,
        };
    }
  }

  function phaseLabel() {
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";
    if (match.phase === "quarterfinal") return "Cuartos";
    return match.group ? `Grupo ${match.group}` : "Fase de grupos";
  }

  const status = getStatus();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all border overflow-hidden">
      <div className="bg-slate-50 border-b px-5 py-3 flex justify-between items-center gap-4">
        <div>
          <p className="font-semibold">{match.category}</p>

          <p className="text-xs text-green-700 font-semibold mt-1">
            {phaseLabel()}
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
            <div className="flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              {match.time}
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {match.courtName}
            </div>
          </div>
        </div>

        <div className={`${status.color} px-3 py-2 rounded-full flex items-center gap-2 text-xs font-bold`}>
          {status.icon}
          {status.text}
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <TeamIdentity
            name={match.homeTeamName}
            logo={homeLogo}
          />

          <span className="text-4xl font-black">
            {match.homeScore}
          </span>
        </div>

        <div className="border-t" />

        <div className="flex justify-between items-center">
          <TeamIdentity
            name={match.awayTeamName}
            logo={awayLogo}
          />

          <span className="text-4xl font-black">
            {match.awayScore}
          </span>
        </div>
      </div>
    </div>
  );
}