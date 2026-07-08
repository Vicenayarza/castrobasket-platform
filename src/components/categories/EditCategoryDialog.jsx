import { useEffect, useState } from "react";

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

import { Plus, Trash2 } from "lucide-react";

import { updateCategory } from "@/services/categoryService";

export default function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onUpdated,
}) {

  const [name, setName] = useState("");
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (category) {

      setName(category.name);

      setGroups(category.groups || []);

    }

  }, [category]);

  function updateGroup(index, value) {

    const copy = [...groups];

    copy[index] = value;

    setGroups(copy);

  }

  function addGroup() {

    const letters = ["A", "B", "C", "D", "E", "F"];

    const used = groups.filter(g => g !== "Único");

    if (groups.includes("Único")) {

      setGroups(["A"]);

      return;

    }

    if (used.length >= letters.length) return;

    setGroups([...groups, letters[used.length]]);

  }

  function removeGroup(index) {

    const copy = groups.filter((_, i) => i !== index);

    setGroups(copy.length ? copy : ["Único"]);

  }

  async function save() {

    const cleanGroups = groups
      .map(g => g.trim())
      .filter(g => g !== "");

    if (!name.trim()) {

      alert("Introduce un nombre.");

      return;

    }

    if (cleanGroups.length === 0) {

      alert("Añade al menos un grupo.");

      return;

    }

    setLoading(true);

    try {

      await updateCategory(category.id, {

        name,

        groups: cleanGroups,

      });

      onUpdated();

      onOpenChange(false);

    } catch (e) {

      console.error(e);

      alert("Error al actualizar.");

    }

    setLoading(false);

  }

  if (!category) return null;

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            Editar categoría

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          <div>

            <Label>Nombre</Label>

            <Input
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

          </div>

          <div>

            <div className="flex justify-between items-center mb-3">

              <Label>Grupos</Label>

              <Button
                variant="outline"
                size="sm"
                onClick={addGroup}
              >

                <Plus className="h-4 w-4 mr-2"/>

                Añadir grupo

              </Button>

            </div>

            <div className="space-y-2">

              {

                groups.map((group,index)=>(

                  <div
                    key={index}
                    className="flex gap-2"
                  >

                    <Input
                      value={group}
                      onChange={(e)=>updateGroup(index,e.target.value)}
                    />

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={()=>removeGroup(index)}
                    >

                      <Trash2 className="h-4 w-4"/>

                    </Button>

                  </div>

                ))

              }

            </div>

          </div>

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
            disabled={loading}
          >

            {

              loading

              ? "Guardando..."

              : "Guardar"

            }

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}