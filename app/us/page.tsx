import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { StoryExperience } from "@/components/story-experience";
import { StoryGallery } from "@/components/story-gallery";
import "./story.css";
import "./gallery.css";

export const metadata: Metadata = { title: "Our Story" };

export default function OurStoryPage() {
  return (
    <PageShell className="ourStoryPage">
      <PageIntro title="Our Story" titleId="our-story-title" />
      <StoryExperience layout="book" />
      <StoryGallery />
    </PageShell>
  );
}
