import { Button } from "@/components/ui/button";

import {
  Pencil,
  Trash2,
  Play,
  Flag,
} from "lucide-react";

export default function MatchesTable({
  matches,
  onEdit,
  onDelete,
  onStart,
  onFinish,
}) {
  function statusBadge(status) {
    switch (status) {
      case "pending":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Pendiente
          </span>
        );

      case "live":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            En juego
          </span>
        );

      case "finished":
        return (
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            Finalizado
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
            {status}
          </span>
        );
    }
  }

  function phaseLabel(match) {
    if (match.phase === "semifinal") return "Semifinal";
    if (match.phase === "final") return "Final";
    if (match.phase === "quarterfinal") return "Cuartos";

    if (match.group) return `Grupo ${match.group}`;

    return "Grupos";
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-5 py-4 text-left">Hora</th>
            <th className="px-5 py-4 text-left">Campo</th>
            <th className="px-5 py-4 text-left">Categoría</th>
            <th className="px-5 py-4 text-left">Fase</th>
            <th className="px-5 py-4 text-left">Local</th>
            <th className="px-5 py-4 text-center">Resultado</th>
            <th className="px-5 py-4 text-left">Visitante</th>
            <th className="px-5 py-4 text-left">Árbitro</th>
            <th className="px-5 py-4 text-center">Estado</th>
            <th className="px-5 py-4 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {matches.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                className="py-10 text-center text-slate-500"
              >
                No hay partidos creados.
              </td>
            </tr>
          ) : (
            matches.map((match) => (
              <tr
                key={match.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-5 py-4">{match.time}</td>

                <td className="px-5 py-4">{match.courtName}</td>

                <td className="px-5 py-4">{match.category}</td>

                <td className="px-5 py-4">{phaseLabel(match)}</td>

                <td className="px-5 py-4 font-semibold">
                  {match.homeTeamName}
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="font-bold text-lg">
                    {match.homeScore}
                  </span>

                  <span className="mx-2 text-slate-400">:</span>

                  <span className="font-bold text-lg">
                    {match.awayScore}
                  </span>
                </td>

                <td className="px-5 py-4 font-semibold">
                  {match.awayTeamName}
                </td>

                <td className="px-5 py-4">{match.refereeName}</td>

                <td className="px-5 py-4 text-center">
                  {statusBadge(match.status)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(match)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {match.status === "pending" && (
                      <Button
                        size="icon"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onStart(match)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    {match.status === "live" && (
                      <Button
                        size="icon"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => onFinish(match)}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onDelete(match)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}