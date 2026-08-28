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
            <time dateTime={site.wedding.dateIso}>{site.wedding.date}</time>
          </p>
          <p>{site.wedding.city}</p>
          <span className="titleRule" aria-hidden="true" />
        </div>
      </section>

      <section className="homePhotoStory" aria-label="Sara and Matt in Japan">
        <div className="homeStoryLower">
          <div className="homeStoryMessage">
            <h2>Welcome</h2>
            <p className="homeStoryIntro">
              We look forward to celebrating our marriage with you at {site.wedding.venue} in
              Princeton.
            </p>
            <span className="homeStoryRule" aria-hidden="true" />
            <p className="homeStoryDetails">
              <time dateTime={site.wedding.dateIso}>05.30, 2027</time>
              <span aria-hidden="true"> · </span>
              {site.wedding.city}
            </p>
          </div>
          <figure className="homeStoryPortrait">
            <Image
              src={site.media.holdingHands}
              alt="Sara and Matt together at a temple in Japan"
              fill
              loading="eager"
              sizes="(max-width: 760px) 88vw, 48vw"
            />
          </figure>
        </div>
        <figure className="homeStoryPanorama">
          <Image
            src={site.media.pagodaTowerLandscape}
            alt="Sara and Matt in front of a pagoda tower in Japan"
            fill
            loading="eager"
            sizes="100vw"
          />
        </figure>
      </section>
    </main>
  );
}
