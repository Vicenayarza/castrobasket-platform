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

import { updateReferee } from "@/services/refereeService";

export default function EditRefereeDialog({
  referee,
  open,
  onOpenChange,
  onUpdated,
}) {

  const [name, setName] = useState("");

  useEffect(() => {

    if (referee) {

      setName(referee.name);

    }

  }, [referee]);

  async function save() {

    await updateReferee(referee.id, {

      name,

    });

    onUpdated();

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

            Editar árbitro

          </DialogTitle>

        </DialogHeader>

        <Input
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

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