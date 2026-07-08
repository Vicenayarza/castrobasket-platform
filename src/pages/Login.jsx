import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "@/services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/shared/Logo";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/referee");
      }
    } catch (e) {
      setError("Usuario o contraseña incorrectos.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a33,transparent_35%),linear-gradient(135deg,#020617,#064e3b,#020617)]" />

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white/95 shadow-2xl border border-white/30 p-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
              <Logo />
            </p>

            <h1 className="text-3xl font-black mt-2">
              Acceso organización
            </h1>

            <p className="text-slate-500 mt-2">
              Panel de administración y árbitros del torneo 3x3.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-8">
            <Input
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-500 hover:text-green-700"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}