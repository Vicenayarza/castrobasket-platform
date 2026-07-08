import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}) {

  return (

    <div className="overflow-hidden rounded-2xl border bg-white shadow">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-4 text-left">
              Categoría
            </th>

            <th className="px-5 py-4 text-left">
              Grupos
            </th>

            <th className="px-5 py-4 text-center">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {

            categories.length === 0 ?

            (

              <tr>

                <td
                  colSpan={3}
                  className="py-10 text-center text-slate-500"
                >

                  No hay categorías.

                </td>

              </tr>

            )

            :

            categories.map((category) => (

              <tr
                key={category.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-5 py-4 font-semibold">

                  {category.name}

                </td>

                <td className="px-5 py-4">

                  {category.groups?.join(" · ")}

                </td>

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(category)}
                    >

                      <Pencil className="h-4 w-4"/>

                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onDelete(category)}
                    >

                      <Trash2 className="h-4 w-4"/>

                    </Button>

                  </div>

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </div>

  );

}