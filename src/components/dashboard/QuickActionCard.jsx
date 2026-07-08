import { Card, CardContent } from "@/components/ui/card";

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <Card className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

      <CardContent className="p-5">

        <Icon className="text-green-600 mb-4" size={30} />

        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-sm text-slate-500 mt-2">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}