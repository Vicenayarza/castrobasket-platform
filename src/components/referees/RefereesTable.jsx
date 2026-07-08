import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RefereesTable({
  referees,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Nombre
            </th>

            <th className="px-6 py-4 text-center">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {referees.length === 0 ? (

            <tr>

              <td
                colSpan={2}
                className="py-10 text-center text-slate-500"
              >

                No hay árbitros registrados.

              </td>

            </tr>

          ) : (

            referees.map((referee) => (

              <tr
                key={referee.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  {referee.name}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-2">

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(referee)}
                    >
                      <Pencil className="h-4 w-4"/>
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(referee)}
                    >
                      <Trash2 className="h-4 w-4"/>
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