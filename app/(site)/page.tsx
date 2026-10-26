import Hero from "@/components/Hero";
import Flyers from "@/components/Flyers";
import EuropeBanner from "@/components/EuropeBanner";
import Offers from "@/components/Offers";
import JobsBanner from "@/components/JobsBanner";
import HowItWorks from "@/components/HowItWorks";
import Requirements from "@/components/Requirements";
import AgentsTeaser from "@/components/AgentsTeaser";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <Hero />
      <Reveal>
        <Flyers />
      </Reveal>
      <Reveal>
        <Offers />
      </Reveal>
      <Reveal>
        <EuropeBanner />
      </Reveal>
      <Reveal>
        <JobsBanner />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Requirements />
      </Reveal>
      <Reveal>
        <AgentsTeaser />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
    </main>
  );
}