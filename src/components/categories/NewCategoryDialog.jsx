import { useState } from "react";

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

import { Plus, Trash2 } from "lucide-react";

import { createCategory } from "@/services/categoryService";

export default function NewCategoryDialog({ onCreated }) {

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [groups, setGroups] = useState(["Único"]);

  const [loading, setLoading] = useState(false);

  function updateGroup(index, value) {

    const copy = [...groups];

    copy[index] = value;

    setGroups(copy);

  }

  function addGroup() {

    setGroups([...groups, ""]);

  }

  function removeGroup(index) {

    const copy = groups.filter((_, i) => i !== index);

    setGroups(copy.length ? copy : [""]);

  }

  async function handleSave() {

    if (!name.trim()) {

      alert("Introduce un nombre.");

      return;

    }

    const cleanGroups = groups
      .map(g => g.trim())
      .filter(g => g !== "");

    if (cleanGroups.length === 0) {

      alert("Añade al menos un grupo.");

      return;

    }

    setLoading(true);

    try {

      await createCategory({

        name,

        groups: cleanGroups,

      });

      setName("");

      setGroups(["Único"]);

      setOpen(false);

      onCreated?.();

    } catch (e) {

      console.error(e);

      alert("Error al crear la categoría.");

    }

    setLoading(false);

  }

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>

        <Button>

          + Nueva categoría

        </Button>

      </DialogTrigger>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            Nueva categoría

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
                type="button"
                size="sm"
                variant="outline"
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
                      placeholder="Ej. A"
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
            onClick={handleSave}
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