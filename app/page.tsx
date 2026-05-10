import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AudienceEntry } from "@/components/landing/AudienceEntry";
import { Caregivers } from "@/components/landing/Caregivers";
import { MemoryScroll } from "@/components/landing/MemoryScroll";
import { CinematicSteps } from "@/components/CinematicSteps";
import { OurStory } from "@/components/landing/OurStory";
import { ForDoctors } from "@/components/landing/ForDoctors";
import { CognitiveGames } from "@/components/landing/CognitiveGames";
import { Entertainment } from "@/components/landing/Entertainment";
import { ApplicationForm } from "@/components/landing/ApplicationForm";
import { Footer } from "@/components/landing/Footer";

function Wave({ fromColor, toColor }: { fromColor: string; toColor: string; direction?: "down" | "up" }) {
  return (
    <div style={{ position: "relative", height: "72px", marginTop: "-1px", background: fromColor, overflow: "hidden", display: "block", lineHeight: 0 }}>
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "block" }}>
        <path d="M0,72 L1440,72 L1440,12 C1080,72 360,72 0,12 Z" fill={toColor} />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />
      <Wave fromColor="#080B14" toColor="#FFFFFF" direction="down" />

      <AudienceEntry />
      <Wave fromColor="#FFFFFF" toColor="#F7F6F3" direction="up" />

      <Caregivers />
      <Wave fromColor="#F7F6F3" toColor="#0A0F1E" direction="up" />

      <MemoryScroll />
      <Wave fromColor="#0A0F1E" toColor="#F7F6F3" direction="down" />

      <CinematicSteps />
      <Wave fromColor="#F7F6F3" toColor="#080B14" direction="up" />

      <OurStory />
      <Wave fromColor="#080B14" toColor="#FAFAFA" direction="down" />

      <ForDoctors />

      <CognitiveGames />

      <Entertainment />

      <ApplicationForm />

      <Footer />
    </main>
  );
}
