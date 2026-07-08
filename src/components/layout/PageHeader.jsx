import { Button } from "@/components/ui/button";

export default function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="flex items-center justify-between mb-8">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="text-slate-500 mt-1">
          {description}
        </p>

      </div>

      {action}

    </div>
  );
}