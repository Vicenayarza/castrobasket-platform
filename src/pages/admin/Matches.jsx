import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/layout/PageHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlayoffsDialog from "@/components/matches/PlayoffsDialog";

import MatchesTable from "@/components/matches/MatchesTable";
import NewMatchDialog from "@/components/matches/NewMatchDialog";
import EditMatchDialog from "@/components/matches/EditMatchDialog";

import {
  getMatches,
  deleteMatch,
  updateMatchStatus,
} from "@/services/matchService";

export default function Matches() {

  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {

    loadData();

  }, []);

  useEffect(() => {

    filterMatches();

  }, [search, matches]);

  async function loadData() {

    setLoading(true);

    try {

      const data = await getMatches();

      data.sort((a, b) => a.time.localeCompare(b.time));

      setMatches(data);

    } catch (e) {

      console.error(e);

    }

    setLoading(false);

  }

  function filterMatches() {

    if (!search) {

      setFilteredMatches(matches);

      return;

    }

    const text = search.toLowerCase();

    setFilteredMatches(

      matches.filter((match) =>

        match.homeTeamName?.toLowerCase().includes(text) ||

        match.awayTeamName?.toLowerCase().includes(text) ||

        match.category?.toLowerCase().includes(text) ||

        match.refereeName?.toLowerCase().includes(text) ||

        match.courtName?.toLowerCase().includes(text)

      )

    );

  }

  async function remove(match) {

    if (!confirm("¿Eliminar partido?")) return;

    await deleteMatch(match.id);

    loadData();

  }

  function edit(match) {

    setSelectedMatch(match);

    setEditDialogOpen(true);

  }
  async function start(match) {

  await updateMatchStatus(
    match.id,
    "live"
  );

  loadData();

}

async function finish(match) {

  await updateMatchStatus(
    match.id,
    "finished"
  );

  loadData();

}

  return (

    <AdminLayout>

      <PageHeader

        title="Partidos"

        description="Gestión de partidos"

        action={
  <div className="flex gap-3">
    <PlayoffsDialog onGenerated={loadData} />

    <Button onClick={() => setNewDialogOpen(true)}>
      Nuevo partido
    </Button>
  </div>
}

      />

      <div className="mb-6">

        <Input

          placeholder="Buscar partido..."

          value={search}

          onChange={(e) => setSearch(e.target.value)}

        />

      </div>

      {

        loading ?

        (

          <div className="py-10 text-center">

            Cargando partidos...

          </div>

        )

        :

        (

          <MatchesTable

    matches={filteredMatches}

    onDelete={remove}

    onEdit={edit}

    onStart={start}

    onFinish={finish}

/>

        )

      }

      <NewMatchDialog

        open={newDialogOpen}

        onOpenChange={setNewDialogOpen}

        onCreated={loadData}

      />

      <EditMatchDialog

        open={editDialogOpen}

        onOpenChange={setEditDialogOpen}

        match={selectedMatch}

        onUpdated={loadData}

      />

    </AdminLayout>

  );

}