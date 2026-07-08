import PublicMatchCard from "./PublicMatchCard";

export default function PublicMatchesTable({
  matches,
  teamsMap = {},
}) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        No hay partidos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {matches.map((match) => {
        const homeLogo =
          match.homeTeamLogo ||
          teamsMap[match.homeTeamId]?.logo ||
          "";

        const awayLogo =
          match.awayTeamLogo ||
          teamsMap[match.awayTeamId]?.logo ||
          "";

        return (
          <PublicMatchCard
            key={match.id}
            match={match}
            homeLogo={homeLogo}
            awayLogo={awayLogo}
          />
        );
      })}
    </div>
  );
}