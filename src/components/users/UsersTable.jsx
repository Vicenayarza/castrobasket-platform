import {
  Pencil,
  Trash2,
  Power,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UsersTable({

  users,

  onEdit,

  onDelete,

  onToggle,

}) {

  return (

    <div className="overflow-hidden rounded-2xl border bg-white shadow">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-4 text-left">
              Nombre
            </th>

            <th className="px-5 py-4 text-left">
              Usuario
            </th>

            <th className="px-5 py-4 text-left">
              Rol
            </th>

            <th className="px-5 py-4 text-center">
              Estado
            </th>

            <th className="px-5 py-4 text-center">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {

            users.length===0 ?

            (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center text-slate-500"
                >

                  No hay usuarios.

                </td>

              </tr>

            )

            :

            users.map(user=>(

              <tr
                key={user.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-5 py-4 font-semibold">

                  {user.name}

                </td>

                <td className="px-5 py-4">

                  {user.username}

                </td>

                <td className="px-5 py-4">

                  {user.role==="admin"
                    ? "Administrador"
                    : "Árbitro"}

                </td>

                <td className="px-5 py-4 text-center">

                  {

                    user.active ?

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                      Activo

                    </span>

                    :

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                      Inactivo

                    </span>

                  }

                </td>

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={()=>onEdit(user)}
                    >

                      <Pencil className="h-4 w-4"/>

                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={()=>onToggle(user)}
                    >

                      <Power className="h-4 w-4"/>

                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={()=>onDelete(user)}
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