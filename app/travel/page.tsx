import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { SectionDivider } from "@/components/section-divider";
import { TravelCards } from "@/components/travel-card";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <PageShell className="travelPage">
      <section aria-labelledby="accommodations-title">
        <PageIntro className="travelIntro" title="Accommodations" titleId="accommodations-title">
          <p>{site.travel.accommodations}</p>
          <p>{site.travel.roomBlockNote}</p>
        </PageIntro>
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
      </section>
      <SectionDivider />
      <section className="travelDirections" aria-labelledby="directions-title">
        <h2 id="directions-title" className="sectionTitle">Getting to Princeton</h2>
        <TravelCards directions={site.travel.directions} />
      </section>
    </PageShell>
  );
}
