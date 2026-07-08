import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/layout/PageHeader";

import SearchBar from "@/components/common/SearchBar";
import DeleteDialog from "@/components/common/DeleteDialog";

import NewTeamDialog from "@/components/teams/NewTeamDialog";
import EditTeamDialog from "@/components/teams/EditTeamDialog";
import TeamsTable from "@/components/teams/TeamsTable";

import {
  getTeams,
  deleteTeam,
} from "@/services/teamService";

export default function Teams() {

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {

    setLoading(true);

    try {

      const data = await getTeams();

      setTeams(data);

    } catch (error) {

      console.error(error);

    }

    setLoading(false);

  }

  function handleEdit(team) {

    setSelectedTeam(team);

    setEditOpen(true);

  }

  function handleDelete(team) {

    setSelectedTeam(team);

    setDeleteOpen(true);

  }

  async function confirmDelete() {

    if (!selectedTeam) return;

    await deleteTeam(selectedTeam.id);

    setDeleteOpen(false);

    setSelectedTeam(null);

    loadTeams();

  }

  const filteredTeams = teams.filter((team) => {

    const text = search.toLowerCase();

    return (

      team.name.toLowerCase().includes(text) ||

      team.club.toLowerCase().includes(text) ||

      team.category.toLowerCase().includes(text)

    );

  });

  return (

    <AdminLayout>

      <PageHeader
    title="Equipos"
    description="Gestiona todos los equipos inscritos"

    action={
        <NewTeamDialog
            onTeamCreated={loadTeams}
        />
    }
/>

      <div className="mb-6">

        <SearchBar

          placeholder="Buscar equipo..."

          value={search}

          onChange={setSearch}

        />

      </div>

      {

        loading ?

        (

          <div className="py-16 text-center">

            Cargando equipos...

          </div>

        )

        :

        (

          <TeamsTable

            teams={filteredTeams}

            onEdit={handleEdit}

            onDelete={handleDelete}

          />

        )

      }

      <EditTeamDialog

        open={editOpen}

        onOpenChange={setEditOpen}

        team={selectedTeam}

        onUpdated={loadTeams}

      />

      <DeleteDialog

        open={deleteOpen}

        onOpenChange={setDeleteOpen}

        title="Eliminar equipo"

        description={`¿Seguro que deseas eliminar "${selectedTeam?.name}"? Esta acción no se puede deshacer.`}

        onConfirm={confirmDelete}

      />

    </AdminLayout>

  );

}