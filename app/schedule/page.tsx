import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <PageShell className="schedulePage">
      <section className="scheduleLead" aria-labelledby="schedule-title">
        <h1 id="schedule-title">
          <span>Sunday, May</span> 30<sup>th</sup>, 2027
        </h1>
      </section>
      <section className="scheduleScene" aria-labelledby="ceremony-title">
        <Image className="scheduleAerial" src={site.media.aerial} alt="" fill sizes="100vw" />
        <div className="scheduleSceneWash" aria-hidden="true" />
        <div className="scheduleEvent">
          <h2 id="ceremony-title">Ceremony &amp; Reception</h2>
          <p className="scheduleTime">5:00 pm - 11:00 pm</p>
          <a
            className="venueButton"
            href={site.wedding.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{site.wedding.venue}</strong>
            <span>{site.wedding.address}</span>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
