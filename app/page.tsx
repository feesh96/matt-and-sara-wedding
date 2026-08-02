import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <Image
            className="heroImage"
            src={site.media.hero}
            alt="The open iron gates at TPC Jasna Polana"
            fill
            priority
            sizes="100vw"
          />
          <div className="heroShade" />
          <div className="heroFrame heroFrameOuter" />
          <SiteHeader overlay />
          <div className="heroCopy">
            <p className="heroEyebrow">Save the date</p>
            <h1 id="hero-title">{site.couple.displayNames}</h1>
            <div className="heroMeta">
              <p className="heroDate">
                <time dateTime={site.wedding.dateIso}>{site.wedding.date}</time>
              </p>
              <span aria-hidden="true" />
              <p className="heroLocation">{site.wedding.city}</p>
            </div>
          </div>
          <a className="scrollCue" href="#invitation">
            <span>Enter</span>
            <span className="scrollLine" aria-hidden="true" />
          </a>
        </section>

        <section className="invitationBand" id="invitation">
          <p className="eyebrow">Together with our families</p>
          <h2>We are getting married</h2>
          <p className="invitationCopy">
            Please save the date for our wedding celebration at {site.wedding.venue}.
            We cannot wait to celebrate with you.
          </p>
          <div className="dateLockup" aria-label={`${site.wedding.day}, ${site.wedding.date}`}>
            <span>{site.wedding.day}</span>
            <strong>30</strong>
            <span>May · 2027</span>
          </div>
        </section>

        <section className="detailsBand">
          <div className="detailBlock">
            <p className="eyebrow">The celebration</p>
            <h2>{site.wedding.venue}</h2>
            <p>{site.wedding.city}</p>
            <p>Formal invitation and celebration details to follow.</p>
            <Link className="textLink" href="/schedule">View schedule</Link>
          </div>
          <div className="detailRule" aria-hidden="true" />
          <div className="detailBlock">
            <p className="eyebrow">Planning ahead</p>
            <h2>A spring weekend in Princeton</h2>
            <p>Travel guidance will be added here as plans take shape.</p>
            <Link className="textLink" href="/travel">View travel notes</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
