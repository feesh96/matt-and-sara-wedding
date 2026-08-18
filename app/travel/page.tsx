import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <PageShell
      eyebrow="Princeton, New Jersey"
      title="Travel"
      intro="Hotel blocks are available in downtown Princeton. More travel details will follow with the formal invitation."
    >
      <section className="accommodations" aria-labelledby="accommodations-title">
        <p className="eyebrow">Stay in Princeton</p>
        <h2 id="accommodations-title">Accommodations</h2>
        <p className="accommodationsIntro">{site.travel.accommodations}</p>
        <div className="hotelGrid">
          {site.travel.hotels.map((hotel) => (
            <article className="hotelCard" key={hotel.name}>
              {hotel.image ? (
                <div className="hotelArtwork">
                  <Image
                    src={hotel.image}
                    alt={hotel.imageAlt}
                    fill
                    sizes="(max-width: 720px) 82vw, 420px"
                  />
                </div>
              ) : null}
              <h3>{hotel.name}</h3>
              <p>{hotel.description}</p>
              <a
                className="hotelLink"
                href={hotel.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View the room block for ${hotel.name} (opens in a new tab)`}
              >
                View
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
