import {
    LayoutDashboard,
    Users,
    UserRound,
    Trophy,
    MapPinned,
    CalendarDays,
    MonitorPlay,
    Settings,
    Tv,
    LogOut
} from "lucide-react";

export const navigation = [

    {

        title: "TORNEO",

        items: [

            {
                title: "Dashboard",
                icon: LayoutDashboard,
                href: "/admin"
            },

            {
                title: "Equipos",
                icon: Users,
                href: "/admin/teams"
            },

            {
                title: "Jugadores",
                icon: UserRound,
                href: "/admin/players"
            },

            {
                title: "Categorías",
                icon: Trophy,
                href: "/admin/categories"
            },

            {
                title: "Campos",
                icon: MapPinned,
                href: "/admin/courts"
            },

            {
                title: "Partidos",
                icon: CalendarDays,
                href: "/admin/matches"
            }

        ]

    },

    {

        title: "ÁRBITROS",

        items: [

            {
                title: "Árbitros",
                icon: UserRound,
                href: "/admin/referees"
            }

        ]

    },

    {

        title: "PÚBLICO",

        items: [

            {
                title: "Pantalla TV",
                icon: Tv,
                href: "/tv"
            },

            {
                title: "Resultados",
                icon: MonitorPlay,
                href: "/results"
            }

        ]

    },

    {

        title: "CONFIGURACIÓN",

        items: [

            {
                title: "Ajustes",
                icon: Settings,
                href: "/admin/settings"
            },

            {
                title: "Cerrar sesión",
                icon: LogOut,
                href: "/logout"
            }

        ]

    }

];