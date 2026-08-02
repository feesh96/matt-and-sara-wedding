import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <PageShell
      eyebrow="The wedding day"
      title="Schedule"
      intro="For now, the date and place are the important parts. We will add times and event details with the formal invitation."
    >
      <section className="eventRow">
        <p className="eventDate">{site.wedding.day}<br />May 30, 2027</p>
        <div>
          <h2>Ceremony & celebration</h2>
          <p>{site.wedding.venue}</p>
          <p>{site.wedding.city}</p>
          <p className="muted">Timing to follow</p>
        </div>
      </section>
    </PageShell>
  );
}
