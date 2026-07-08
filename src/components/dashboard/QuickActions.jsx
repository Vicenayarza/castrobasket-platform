import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
   <div className="mt-8">

    <SectionTitle
        title="⚡ Acciones rápidas"
    />

    <div className="grid gap-4">

        <QuickActionCard
            icon={UserPlus}
            title="Nuevo equipo"
            description="Registrar un equipo en el torneo."
        />

        <QuickActionCard
            icon={CalendarPlus}
            title="Nuevo partido"
            description="Crear un partido rápidamente."
        />

        <QuickActionCard
            icon={ClipboardList}
            title="Asignar árbitro"
            description="Asignar árbitros a partidos."
        />

        <QuickActionCard
            icon={MonitorPlay}
            title="Abrir pantalla TV"
            description="Mostrar resultados en la televisión."
        />

    </div>

</div>
  );
}