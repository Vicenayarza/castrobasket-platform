export default function Coin3D({
  homeLogo,
  awayLogo,
  homeName,
  awayName,
  flipping,
  winner,
}) {
  function finalRotation() {
    if (!winner) return "rotateY(0deg)";

    return winner === "home"
      ? "rotateY(2160deg)"
      : "rotateY(2340deg)";
  }

  return (
    <div className="coin-scene">
      <div
        className={`coin ${flipping ? "coin-flipping" : ""}`}
        style={{
          transform: flipping ? undefined : finalRotation(),
        }}
      >
        <div className="coin-side coin-front">
          {homeLogo ? (
            <img src={homeLogo} alt={homeName} />
          ) : (
            <span>{homeName?.charAt(0)}</span>
          )}
        </div>

        <div className="coin-side coin-back">
          {awayLogo ? (
            <img src={awayLogo} alt={awayName} />
          ) : (
            <span>{awayName?.charAt(0)}</span>
          )}
        </div>
      </div>
    </div>
  );
}