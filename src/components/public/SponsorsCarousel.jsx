import { sponsors } from "@/data/sponsors";

export default function SponsorsCarousel() {

  const logos = [...sponsors, ...sponsors];

  return (

    <section className="bg-white rounded-3xl shadow overflow-hidden py-8">

      <h2 className="text-center text-3xl font-black mb-8">

        Patrocinadores oficiales

      </h2>

      <div className="overflow-hidden">

        <div className="sponsors-track">

          {

            logos.map((sponsor,index)=>(

              <a

                key={index}

                href={sponsor.url}

                target="_blank"

                rel="noreferrer"

                className="sponsor-item"

              >

                <img

                  src={sponsor.logo}

                  alt={sponsor.name}

                />

              </a>

            ))

          }

        </div>

      </div>

    </section>

  );

}