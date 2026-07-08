import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function TeamsTable({
  teams,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">

        <h2 className="text-lg font-semibold">
          Equipos inscritos
        </h2>

        <span className="text-sm text-slate-500">
          {teams.length} equipos
        </span>

      </div>

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Equipo
            </th>

            <th className="px-6 py-4 text-left">
              Club
            </th>

            <th className="px-6 py-4 text-left">
              Categoría
            </th>

            <th className="px-6 py-4 text-center">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {teams.map((team) => (

            <tr
              key={team.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5 font-medium">
                <div className="flex items-center gap-3">

                  <div className="w-3 h-3 rounded-full bg-green-600"/>

                  <span>

                    {team.name}

                  </span>

                </div>
              </td>

              <td className="px-6 py-5">

                {team.club}

              </td>

              <td className="px-6 py-5">

                {team.category}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-2">

                  <Button
                  
                    size="icon"
                    variant="ghpst"
                    onClick={() => onEdit(team)}
                  >
                    <Pencil size={18} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDelete(team)}
                  >
                    <Trash2 size={18} />
                  </Button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}