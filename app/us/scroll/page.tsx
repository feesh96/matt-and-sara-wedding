import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { StoryExperience } from "@/components/story-experience";
import "../story.css";

export const metadata: Metadata = { title: "Our Story" };

export default function ScrollingStoryPage() {
  return (
    <PageShell className="ourStoryPage">
      <PageIntro title="Our Story" titleId="our-story-title" />
      <StoryExperience layout="scroll" />
    </PageShell>
  );
}
