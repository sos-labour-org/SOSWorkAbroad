import Hero from "@/components/Hero";
import Flyers from "@/components/Flyers";
import Offers from "@/components/Offers";
import JobsBanner from "@/components/JobsBanner";
import HowItWorks from "@/components/HowItWorks";
import Requirements from "@/components/Requirements";
import AgentsTeaser from "@/components/AgentsTeaser";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <Flyers />
      <Offers />
      <JobsBanner />
      <HowItWorks />
      <Requirements />
      <AgentsTeaser />
      <Faq />
    </main>
  );
}