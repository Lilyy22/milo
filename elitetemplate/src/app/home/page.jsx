import HeroSection from "@/components/hero-section";
import WelcomeSection from "@/components/welcome-section";
import ServicesSection from "@/components/services-section";
import WhyChooseSection from "@/components/why-choose-section";
import ImpactSection from "@/components/impact-section";
import CallToAction from "@/components/call-to-action";
import { HOME_PAGE_CONTENT } from "@/constants";
import { HOME_PAGE_CONTENT_DEF } from "@/constants/default";

export default function Home() {
  const {
    heroBlock = {},
    mainBlock = {},
    keysBlock = {},
    whyChooseBlock = {},
    statBlock = {},
  } = HOME_PAGE_CONTENT;

  // Destructure and alias variables from HOME_PAGE_CONTENT_DEF
  const {
    heroBlock: heroBlockDef = {},
    whyChooseBlock: whyChooseBlockDef = {},
    statBlock: statBlockDef = {},
  } = HOME_PAGE_CONTENT_DEF;

  return (
    <main className="min-h-screen">
      <HeroSection heroBlock={heroBlock ?? heroBlockDef} />
      <WelcomeSection mainBlock={mainBlock} />
      <ServicesSection keysBlock={keysBlock} />
      <WhyChooseSection whyChooseBlock={whyChooseBlock ?? whyChooseBlockDef} />
      <ImpactSection statBlock={statBlock ?? statBlockDef} />
      <CallToAction />
    </main>
  );
}
