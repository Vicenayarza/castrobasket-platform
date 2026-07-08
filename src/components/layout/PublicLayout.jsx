import { Link, useLocation } from "react-router-dom";

import Logo from "@/components/shared/Logo";

export default function PublicLayout({ children }) {
  const location = useLocation();

  const menu = [
    { title: "Inicio", path: "/" },
    { title: "Partidos", path: "/matches" },
    { title: "Resultados", path: "/results" },
    { title: "Clasificación", path: "/standings" },
    { title: "Equipos", path: "/teams" },
    { title: "Acceso", path: "/login" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:h-20 md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-4 md:mb-0">
            <Logo />
          </div>

          <nav className="flex gap-3 overflow-x-auto pb-1 md:pb-0 md:gap-6">
            {menu.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition md:px-0 md:py-0 md:rounded-none md:text-base ${
                    active
                      ? "bg-green-600 text-white md:bg-transparent md:text-green-600"
                      : "bg-slate-100 text-slate-700 hover:text-green-600 md:bg-transparent"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}