import {
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import TeamIdentity from "@/components/shared/TeamIdentity";

export default function StandingsCard({

  category,

  teams,

}) {

  function positionIcon(position) {

    switch(position){

      case 1:

        return <Trophy className="h-5 w-5 text-yellow-500"/>;

      case 2:

        return <Medal className="h-5 w-5 text-slate-400"/>;

      case 3:

        return <Award className="h-5 w-5 text-amber-700"/>;

      default:

        return (

          <span className="font-bold">

            {position}

          </span>

        );

    }

  }

  return (

    <div className="bg-white rounded-2xl shadow overflow-hidden">

      <div className="bg-green-600 text-white px-6 py-4">

        <h2 className="text-xl font-bold">

          {category}

        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">

                #

              </th>

              <th className="px-4 py-3 text-left">

                Equipo

              </th>

              <th className="px-3 py-3 text-center">

                PJ

              </th>

              <th className="px-3 py-3 text-center">

                PG

              </th>

              <th className="px-3 py-3 text-center">

                PP

              </th>

              <th className="px-3 py-3 text-center">

                PF

              </th>

              <th className="px-3 py-3 text-center">

                PC

              </th>

              <th className="px-3 py-3 text-center">

                DIF

              </th>

              <th className="px-3 py-3 text-center">

                PTS

              </th>

            </tr>

          </thead>

          <tbody>

            {

              teams.map((team,index)=>(

                <tr
                  key={team.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-4 py-4">

                    {positionIcon(index+1)}

                  </td>

                 <td className="px-4 py-4">
  <TeamIdentity
    name={team.name}
    logo={team.logo}
    size="sm"
  />
</td>

                  <td className="text-center">

                    {team.played}

                  </td>

                  <td className="text-center">

                    {team.wins}

                  </td>

                  <td className="text-center">

                    {team.losses}

                  </td>

                  <td className="text-center">

                    {team.pointsFor}

                  </td>

                  <td className="text-center">

                    {team.pointsAgainst}

                  </td>

                  <td className="text-center">

                    {team.difference}

                  </td>

                  <td className="text-center font-bold text-green-700">

                    {team.points}

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}