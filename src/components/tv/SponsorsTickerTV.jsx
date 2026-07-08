import { sponsors } from "@/data/sponsors";

export default function SponsorsTickerTV() {

  const items = [...sponsors, ...sponsors];

  return (

    <div className="overflow-hidden border-t border-slate-700 pt-6 mt-10">

      <div className="sponsors-track">

        {items.map((sponsor,index)=>(

          <img
            key={index}
            src={sponsor.logo}
            alt={sponsor.name}
            className="h-16 w-auto mx-10 object-contain"
          />

        ))}

      </div>

    </div>

  );

}