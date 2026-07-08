import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PublicLayout from "@/components/layout/PublicLayout";

import HeroBanner from "@/components/public/HeroBanner";
import HomeStatCard from "@/components/public/HomeStatCard";

import { Button } from "@/components/ui/button";
import SponsorsCarousel from "@/components/public/SponsorsCarousel";

import { getDashboardData } from "@/services/dashboardService";

export default function Home() {
  const [dashboard, setDashboard] = useState(null);
  const TOTAL_PLAYERS = 160;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getDashboardData();
    setDashboard(data);
  }

  if (!dashboard) {
    return (
      <PublicLayout>
        <div className="py-20 text-center">
          Cargando...
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-5 py-10 space-y-10">

        

        <HeroBanner />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <HomeStatCard
            title="Equipos"
            value={dashboard.teams}
          />

          <HomeStatCard
            title="Jugadores"
            value={TOTAL_PLAYERS}
          />

          <HomeStatCard
            title="En juego"
            value={dashboard.live}
          />

          <HomeStatCard
            title="Partidos"
            value={dashboard.pending + dashboard.finished + dashboard.live}
          />

        </div>
        <SponsorsCarousel />
      </div>
    </PublicLayout>
  );
}