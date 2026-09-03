import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Registry" };

export default function RegistryPage() {
  return (
    <PageShell className="registryPage">
      <section className="registryIntro" aria-labelledby="registry-title">
        <div className="registryMessage">
          <h1 id="registry-title">Registry</h1>
          <div className="registryDivider" aria-hidden="true">
            <span />
          </div>
          <p>
            Your presence at our wedding is the greatest gift. If you would like to celebrate
            with a gift, our registry is available through Joy.
          </p>
        </div>

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
