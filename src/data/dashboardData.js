import {
  Calendar,
  Users,
  Trophy,
  MapPinned,
} from "lucide-react";

export const stats = [
  {
    title: "Partidos",
    value: 48,
    icon: Calendar,
  },
  {
    title: "Equipos",
    value: 36,
    icon: Users,
  },
  {
    title: "Árbitros",
    value: 12,
    icon: Trophy,
  },
  {
    title: "Campos",
    value: 3,
    icon: MapPinned,
  },
];

export const liveMatches = [
  {
    court: "Campo 1",
    teamA: "CastroBasket",
    scoreA: 18,
    teamB: "Bilbao Basket",
    scoreB: 17,
  },
  {
    court: "Campo 2",
    teamA: "Laredo",
    scoreA: 12,
    teamB: "Solares",
    scoreB: 14,
  },
];

export const upcomingMatches = [
  {
    hour: "12:30",
    court: "Campo 3",
    teamA: "Castro",
    teamB: "Torrelavega",
  },
  {
    hour: "12:45",
    court: "Campo 1",
    teamA: "Santander",
    teamB: "Laredo",
  },
  {
    hour: "13:00",
    court: "Campo 2",
    teamA: "Sestao",
    teamB: "CastroBasket B",
  },
];