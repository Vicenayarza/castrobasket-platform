import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/layout/PageHeader";

import { Button } from "@/components/ui/button";

import UsersTable from "@/components/users/UsersTable";
import NewUserDialog from "@/components/users/NewUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";

import {
  getUsers,
  deleteUser,
  toggleUser,
} from "@/services/userService";

export default function Users() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {

    loadUsers();

  }, []);

  async function loadUsers() {

    setLoading(true);

    const data = await getUsers();

    data.sort((a,b)=>a.name.localeCompare(b.name));

    setUsers(data);

    setLoading(false);

  }

  async function remove(user) {

    if(!confirm("¿Eliminar usuario?")) return;

    await deleteUser(user.id);

    loadUsers();

  }

  async function toggle(user){

    await toggleUser(
      user.id,
      !user.active
    );

    loadUsers();

  }

  function edit(user){

    setSelectedUser(user);

    setEditDialogOpen(true);

  }

  return(

    <AdminLayout>

      <PageHeader

        title="Usuarios"

        description="Administradores y árbitros"

        action={

          <Button
            onClick={()=>setNewDialogOpen(true)}
          >

            Nuevo usuario

          </Button>

        }

      />

      {

        loading ?

        (

          <div className="py-10 text-center">

            Cargando...

          </div>

        )

        :

        (

          <UsersTable

            users={users}

            onEdit={edit}

            onDelete={remove}

            onToggle={toggle}

          />

        )

      }

      <NewUserDialog

        open={newDialogOpen}

        onOpenChange={setNewDialogOpen}

        onCreated={loadUsers}

      />

      <EditUserDialog

        open={editDialogOpen}

        onOpenChange={setEditDialogOpen}

        user={selectedUser}

        onUpdated={loadUsers}

      />

    </AdminLayout>

  );

}