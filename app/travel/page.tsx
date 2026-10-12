import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { TravelCards } from "@/components/travel-card";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <PageShell className="travelPage">
      <section className="travelIntro" aria-labelledby="accommodations-title">
        <h1 id="accommodations-title">Accommodations</h1>
        <p>{site.travel.accommodations}</p>
        <p>{site.travel.roomBlockNote}</p>
      </section>
      <section className="hotelGrid" aria-label="Hotel room blocks">
        {site.travel.hotels.map((hotel) => (
          <article className="hotelCard" key={hotel.name}>
            <div className="hotelArtwork">
              <Image src={hotel.image} alt={hotel.imageAlt} fill sizes="(max-width: 720px) 82vw, 440px" />
            </div>
            <h2>{hotel.name}</h2>
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
      </section>
      <section className="travelDirections" aria-labelledby="directions-title">
        <div className="homeStoryDivider" aria-hidden="true">
          <span />
        </div>
        <h2 id="directions-title">Getting to Princeton</h2>
        <TravelCards directions={site.travel.directions} />
      </section>
    </PageShell>
  );
}
