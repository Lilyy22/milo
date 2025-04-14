import HeroSection from "@/components/hero-section";
import WelcomeSection from "@/components/welcome-section";
import ServicesSection from "@/components/services-section";
import CallToAction from "@/components/call-to-action";
import { ABOUT_PAGE_CONTENT_DEF } from "@/constants/default";
import { ABOUT_PAGE_CONTENT } from "@/constants";
import { IsEmptyObject } from "@/lib/utils";
import WhyChooseSection from "@/components/why-choose-section";

export default function About() {
  const {
    heroBlock = {},
    mainBlock = {},
    whyChooseBlock = {},
  } = ABOUT_PAGE_CONTENT;

  // Destructure and alias variables from HOME_PAGE_CONTENT_DEF
  const {
    heroBlock: heroBlockDef = {},
    mainBlock: mainBlockDef = {},
    missionBlock: missionBlockDef = {},
    whyChooseBlock: whyChooseBlockDef = {},
  } = ABOUT_PAGE_CONTENT_DEF;

  return (
    <main className="min-h-screen">
      <HeroSection heroBlock={heroBlockDef} isAbout={true} />
      <WelcomeSection
        mainBlock={IsEmptyObject(mainBlock) ? mainBlock : mainBlockDef}
        isAbout={true}
      />
      <ServicesSection missionBlock={missionBlockDef} isAbout={true} />
      <WhyChooseSection whyChooseBlock={whyChooseBlockDef} />
      <CallToAction text="Schedule Your Appointment Today" />
    </main>
  );
}
