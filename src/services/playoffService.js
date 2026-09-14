import { createMatch, getMatches } from "@/services/matchService";
import { getTeams } from "@/services/teamService";

function normalizeGroup(group) {
  if (!group) return "Único";
  if (group.toLowerCase?.() === "unico") return "Único";
  return group;
}

function winnerOf(match) {
  return Number(match.homeScore) > Number(match.awayScore)
    ? { id: match.homeTeamId, name: match.homeTeamName }
    : { id: match.awayTeamId, name: match.awayTeamName };
}

function buildStandings(teams, matches, category) {
  const tables = {};

  teams
    .filter((team) => team.category === category)
    .forEach((team) => {
      const group = normalizeGroup(team.group);

      if (!tables[group]) tables[group] = {};

      tables[group][team.id] = {
        id: team.id,
        name: team.name,
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
    .filter((match) => match.category === category)
    .filter((match) => match.phase === "groups")
    .filter((match) => match.status === "finished")
    .forEach((match) => {
      const group = normalizeGroup(match.group);

      const home = tables[group]?.[match.homeTeamId];
      const away = tables[group]?.[match.awayTeamId];

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

  const result = {};

  Object.keys(tables).forEach((group) => {
    result[group] = Object.values(tables[group])
      .map((team) => ({
        ...team,
        difference: team.pointsFor - team.pointsAgainst,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.difference !== a.difference) return b.difference - a.difference;
        return b.pointsFor - a.pointsFor;
      });
  });

  return result;
}

/*
|--------------------------------------------------------------------------
| SEMIFINALES
|--------------------------------------------------------------------------
| Grupo único:
| 1º vs 4º
| 2º vs 3º
|
| Dos grupos:
| 1ºA vs 2ºB
| 1ºB vs 2ºA
|--------------------------------------------------------------------------
*/

export async function generateSemifinals({
  category,
  semi1,
  semi2,
}) {
  const [teams, matches] = await Promise.all([
    getTeams(),
    getMatches(),
  ]);

  const existingSemis = matches.filter(
    (match) =>
      match.category === category &&
      match.phase === "semifinal"
  );

  if (existingSemis.length > 0) {
    throw new Error("Ya existen semifinales para esta categoría.");
  }

  const standings = buildStandings(teams, matches, category);
  const groups = Object.keys(standings);

  let semifinal1;
  let semifinal2;

  if (groups.length === 1) {
    const table = standings[groups[0]];

    if (table.length < 4) {
      throw new Error("Esta categoría necesita al menos 4 equipos.");
    }

    semifinal1 = {
      home: table[0],
      away: table[3],
    };

    semifinal2 = {
      home: table[1],
      away: table[2],
    };
  } else {
    const groupA = standings["A"];
    const groupB = standings["B"];

    if (!groupA || !groupB) {
      throw new Error("Para dos grupos deben existir Grupo A y Grupo B.");
    }

    if (groupA.length < 2 || groupB.length < 2) {
      throw new Error("Cada grupo necesita al menos 2 equipos.");
    }

    semifinal1 = {
      home: groupA[0],
      away: groupB[1],
    };

    semifinal2 = {
      home: groupB[0],
      away: groupA[1],
    };
  }

  await createMatch({
    category,
    group: "",
    phase: "semifinal",
    playoffOrder: 1,

    homeTeamId: semifinal1.home.id,
    homeTeamName: semifinal1.home.name,

    awayTeamId: semifinal1.away.id,
    awayTeamName: semifinal1.away.name,

    courtId: semi1.courtId,
    courtName: semi1.courtName,

    refereeId: semi1.refereeId,
    refereeName: semi1.refereeName,

    time: semi1.time,
  });

  await createMatch({
    category,
    group: "",
    phase: "semifinal",
    playoffOrder: 2,

    homeTeamId: semifinal2.home.id,
    homeTeamName: semifinal2.home.name,

    awayTeamId: semifinal2.away.id,
    awayTeamName: semifinal2.away.name,

    courtId: semi2.courtId,
    courtName: semi2.courtName,

    refereeId: semi2.refereeId,
    refereeName: semi2.refereeName,

    time: semi2.time,
  });

  return true;
}

/*
|--------------------------------------------------------------------------
| CUARTOS SENIOR
|--------------------------------------------------------------------------
| Senior con grupos A, B, C y D:
| pasan 1º y 2º de cada grupo.
|
| Cruces:
| 1ºA vs 2ºB
| 1ºB vs 2ºA
| 1ºC vs 2ºD
| 1ºD vs 2ºC
|--------------------------------------------------------------------------
*/

export async function generateQuarterfinals({
  category,
  quarter1,
  quarter2,
  quarter3,
  quarter4,
}) {
  const [teams, matches] = await Promise.all([
    getTeams(),
    getMatches(),
  ]);

  const existingQuarters = matches.filter(
    (match) =>
      match.category === category &&
      match.phase === "quarterfinal"
  );

  if (existingQuarters.length > 0) {
    throw new Error("Ya existen cuartos para esta categoría.");
  }

  const standings = buildStandings(teams, matches, category);

  const groupA = standings["A"];
  const groupB = standings["B"];
  const groupC = standings["C"];
  const groupD = standings["D"];

  if (!groupA || !groupB || !groupC || !groupD) {
    throw new Error("Para cuartos deben existir grupos A, B, C y D.");
  }

  if (
    groupA.length < 2 ||
    groupB.length < 2 ||
    groupC.length < 2 ||
    groupD.length < 2
  ) {
    throw new Error("Cada grupo necesita al menos 2 equipos clasificados.");
  }

  const quarters = [
    {
      home: groupA[0],
      away: groupB[1],
      data: quarter1,
      order: 1,
    },
    {
      home: groupB[0],
      away: groupA[1],
      data: quarter2,
      order: 2,
    },
    {
      home: groupC[0],
      away: groupD[1],
      data: quarter3,
      order: 3,
    },
    {
      home: groupD[0],
      away: groupC[1],
      data: quarter4,
      order: 4,
    },
  ];

  for (const quarter of quarters) {
    await createMatch({
      category,
      group: "",
      phase: "quarterfinal",
      playoffOrder: quarter.order,

      homeTeamId: quarter.home.id,
      homeTeamName: quarter.home.name,

      awayTeamId: quarter.away.id,
      awayTeamName: quarter.away.name,

      courtId: quarter.data.courtId,
      courtName: quarter.data.courtName,

      refereeId: quarter.data.refereeId,
      refereeName: quarter.data.refereeName,

      time: quarter.data.time,
    });
  }

  return true;
}

/*
|--------------------------------------------------------------------------
| SEMIFINALES DESDE CUARTOS
|--------------------------------------------------------------------------
| Ganador QF1 vs Ganador QF2
| Ganador QF3 vs Ganador QF4
|--------------------------------------------------------------------------
*/

export async function generateSemifinalsFromQuarterfinals({
  category,
  semi1,
  semi2,
}) {
  const matches = await getMatches();

  const existingSemis = matches.filter(
    (match) =>
      match.category === category &&
      match.phase === "semifinal"
  );

  if (existingSemis.length > 0) {
    throw new Error("Ya existen semifinales para esta categoría.");
  }

  const quarterfinals = matches
    .filter((match) => match.category === category)
    .filter((match) => match.phase === "quarterfinal")
    .filter((match) => match.status === "finished")
    .sort((a, b) => (a.playoffOrder || 0) - (b.playoffOrder || 0));

  if (quarterfinals.length < 4) {
    throw new Error("Los cuatro cuartos deben estar finalizados.");
  }

  const winner1 = winnerOf(quarterfinals[0]);
  const winner2 = winnerOf(quarterfinals[1]);
  const winner3 = winnerOf(quarterfinals[2]);
  const winner4 = winnerOf(quarterfinals[3]);

  await createMatch({
    category,
    group: "",
    phase: "semifinal",
    playoffOrder: 1,

    homeTeamId: winner1.id,
    homeTeamName: winner1.name,

    awayTeamId: winner2.id,
    awayTeamName: winner2.name,

    courtId: semi1.courtId,
    courtName: semi1.courtName,

    refereeId: semi1.refereeId,
    refereeName: semi1.refereeName,

    time: semi1.time,
  });

  await createMatch({
    category,
    group: "",
    phase: "semifinal",
    playoffOrder: 2,

    homeTeamId: winner3.id,
    homeTeamName: winner3.name,

    awayTeamId: winner4.id,
    awayTeamName: winner4.name,

    courtId: semi2.courtId,
    courtName: semi2.courtName,

    refereeId: semi2.refereeId,
    refereeName: semi2.refereeName,

    time: semi2.time,
  });

  return true;
}

/*
|--------------------------------------------------------------------------
| FINAL
|--------------------------------------------------------------------------
| Ganador SF1 vs Ganador SF2
|--------------------------------------------------------------------------
*/

export async function generateFinal({
  category,
  finalData,
}) {
  const matches = await getMatches();

  const existingFinal = matches.find(
    (match) =>
      match.category === category &&
      match.phase === "final"
  );

  if (existingFinal) {
    throw new Error("Ya existe una final para esta categoría.");
  }

  const semifinals = matches
    .filter((match) => match.category === category)
    .filter((match) => match.phase === "semifinal")
    .filter((match) => match.status === "finished")
    .sort((a, b) => (a.playoffOrder || 0) - (b.playoffOrder || 0));

  if (semifinals.length < 2) {
    throw new Error("Las dos semifinales deben estar finalizadas.");
  }

  const winner1 = winnerOf(semifinals[0]);
  const winner2 = winnerOf(semifinals[1]);

  await createMatch({
    category,
    group: "",
    phase: "final",
    playoffOrder: 1,

    homeTeamId: winner1.id,
    homeTeamName: winner1.name,

    awayTeamId: winner2.id,
    awayTeamName: winner2.name,

    courtId: finalData.courtId,
    courtName: finalData.courtName,

    refereeId: finalData.refereeId,
    refereeName: finalData.refereeName,

    time: finalData.time,
  });

  return true;
}