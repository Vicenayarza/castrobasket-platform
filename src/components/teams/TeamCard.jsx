import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function TeamCard({
  team,
}) {
  return (
    <Card className="hover:shadow-lg transition-all rounded-2xl">

      <CardContent className="p-5">

        <div className="flex justify-between items-center">

          <div>

            <h3 className="text-lg font-bold">

              {team.name}

            </h3>

            <p className="text-slate-500">

              {team.category}

            </p>

          </div>

          <div className="flex gap-2">

            <Button
              size="icon"
              variant="outline"
            >
              <Pencil size={18}/>
            </Button>

            <Button
              size="icon"
              variant="destructive"
            >
              <Trash2 size={18}/>
            </Button>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}