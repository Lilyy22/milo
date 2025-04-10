import HeroSection from "@/components/hero-section";
import WelcomeSection from "@/components/welcome-section";
import ServicesSection from "@/components/services-section";
import WhyChooseSection from "@/components/why-choose-section";
import ImpactSection from "@/components/impact-section";
import CallToAction from "@/components/call-to-action";
import Footer from "@/components/footer";
import { HOME_PAGE_CONTENT } from "@/constants";

export default function About() {
  const {
    heroBlock = {},
    mainBlock = {},
    keysBlock = {},
    whyChooseBlock = {},
    statBlock = {},
  } = HOME_PAGE_CONTENT;

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection heroBlock={heroBlock} />
      <WelcomeSection mainBlock={mainBlock} />
      <ImpactSection statBlock={statBlock} />
      <ServicesSection keysBlock={keysBlock} />
      <WhyChooseSection whyChooseBlock={whyChooseBlock} />
      <CallToAction text="Schedule Your Appointment Today" />
      <Footer />
    </main>
  );
}
