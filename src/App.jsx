import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* PÁGINAS PÚBLICAS */
import Home from "./pages/public/Home";
import MatchesPublic from "./pages/public/Matches";
import Results from "./pages/public/Results";
import Standings from "./pages/public/Standings";
import TeamsPublic from "./pages/public/Teams";
import TeamDetail from "./pages/public/TeamDetail";

/* TV */
import TV from "./pages/tv/TV";

/* LOGIN */
import Login from "./pages/Login";

/* ADMIN */
import Dashboard from "./pages/admin/Dashboard";
import MatchesAdmin from "./pages/admin/Matches";
import TeamsAdmin from "./pages/admin/Teams";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";
import StandingsAdmin from "./pages/admin/Standings";

/* ÁRBITRO */
import Referee from "./pages/referee/Referee";

/* PROTECCIÓN DE RUTAS */
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================== */}
        {/* RUTAS PÚBLICAS */}
        {/* ======================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/matches"
          element={<MatchesPublic />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/standings"
          element={<Standings />}
        />

        <Route
          path="/teams"
          element={<TeamsPublic />}
        />

        <Route
          path="/teams/:teamId"
          element={<TeamDetail />}
        />

        <Route
          path="/tv"
          element={<TV />}
        />

        {/* ======================================== */}
        {/* LOGIN */}
        {/* ======================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ======================================== */}
        {/* ADMINISTRACIÓN */}
        {/* ======================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute role="admin">
              <MatchesAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute role="admin">
              <TeamsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute role="admin">
              <Categories />
            </ProtectedRoute>
          }
        />
        
        <Route
  path="/admin/standings"
  element={
    <ProtectedRoute role="admin">
      <StandingsAdmin />
    </ProtectedRoute>
  }
/>

        {/* ======================================== */}
        {/* ÁRBITROS */}
        {/* ======================================== */}

        <Route
          path="/referee"
          element={
            <ProtectedRoute role="referee">
              <Referee />
            </ProtectedRoute>
          }
        />

        {/* ======================================== */}
        {/* RUTA NO ENCONTRADA */}
        {/* ======================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}