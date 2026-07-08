function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px"
      }}
    >
      <h2>🏀 CastroBasket</h2>

      <div>
        <strong>Organizador</strong>
      </div>
    </header>
  );
}

export default Header;