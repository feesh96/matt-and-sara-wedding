import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { SectionDivider } from "@/components/section-divider";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Registry" };

export default function RegistryPage() {
  return (
    <PageShell className="registryPage">
      <PageIntro className="registryIntro" title="Registry" titleId="registry-title">
        <p>
          Your presence at our wedding is the greatest gift. If you would like to celebrate
          with a gift, our registry is available through Joy.
        </p>
      </PageIntro>
      <SectionDivider />
      <section className="registryContent" aria-label="Our registry">
        <article className="registryCard">
          <p className="registryKicker">Our registry</p>
          <h2>Joy</h2>
          <p className="registryInstructions">
            Joy will ask for this password when you visit our registry.
          </p>
          <div className="registryPassword">
            <span>Password</span>
            <strong>{site.registry.password}</strong>
          </div>
          <a
            className="registryLink"
            href={site.registry.joyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View our registry
          </a>
        </article>
      </section>
    </PageShell>
  );
}
