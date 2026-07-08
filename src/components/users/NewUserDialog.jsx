import { useState } from "react";

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

import { createUser } from "@/services/userService";

export default function NewUserDialog({

  open,

  onOpenChange,

  onCreated,

}) {

  const [name,setName]=useState("");

  const [username,setUsername]=useState("");

  const [email,setEmail]=useState("");

  const [password,setPassword]=useState("");

  const [role,setRole]=useState("referee");

  async function save(){

    if(
      !name ||
      !username ||
      !email ||
      !password
    ){

      alert("Completa todos los campos.");

      return;

    }

    await createUser({

      name,

      username,

      email,

      password,

      role,

      active:true,

    });

    setName("");

    setUsername("");

    setEmail("");

    setPassword("");

    setRole("referee");

    onCreated();

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

            Nuevo usuario

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Nombre"
            value={name}
            onChange={e=>setName(e.target.value)}
          />

          <Input
            placeholder="Usuario"
            value={username}
            onChange={e=>setUsername(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e=>setPassword(e.target.value)}
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

            Crear usuario

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}