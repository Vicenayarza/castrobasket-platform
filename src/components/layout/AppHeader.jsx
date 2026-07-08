import { Bell, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">

      {/* Título */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Bienvenido al panel de control del torneo
        </p>
      </div>

      {/* Acciones */}

      <div className="flex items-center gap-3">

        <Button variant="outline" size="icon">
          <Search size={18} />
        </Button>

        <Button variant="outline" size="icon">
          <Bell size={18} />
        </Button>

        <Button variant="outline" size="icon">
          <Settings size={18} />
        </Button>

        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-green-600 text-white font-bold">
            VA
          </AvatarFallback>
        </Avatar>

      </div>

    </header>
  );
}