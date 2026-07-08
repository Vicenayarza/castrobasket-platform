import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>
        🏀 CastroBasket
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        <Link to="/admin">Dashboard</Link>

        <Link to="/matches">Partidos</Link>

        <Link to="/teams">Equipos</Link>

        <Link to="/standings">Clasificación</Link>

        <Link to="/tv">TV</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;