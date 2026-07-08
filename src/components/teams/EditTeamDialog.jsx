import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { updateTeamData } from "@/services/teamService";
import { getCategories } from "@/services/categoryService";

export default function EditTeamDialog({
  open,
  onOpenChange,
  team,
  onUpdated,
}) {

  const [name, setName] = useState("");
  const [club, setClub] = useState("");
  const [category, setCategory] = useState("");
  const [group, setGroup] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {

    async function loadCategories() {

      try {

        const data = await getCategories();

        setCategories(data);

      } catch (e) {

        console.error(e);

      }

    }

    loadCategories();

  }, []);

  useEffect(() => {

    if (!team) return;

    setName(team.name || "");
    setClub(team.club || "");
    setCategory(team.category || "");
    setGroup(team.group || "");

  }, [team]);

  const selectedCategory = useMemo(() => {

    return categories.find(
      (c) => c.name === category
    );

  }, [categories, category]);

  const groups = selectedCategory?.groups || [];

  useEffect(() => {

    if (!category) return;

    if (groups.length === 1) {

      setGroup(groups[0]);

    } else {

      if (!groups.includes(group)) {

        setGroup("");

      }

    }

  }, [category, categories]);

  async function save() {

    if (!name || !club || !category || !group) {

      alert("Completa todos los campos.");

      return;

    }

    await updateTeamData(team.id, {

      name,
      club,
      category,
      group,

    });

    onUpdated();

    onOpenChange(false);

  }

  if (!team) return null;

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            Editar equipo

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div>

            <Label>Nombre</Label>

            <Input
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

          </div>

          <div>

            <Label>Club</Label>

            <Input
              value={club}
              onChange={(e)=>setClub(e.target.value)}
            />

          </div>

          <div>

            <Label>Categoría</Label>

            <Select
              value={category}
              onValueChange={setCategory}
            >

              <SelectTrigger>

                <SelectValue/>

              </SelectTrigger>

              <SelectContent>

                {

                  categories.map((category)=>(

                    <SelectItem
                      key={category.id}
                      value={category.name}
                    >

                      {category.name}

                    </SelectItem>

                  ))

                }

              </SelectContent>

            </Select>

          </div>

          {

            category && (

              <div>

                <Label>Grupo</Label>

                <Select
                  value={group}
                  onValueChange={setGroup}
                >

                  <SelectTrigger>

                    <SelectValue placeholder="Selecciona un grupo"/>

                  </SelectTrigger>

                  <SelectContent>

                    {

                      groups.map((group)=>(

                        <SelectItem
                          key={group}
                          value={group}
                        >

                          {group}

                        </SelectItem>

                      ))

                    }

                  </SelectContent>

                </Select>

              </div>

            )

          }

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={()=>onOpenChange(false)}
          >

            Cancelar

          </Button>

          <Button
            onClick={save}
          >

            Guardar

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}