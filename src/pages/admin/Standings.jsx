import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  RotateCcw,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/layout/PageHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getStandings,
} from "@/services/standingsService";

import {
  deleteStandingsAdjustment,
  getStandingsAdjustments,
  saveStandingsAdjustment,
} from "@/services/standingsAdjustmentService";

const EMPTY_ADJUSTMENT = {
  playedAdjustment: 0,
  winsAdjustment: 0,
  lossesAdjustment: 0,
  pointsForAdjustment: 0,
  pointsAgainstAdjustment: 0,
  pointsAdjustment: 0,
  note: "",
};

function normalizeGroup(group) {
  if (!group) return "Único";

  const value = String(group).trim();

  return value.toLowerCase() === "unico"
    ? "Único"
    : value;
}

export default function Standings() {
  const [standings, setStandings] =
    useState([]);

  const [adjustments, setAdjustments] =
    useState([]);

  const [category, setCategory] =
    useState("");

  const [group, setGroup] =
    useState("");

  const [selectedTeam, setSelectedTeam] =
    useState(null);

  const [
    adjustmentForm,
    setAdjustmentForm,
  ] = useState(EMPTY_ADJUSTMENT);

  const [editOpen, setEditOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [
        standingsData,
        adjustmentsData,
      ] = await Promise.all([
        getStandings(),
        getStandingsAdjustments(),
      ]);

      setStandings(standingsData);
      setAdjustments(adjustmentsData);

      if (standingsData.length > 0) {
        const firstTable =
          standingsData[0];

        setCategory(
          firstTable.category
        );

        setGroup(
          normalizeGroup(
            firstTable.group
          )
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "No se pudieron cargar las clasificaciones."
      );
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return [
      ...new Set(
        standings
          .map(
            (table) =>
              table.category
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [standings]);

  const groups = useMemo(() => {
    return standings
      .filter(
        (table) =>
          table.category ===
          category
      )
      .map(
        (table) =>
          normalizeGroup(
            table.group
          )
      )
      .filter(
        (
          value,
          index,
          array
        ) =>
          array.indexOf(value) ===
          index
      )
      .sort();
  }, [standings, category]);

  useEffect(() => {
    if (!category) return;

    if (
      !groups.includes(group)
    ) {
      setGroup(
        groups[0] || ""
      );
    }
  }, [
    category,
    group,
    groups,
  ]);

  const selectedTable =
    useMemo(() => {
      return standings.find(
        (table) =>
          table.category ===
            category &&
          normalizeGroup(
            table.group
          ) ===
            normalizeGroup(
              group
            )
      );
    }, [
      standings,
      category,
      group,
    ]);

  function findAdjustment(
    teamId
  ) {
    return adjustments.find(
      (adjustment) =>
        adjustment.teamId ===
          teamId &&
        adjustment.category ===
          category &&
        normalizeGroup(
          adjustment.group
        ) ===
          normalizeGroup(
            group
          )
    );
  }

  function openEdit(team) {
    const existing =
      findAdjustment(
        team.id
      );

    setSelectedTeam(team);

    if (existing) {
      setAdjustmentForm({
        playedAdjustment:
          existing.playedAdjustment ||
          0,

        winsAdjustment:
          existing.winsAdjustment ||
          0,

        lossesAdjustment:
          existing.lossesAdjustment ||
          0,

        pointsForAdjustment:
          existing.pointsForAdjustment ||
          0,

        pointsAgainstAdjustment:
          existing.pointsAgainstAdjustment ||
          0,

        pointsAdjustment:
          existing.pointsAdjustment ||
          0,

        note:
          existing.note || "",
      });
    } else {
      setAdjustmentForm(
        EMPTY_ADJUSTMENT
      );
    }

    setEditOpen(true);
  }

  function updateForm(
    field,
    value
  ) {
    setAdjustmentForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  async function handleSave() {
    if (!selectedTeam) return;

    setSaving(true);

    try {
      await saveStandingsAdjustment({
        teamId:
          selectedTeam.id,

        teamName:
          selectedTeam.name,

        category,
        group,

        playedAdjustment:
          Number(
            adjustmentForm.playedAdjustment
          ),

        winsAdjustment:
          Number(
            adjustmentForm.winsAdjustment
          ),

        lossesAdjustment:
          Number(
            adjustmentForm.lossesAdjustment
          ),

        pointsForAdjustment:
          Number(
            adjustmentForm.pointsForAdjustment
          ),

        pointsAgainstAdjustment:
          Number(
            adjustmentForm.pointsAgainstAdjustment
          ),

        pointsAdjustment:
          Number(
            adjustmentForm.pointsAdjustment
          ),

        note:
          adjustmentForm.note,
      });

      setEditOpen(false);
      setSelectedTeam(null);

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo guardar el ajuste."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!selectedTeam) return;

    const confirmed =
      window.confirm(
        `¿Quitar los ajustes manuales de "${selectedTeam.name}"?`
      );

    if (!confirmed) return;

    setSaving(true);

    try {
      await deleteStandingsAdjustment(
        selectedTeam.id,
        category,
        group
      );

      setEditOpen(false);
      setSelectedTeam(null);

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo eliminar el ajuste."
      );
    } finally {
      setSaving(false);
    }
  }

  function differenceLabel(
    value
  ) {
    return value > 0
      ? `+${value}`
      : value;
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Clasificaciones"
        description="Consulta y corrige manualmente la clasificación."
      />

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div>
          <Label className="mb-2 block">
            Categoría
          </Label>

          <Select
            value={category}
            onValueChange={(
              value
            ) => {
              setCategory(
                value
              );

              setGroup("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>

            <SelectContent>
              {categories.map(
                (item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">
            Grupo
          </Label>

          <Select
            value={group}
            onValueChange={
              setGroup
            }
            disabled={!category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Grupo" />
            </SelectTrigger>

            <SelectContent>
              {groups.map(
                (item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item ===
                    "Único"
                      ? "Grupo único"
                      : `Grupo ${item}`}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          Cargando clasificación...
        </div>
      ) : !selectedTable ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
          No hay clasificación disponible.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-4 text-left">
                  #
                </th>

                <th className="px-4 py-4 text-left">
                  Equipo
                </th>

                <th className="px-3 py-4 text-center">
                  PJ
                </th>

                <th className="px-3 py-4 text-center">
                  PG
                </th>

                <th className="px-3 py-4 text-center">
                  PP
                </th>

                <th className="px-3 py-4 text-center">
                  PF
                </th>

                <th className="px-3 py-4 text-center">
                  PC
                </th>

                <th className="px-3 py-4 text-center">
                  DIF
                </th>

                <th className="px-3 py-4 text-center">
                  PTS
                </th>

                <th className="px-4 py-4 text-center">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {selectedTable.teams.map(
                (team, index) => (
                  <tr
                    key={team.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-bold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="h-10 w-10 rounded-full border object-contain bg-white"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                            {team.name?.charAt(
                              0
                            )}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold">
                            {team.name}
                          </p>

                          {team.hasManualAdjustment && (
                            <p className="text-xs text-orange-600">
                              Ajuste manual
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-center">
                      {team.played}
                    </td>

                    <td className="px-3 py-4 text-center">
                      {team.wins}
                    </td>

                    <td className="px-3 py-4 text-center">
                      {team.losses}
                    </td>

                    <td className="px-3 py-4 text-center">
                      {team.pointsFor}
                    </td>

                    <td className="px-3 py-4 text-center">
                      {team.pointsAgainst}
                    </td>

                    <td className="px-3 py-4 text-center">
                      {differenceLabel(
                        team.difference
                      )}
                    </td>

                    <td className="px-3 py-4 text-center font-black text-green-700">
                      {team.points}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          openEdit(
                            team
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={editOpen}
        onOpenChange={
          setEditOpen
        }
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Ajustar clasificación
            </DialogTitle>
          </DialogHeader>

          {selectedTeam && (
            <div className="space-y-5">
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">
                  {category} ·{" "}
                  {group ===
                  "Único"
                    ? "Grupo único"
                    : `Grupo ${group}`}
                </p>

                <p className="text-xl font-bold mt-1">
                  {selectedTeam.name}
                </p>
              </div>

              <p className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                Introduce la cantidad
                que quieres sumar o
                restar. Por ejemplo,
                para quitar un punto,
                escribe -1.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <AdjustmentInput
                  label="PJ"
                  value={
                    adjustmentForm.playedAdjustment
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "playedAdjustment",
                      value
                    )
                  }
                />

                <AdjustmentInput
                  label="PG"
                  value={
                    adjustmentForm.winsAdjustment
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "winsAdjustment",
                      value
                    )
                  }
                />

                <AdjustmentInput
                  label="PP"
                  value={
                    adjustmentForm.lossesAdjustment
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "lossesAdjustment",
                      value
                    )
                  }
                />

                <AdjustmentInput
                  label="PF"
                  value={
                    adjustmentForm.pointsForAdjustment
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "pointsForAdjustment",
                      value
                    )
                  }
                />

                <AdjustmentInput
                  label="PC"
                  value={
                    adjustmentForm.pointsAgainstAdjustment
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "pointsAgainstAdjustment",
                      value
                    )
                  }
                />

                <AdjustmentInput
                  label="PTS"
                  value={
                    adjustmentForm.pointsAdjustment
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "pointsAdjustment",
                      value
                    )
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  Motivo
                </Label>

                <textarea
                  value={
                    adjustmentForm.note
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "note",
                      event.target.value
                    )
                  }
                  className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Sanción, corrección, incomparecencia..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              variant="destructive"
              onClick={
                handleReset
              }
              disabled={
                saving ||
                !selectedTeam ||
                !findAdjustment(
                  selectedTeam?.id
                )
              }
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Quitar ajuste
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setEditOpen(
                    false
                  )
                }
              >
                Cancelar
              </Button>

              <Button
                onClick={
                  handleSave
                }
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : "Guardar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function AdjustmentInput({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <Label className="mb-2 block">
        {label}
      </Label>

      <Input
        type="number"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </div>
  );
}