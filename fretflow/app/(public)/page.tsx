import { AboutSection } from "@/components/about-section";
import { Faq } from "@/components/faq";
import { ForumMusicumBand } from "@/components/forum-musicum-band";
import { Hero } from "@/components/hero";
import { MethodSection } from "@/components/method-section";
import { PillarsSection } from "@/components/pillars-section";
import { PricingSection } from "@/components/pricing-section";

/**
 * Homepage orchestration: Why → pillars → proof → method → pricing → trust → FAQ.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PillarsSection />
      <ForumMusicumBand />
      <MethodSection />
      <PricingSection />
      <AboutSection />
      <Faq />
    </>
  );
}
