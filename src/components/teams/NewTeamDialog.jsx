import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  createTeam,
  uploadTeamLogo,
} from "@/services/teamService";

import { getCategories } from "@/services/categoryService";

export default function NewTeamDialog({ onTeamCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [club, setClub] = useState("");
  const [category, setCategory] = useState("");
  const [group, setGroup] = useState("");

  const [logoFile, setLogoFile] = useState(null);

  const [playersText, setPlayersText] = useState("");

  useEffect(() => {
    if (!open) return;

    async function load() {
      const data = await getCategories();
      setCategories(data);
    }

    load();
  }, [open]);

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.name === category);
  }, [categories, category]);

  const groups = selectedCategory?.groups || [];

  useEffect(() => {
    if (groups.length === 1) {
      setGroup(groups[0]);
    } else {
      setGroup("");
    }
  }, [category]);

  async function handleSave() {
    if (!name || !club || !category || !group) {
      alert("Completa nombre, club, categoría y grupo.");
      return;
    }

    setLoading(true);

    try {
      let logoUrl = "";

      if (logoFile) {
        logoUrl = await uploadTeamLogo(logoFile);
      }

      const players = playersText
        .split("\n")
        .map((player) => player.trim())
        .filter((player) => player !== "");

      await createTeam({
        name,
        club,
        category,
        group,
        logo: logoUrl,
        players,
      });

      setName("");
      setClub("");
      setCategory("");
      setGroup("");
      setLogoFile(null);
      setPlayersText("");

      setOpen(false);
      onTeamCreated?.();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el equipo.");
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          + Nuevo equipo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Nuevo equipo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nombre del equipo</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Club</Label>
            <Input
              value={club}
              onChange={(e) => setClub(e.target.value)}
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.name}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div>
              <Label>Grupo</Label>
              <Select
                value={group}
                onValueChange={setGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>

                <SelectContent>
                  {groups.map((grp) => (
                    <SelectItem
                      key={grp}
                      value={grp}
                    >
                      Grupo {grp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Logo del equipo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
          </div>

          <div>
            <Label>Jugadores</Label>
            <textarea
              className="w-full min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder={`Escribe un jugador por línea:\nVicen Ayarza\nAimar\nIbai`}
              value={playersText}
              onChange={(e) => setPlayersText(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar equipo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}