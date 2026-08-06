import { AboutSection } from "@/components/about-section";
import { Faq } from "@/components/faq";
import { FinalBookingCta } from "@/components/final-booking-cta";
import { ForumMusicumBand } from "@/components/forum-musicum-band";
import { Hero } from "@/components/hero";
import { LessonCapacitySection } from "@/components/lesson-capacity-section";
import { MaterialsTeaser } from "@/components/materials-teaser";
import { MethodSection } from "@/components/method-section";
import { PillarsSection } from "@/components/pillars-section";
import { PricingSection } from "@/components/pricing-section";
import { StudentDuetSection } from "@/components/student-duet-section";

/**
 * Homepage O-F-E-R-T-A flow:
 * Hero → Pillars → Proof → Method → Result → Materials → Capacity → Pricing → About → FAQ → CTA
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PillarsSection />
      <ForumMusicumBand />
      <MethodSection />
      <StudentDuetSection />
      <MaterialsTeaser />
      <LessonCapacitySection />
      <PricingSection />
      <AboutSection />
      <Faq />
      <FinalBookingCta />
    </>
  );
}
