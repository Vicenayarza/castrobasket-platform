import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";

import SectionTitle from "@/components/dashboard/SectionTitle";
import StatCard from "@/components/dashboard/StatCard";
import LiveMatchCard from "@/components/dashboard/LiveMatchCard";
import UpcomingMatchCard from "@/components/dashboard/UpcomingMatchCard";
import TournamentStatus from "@/components/dashboard/TournamentStatus";
import NotificationCard from "@/components/dashboard/NotificationCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

import {
  Calendar,
  Users,
  Trophy,
  UserPlus,
  CalendarPlus,
  MonitorPlay,
  ClipboardList,
} from "lucide-react";

import { getDashboardData } from "@/services/dashboardService";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    setLoading(true);

    try {

      const data = await getDashboardData();

      setDashboard(data);

    }

    catch (error) {

      console.error(error);

    }

    setLoading(false);

  }

  const stats = [

    {
      title: "Equipos",
      value: dashboard?.teams ?? 0,
      icon: Trophy,
    },

    {
      title: "Usuarios",
      value: dashboard?.users ?? 0,
      icon: Users,
    },

    {
      title: "En juego",
      value: dashboard?.live ?? 0,
      icon: MonitorPlay,
    },

    {
      title: "Pendientes",
      value: dashboard?.pending ?? 0,
      icon: Calendar,
    },

  ];

  return (

    <AdminLayout>

      <SectionTitle

        title="Dashboard"

        subtitle="Resumen general del torneo"

      />

      {

        loading ?

        (

          <div className="py-20 text-center">

            Cargando dashboard...

          </div>

        )

        :

        (

          <>

            {/* Estadísticas */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              {

                stats.map(stat => (

                  <StatCard

                    key={stat.title}

                    title={stat.title}

                    value={stat.value}

                    icon={stat.icon}

                  />

                ))

              }

            </div>

            {/* Contenido */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">

              {/* Columna izquierda */}

              <div className="xl:col-span-2 space-y-8">

                <div>

                  <SectionTitle

                    title="🔴 Partidos en juego"

                  />

                  <div className="space-y-4">

                    {

                      dashboard.liveMatches.length === 0 ?

                      (

                        <div className="rounded-xl border bg-white p-8 text-center text-slate-500">

                          No hay partidos en juego.

                        </div>

                      )

                      :

                      (

                        dashboard.liveMatches.map(match => (

                          <LiveMatchCard

                            key={match.id}

                            court={match.courtName}

                            teamA={match.homeTeamName}

                            scoreA={match.homeScore}

                            teamB={match.awayTeamName}

                            scoreB={match.awayScore}

                          />

                        ))

                      )

                    }

                  </div>

                </div>

              </div>

              {/* Columna derecha */}

              <div className="space-y-6">

                <SectionTitle

                  title="📅 Próximos partidos"

                />

                {

                  dashboard.upcomingMatches.length === 0 ?

                  (

                    <div className="rounded-xl border bg-white p-8 text-center text-slate-500">

                      No quedan partidos.

                    </div>

                  )

                  :

                  (

                    dashboard.upcomingMatches.map(match => (

                      <UpcomingMatchCard

                        key={match.id}

                        hour={match.time}

                        court={match.courtName}

                        teamA={match.homeTeamName}

                        teamB={match.awayTeamName}

                      />

                    ))

                  )

                }

                <SectionTitle

                  title="⚡ Acciones rápidas"

                />

                <div className="grid gap-4">

                  <QuickActionCard

                    icon={UserPlus}

                    title="Nuevo equipo"

                    description="Registrar un nuevo equipo."

                  />

                  <QuickActionCard

                    icon={CalendarPlus}

                    title="Nuevo partido"

                    description="Crear un nuevo partido."

                  />

                  <QuickActionCard

                    icon={ClipboardList}

                    title="Asignar árbitro"

                    description="Gestionar árbitros."

                  />

                  <QuickActionCard

                    icon={MonitorPlay}

                    title="Pantalla TV"

                    description="Abrir la pantalla del pabellón."

                  />

                </div>

                <TournamentStatus />

                <NotificationCard />

              </div>

            </div>

          </>

        )

      }

    </AdminLayout>

  );

}