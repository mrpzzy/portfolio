import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CatInterlude from "@/components/CatInterlude";
import CinematicSnap from "@/components/CinematicSnap";
import BackToTop from "@/components/BackToTop";
import WhatIDo from "@/components/WhatIDo";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import HowIThink from "@/components/HowIThink";
import Capabilities from "@/components/Capabilities";
import About from "@/components/About";
import Direction from "@/components/Direction";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <CinematicSnap />
        <Hero />
        <CatInterlude />
        <WhatIDo />
        <Work />
        <Experience />
        <HowIThink />
        <Capabilities />
        <About />
        <Direction />
      </main>
      <Contact />
      <BackToTop />
    </>
  );
}
