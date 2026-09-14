import { getMatches } from "@/services/matchService";
import { getTeams } from "@/services/teamService";

import {
  getStandingsAdjustments,
} from "@/services/standingsAdjustmentService";
function getHeadToHeadStats(tiedTeams, groupMatches) {
  const tiedTeamIds = new Set(
    tiedTeams.map((team) => team.id)
  );

  const stats = {};

  tiedTeams.forEach((team) => {
    stats[team.id] = {
      points: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      difference: 0,
    };
  });

  groupMatches.forEach((match) => {
    const homeIsTied = tiedTeamIds.has(match.homeTeamId);
    const awayIsTied = tiedTeamIds.has(match.awayTeamId);

    // Solo cuentan los partidos disputados entre equipos empatados
    if (!homeIsTied || !awayIsTied) return;

    const homeScore = Number(match.homeScore) || 0;
    const awayScore = Number(match.awayScore) || 0;

    const homeStats = stats[match.homeTeamId];
    const awayStats = stats[match.awayTeamId];

    homeStats.pointsFor += homeScore;
    homeStats.pointsAgainst += awayScore;

    awayStats.pointsFor += awayScore;
    awayStats.pointsAgainst += homeScore;

    if (homeScore > awayScore) {
      homeStats.points += 2;
      awayStats.points += 1;
    } else {
      awayStats.points += 2;
      homeStats.points += 1;
    }
  });

  Object.values(stats).forEach((teamStats) => {
    teamStats.difference =
      teamStats.pointsFor -
      teamStats.pointsAgainst;
  });

  return stats;
}

function sortStandingsTeams(teams, groupMatches) {
  // Primero agrupamos los equipos que tienen los mismos puntos
  const teamsByPoints = {};

  teams.forEach((team) => {
    const key = String(team.points);

    if (!teamsByPoints[key]) {
      teamsByPoints[key] = [];
    }

    teamsByPoints[key].push(team);
  });

  const orderedPointValues = Object.keys(teamsByPoints)
    .map(Number)
    .sort((a, b) => b - a);

  const sortedTeams = [];

  orderedPointValues.forEach((pointsValue) => {
    const tiedTeams =
      teamsByPoints[String(pointsValue)];

    // Si solo hay uno, no hace falta desempatar
    if (tiedTeams.length === 1) {
      sortedTeams.push(tiedTeams[0]);
      return;
    }

    const headToHeadStats = getHeadToHeadStats(
      tiedTeams,
      groupMatches
    );

    tiedTeams.sort((a, b) => {
      const statsA = headToHeadStats[a.id];
      const statsB = headToHeadStats[b.id];

      // 1. Resultado/clasificación entre los empatados
      if (statsB.points !== statsA.points) {
        return statsB.points - statsA.points;
      }

      // 2. Diferencia de puntos entre los empatados
      if (statsB.difference !== statsA.difference) {
        return statsB.difference - statsA.difference;
      }

      // 3. Puntos a favor entre los empatados
      if (statsB.pointsFor !== statsA.pointsFor) {
        return statsB.pointsFor - statsA.pointsFor;
      }

      // 4. Respaldo: diferencia general
      if (b.difference !== a.difference) {
        return b.difference - a.difference;
      }

      // 5. Respaldo: puntos a favor generales
      if (b.pointsFor !== a.pointsFor) {
        return b.pointsFor - a.pointsFor;
      }

      // Último respaldo para que el orden sea estable
      return a.name.localeCompare(b.name);
    });

    sortedTeams.push(...tiedTeams);
  });

  return sortedTeams;
}

function normalizeGroup(group) {
  if (!group) return "Único";

  const value = String(group).trim();

  return value.toLowerCase() === "unico"
    ? "Único"
    : value;
}

export async function getStandings() {
  const [
    matches,
    teams,
    adjustments,
  ] = await Promise.all([
    getMatches(),
    getTeams(),
    getStandingsAdjustments(),
  ]);

  const tables = {};

  teams.forEach((team) => {
    const category =
      team.category || "Sin categoría";

    const group = normalizeGroup(team.group);

    const tableKey = `${category}__${group}`;

    if (!tables[tableKey]) {
      tables[tableKey] = {
        category,
        group,
        teams: {},
      };
    }

    tables[tableKey].teams[team.id] = {
      id: team.id,
      name: team.name,
      logo: team.logo || "",
      category,
      group,

      played: 0,
      wins: 0,
      losses: 0,

      pointsFor: 0,
      pointsAgainst: 0,
      difference: 0,

      points: 0,

      hasManualAdjustment: false,
      adjustmentNote: "",
    };
  });

  matches
    .filter(
      (match) =>
        match.status === "finished" &&
        match.phase === "groups"
    )
    .forEach((match) => {
      const category =
        match.category || "Sin categoría";

      const group = normalizeGroup(match.group);

      const tableKey = `${category}__${group}`;
      const table = tables[tableKey];

      if (!table) return;

      const home =
        table.teams[match.homeTeamId];

      const away =
        table.teams[match.awayTeamId];

      if (!home || !away) return;

      const homeScore =
        Number(match.homeScore) || 0;

      const awayScore =
        Number(match.awayScore) || 0;

      home.played += 1;
      away.played += 1;

      home.pointsFor += homeScore;
      home.pointsAgainst += awayScore;

      away.pointsFor += awayScore;
      away.pointsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.wins += 1;
        home.points += 2;

        away.losses += 1;
        away.points += 1;
      } else {
        away.wins += 1;
        away.points += 2;

        home.losses += 1;
        home.points += 1;
      }
    });

  adjustments.forEach((adjustment) => {
    const category = adjustment.category;
    const group = normalizeGroup(
      adjustment.group
    );

    const tableKey = `${category}__${group}`;

    const team =
      tables[tableKey]?.teams[
        adjustment.teamId
      ];

    if (!team) return;

    team.played +=
      Number(
        adjustment.playedAdjustment
      ) || 0;

    team.wins +=
      Number(
        adjustment.winsAdjustment
      ) || 0;

    team.losses +=
      Number(
        adjustment.lossesAdjustment
      ) || 0;

    team.pointsFor +=
      Number(
        adjustment.pointsForAdjustment
      ) || 0;

    team.pointsAgainst +=
      Number(
        adjustment.pointsAgainstAdjustment
      ) || 0;

    team.points +=
      Number(
        adjustment.pointsAdjustment
      ) || 0;

    team.hasManualAdjustment = true;
    team.adjustmentNote =
      adjustment.note || "";
  });

  return Object.values(tables).map(
    (table) => {
      const teams = Object.values(
        table.teams
      ).map((team) => ({
        ...team,

        played: Math.max(
          0,
          team.played
        ),

        wins: Math.max(
          0,
          team.wins
        ),

        losses: Math.max(
          0,
          team.losses
        ),

        pointsFor: Math.max(
          0,
          team.pointsFor
        ),

        pointsAgainst: Math.max(
          0,
          team.pointsAgainst
        ),

        points: Math.max(
          0,
          team.points
        ),

        difference:
          team.pointsFor -
          team.pointsAgainst,
      }));

     const groupMatches = matches.filter((match) => {
  return (
    match.status === "finished" &&
    match.phase === "groups" &&
    match.category === table.category &&
    normalizeGroup(match.group) ===
      normalizeGroup(table.group)
  );
});

const sortedTeams = sortStandingsTeams(
  teams,
  groupMatches
);

return {
  category: table.category,
  group: table.group,
  teams: sortedTeams,
};

      
    }
  );
}