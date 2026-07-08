import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createReferee } from "@/services/refereeService";

export default function NewRefereeDialog({
  open,
  onOpenChange,
  onCreated,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  async function save() {
    if (name.trim() === "") return;

    await createReferee({
      name,
    });

    onCreated();

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            Nuevo árbitro

          </DialogTitle>

        </DialogHeader>

        <Input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button onClick={save}>
            Guardar
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}