import { Card, CardContent } from "@/components/ui/card";

export default function HomeStatCard({

  title,

  value,

}) {

  return (

    <Card className="rounded-2xl">

      <CardContent className="p-6 text-center">

        <p className="text-sm text-slate-500">

          {title}

        </p>

        <h2 className="text-4xl font-black mt-2 text-green-700">

          {value}

        </h2>

      </CardContent>

    </Card>

  );

}