import logo from "@/assets/logos/logo.jpg";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="CastroBasket"
        className="h-12 w-12 object-contain"
      />

      <div>
        <h1 className="text-xl font-bold tracking-tight">
          CastroBasket
        </h1>

        <p className="text-xs text-slate-500">
          Tournament Platform
        </p>
      </div>
    </div>
  );
}