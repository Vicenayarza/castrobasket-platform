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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { updateUser } from "@/services/userService";

export default function EditUserDialog({

  open,
  onOpenChange,
  user,
  onUpdated,

}) {

  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [role,setRole]=useState("referee");

  useEffect(()=>{

    if(!user) return;

    setName(user.name);
    setUsername(user.username);
    setRole(user.role);

  },[user]);

  async function save(){

    if(!name || !username){

      alert("Completa todos los campos.");

      return;

    }

    await updateUser(user.id,{

      name,

      username,

      role,

    });

    onUpdated();

    onOpenChange(false);

  }

  return(

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            Editar usuario

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <Input
            placeholder="Usuario"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <Select
            value={role}
            onValueChange={setRole}
          >

            <SelectTrigger>

              <SelectValue/>

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="admin">

                Administrador

              </SelectItem>

              <SelectItem value="referee">

                Árbitro

              </SelectItem>

            </SelectContent>

          </Select>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={()=>onOpenChange(false)}
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