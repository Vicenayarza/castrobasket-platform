import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import MatchesPublic from "./pages/public/Matches";
import Results from "./pages/public/Results";
import Standings from "./pages/public/Standings";
import TeamsPublic from "./pages/public/Teams";
import TeamDetail from "./pages/public/TeamDetail";

import TV from "./pages/tv/TV";
import Login from "./pages/Login";

import Dashboard from "./pages/admin/Dashboard";
import MatchesAdmin from "./pages/admin/Matches";
import TeamsAdmin from "./pages/admin/Teams";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";

import Referee from "./pages/referee/Referee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÚBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<MatchesPublic />} />
        <Route path="/results" element={<Results />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/teams" element={<TeamsPublic />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/matches" element={<MatchesAdmin />} />
        <Route path="/admin/teams" element={<TeamsAdmin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/categories" element={<Categories />} />

        {/* ÁRBITRO */}
        <Route path="/referee" element={<Referee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;