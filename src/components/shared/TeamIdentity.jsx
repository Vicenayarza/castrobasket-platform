export default function TeamIdentity({
  name,
  logo,
  size = "md",
}) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-16 h-16 text-xl",
  };

  const textSize =
    name?.length > 28
      ? "text-sm"
      : name?.length > 18
      ? "text-base"
      : "text-lg";

  return (
    <div className="flex items-center gap-3 min-w-0">
      {logo ? (
        <img
          src={logo}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover border bg-white shrink-0`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-green-100 text-green-700 flex items-center justify-center font-black shrink-0`}
        >
          {name?.charAt(0)}
        </div>
      )}

      <span
        className={`font-semibold leading-tight ${textSize} truncate`}
        title={name}
      >
        {name}
      </span>
    </div>
  );
}