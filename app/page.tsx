import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { HomeTitle } from "@/components/home-title";
import { HomeHeroImage } from "@/components/home-hero-image";
import { SectionDivider } from "@/components/section-divider";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="homePage">
      <SiteHeader overlay />
      <section className="homeHero" aria-labelledby="home-title">
        <HomeHeroImage src={site.media.gates} />
        <div className="homeHeroWash" aria-hidden="true" />
        <HomeTitle>
          <h1 id="home-title" aria-label={site.couple.displayNames}>
            Matt <span aria-hidden="true">&amp;</span> Sara
          </h1>
          <p>
            <time dateTime={site.wedding.dateIso}>{site.wedding.date}</time>
          </p>
          <p>{site.wedding.city}</p>
        </HomeTitle>
      </section>

      <SectionDivider className="homeStoryDivider" />
      <section className="homePhotoStory" aria-label="Matt and Sara in Japan">
        <div className="homeStoryLower">
          <div className="homeStoryMessage">
            <h2 className="sectionTitle">Welcome</h2>
            <p className="homeStoryIntro">
              We are so excited to celebrate our marriage with our cherished family and friends.
            </p>
          </div>
          <figure className="homeStoryPortrait">
            <Image
              src={site.media.welcomePortrait}
              alt="Matt and Sara together at a temple in Japan"
              fill
              loading="eager"
              sizes="(max-width: 760px) 88vw, 48vw"
            />
          </figure>
        </div>
        <SectionDivider />
        <figure className="homeStoryPanorama">
          <Image
            src={site.media.pagodaTowerLandscape}
            alt="Matt and Sara in front of a pagoda tower in Japan"
            fill
            loading="eager"
            sizes="100vw"
          />
        </figure>
      </section>
    </main>
  );
}
