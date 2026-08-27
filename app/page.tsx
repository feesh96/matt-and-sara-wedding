import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="homePage">
      <section className="homeHero" aria-labelledby="home-title">
        <Image
          className="homeGates"
          src={site.media.gates}
          alt="The open iron gates at TPC Jasna Polana"
          fill
          priority
          sizes="100vw"
        />
        <div className="homeHeroWash" aria-hidden="true" />
        <SiteHeader overlay />
        <div className="homeTitleLockup">
          <h1 id="home-title" aria-label={site.couple.displayNames}>
            Sara <span aria-hidden="true">&amp;</span> Matt
          </h1>
          <p>
            <time dateTime={site.wedding.dateIso}>May 30, 2027</time>
          </p>
          <p>{site.wedding.city}</p>
          <span className="titleRule" aria-hidden="true" />
        </div>
      </section>

      <section className="homeWelcome" aria-labelledby="welcome-title">
        <h2 id="welcome-title">Welcome</h2>
        <p>
          We look forward to celebrating our marriage with you at {site.wedding.venue} in
          Princeton.
        </p>
      </section>

      <section className="homePhotoStory" aria-label="Sara and Matt in Japan">
        <figure className="homePhoto homePhotoTower">
          <Image
            src={site.media.pagodaTower}
            alt="Sara and Matt in front of a pagoda tower in Japan"
            fill
            loading="eager"
            sizes="(max-width: 720px) 82vw, 42vw"
          />
        </figure>
        <figure className="homePhoto homePhotoHands">
          <Image
            src={site.media.holdingHands}
            alt="Sara and Matt together at a temple in Japan"
            fill
            loading="eager"
            sizes="(max-width: 720px) 68vw, 36vw"
          />
        </figure>
      </section>
    </main>
  );
}
