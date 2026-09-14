import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "@/components/shared/Logo";

import { Button } from "@/components/ui/button";

import { logout } from "@/services/authService";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Trophy,
  Monitor,
  Settings,
  UserCog,
  LogOut,
  Layers
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Partidos",
    path: "/admin/matches",
    icon: CalendarDays,
  },
  {
    title: "Equipos",
    path: "/admin/teams",
    icon: Users,
  },
  {
    title: "Usuarios",
    path: "/admin/users",
    icon: UserCog,
  },
  {
    title: "Clasificaciones",
    path: "/admin/standings",
    icon: Trophy,
  },
  {
    title: "Pantalla TV",
    path: "/tv",
    icon: Monitor,
  },
  
{
    title: "Categorías",
     path: "/admin/categories",
    icon: Layers
},

];

export default function AppSidebar() {

  const location = useLocation();

  const navigate = useNavigate();

  async function handleLogout() {

    try {

      await logout();

    } catch (e) {

      console.error(e);

    }

    navigate("/");

  }

  return (

    <aside className="w-72 min-h-screen bg-white border-r shadow-sm flex flex-col">

      {/* Logo */}

      <div className="h-24 border-b flex items-center px-6">

        <Logo />

      </div>

      {/* Menú */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {

          menu.map((item) => {

            const Icon = item.icon;

            const active = location.pathname === item.path;

            return (

              <Link
                key={item.title}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                  active
                    ? "bg-green-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-green-700"
                }`}
              >

                <Icon size={20} />

                <span>{item.title}</span>

              </Link>

            );

          })

        }

      </nav>

      {/* Información torneo */}

      <div className="border-t p-6">

        <div className="rounded-xl bg-green-50 border border-green-200 p-4">

          <p className="text-xs uppercase font-semibold text-slate-500">

            Torneo

          </p>

          <p className="font-bold mt-1">

            CastroBasket 3x3

          </p>

          <p className="text-sm text-slate-500">

            Edición 2026

          </p>

        </div>

        <Button
          variant="destructive"
          className="w-full mt-4"
          onClick={handleLogout}
        >

          <LogOut className="mr-2 h-4 w-4" />

          Cerrar sesión

        </Button>

      </div>

    </aside>

  );

}