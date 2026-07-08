import { getMatches } from "./matchService";
import { getTeams } from "./teamService";
import { getUsers } from "./userService";

export async function getDashboardData() {

  const [

    matches,

    teams,

    users,

  ] = await Promise.all([

    getMatches(),

    getTeams(),

    getUsers(),

  ]);

  const liveMatches = matches.filter(match => match.status === "live");

  const pendingMatches = matches.filter(match => match.status === "pending");

  const finishedMatches = matches.filter(match => match.status === "finished");

  return {

    teams: teams.length,

    users: users.length,

    live: liveMatches.length,

    pending: pendingMatches.length,

    finished: finishedMatches.length,

    liveMatches,

    upcomingMatches: pendingMatches
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 5),

  };

}