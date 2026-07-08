import { getMatches } from "./matchService";
import { getTeams } from "./teamService";

export async function getStandings() {
  const [matches, teams] = await Promise.all([
    getMatches(),
    getTeams(),
  ]);

  const tables = {};

  teams.forEach((team) => {
    const category = team.category || "Sin categoría";
    const group = team.group || "Único";

    const key = `${category}__${group}`;

    if (!tables[key]) {
      tables[key] = {
        category,
        group,
        teams: {},
      };
    }

    tables[key].teams[team.id] = {
      logo: team.logo || "",
      id: team.id,
      name: team.name,
      category,
      group,
      played: 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      difference: 0,
      points: 0,
    };
  });

  matches
    .filter((match) => match.status === "finished")
    .filter((match) => match.phase === "groups")
    .forEach((match) => {
      const category = match.category || "Sin categoría";
      const group = match.group || "Único";

      const key = `${category}__${group}`;

      if (!tables[key]) return;

      const home = tables[key].teams[match.homeTeamId];
      const away = tables[key].teams[match.awayTeamId];

      if (!home || !away) return;

      const homeScore = Number(match.homeScore || 0);
      const awayScore = Number(match.awayScore || 0);

      home.played++;
      away.played++;

      home.pointsFor += homeScore;
      home.pointsAgainst += awayScore;

      away.pointsFor += awayScore;
      away.pointsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.wins++;
        home.points += 2;

        away.losses++;
        away.points += 1;
      } else {
        away.wins++;
        away.points += 2;

        home.losses++;
        home.points += 1;
      }
    });

  return Object.values(tables).map((table) => {
    const teams = Object.values(table.teams).map((team) => ({
      ...team,
      difference: team.pointsFor - team.pointsAgainst,
    }));

    teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.difference !== a.difference) return b.difference - a.difference;
      return b.pointsFor - a.pointsFor;
    });

    return {
      category: table.category,
      group: table.group,
      teams,
    };
  });
}