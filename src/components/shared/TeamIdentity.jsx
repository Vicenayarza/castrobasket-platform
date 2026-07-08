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

  return (
    <div className="flex items-center gap-3">
      {logo ? (
        <img
          src={logo}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover border bg-white`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-green-100 text-green-700 flex items-center justify-center font-black`}>
          {name?.charAt(0)}
        </div>
      )}

      <span className="font-semibold">
        {name}
      </span>
    </div>
  );
}