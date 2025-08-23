import React from "react";
import Header from "@/components/hero/header";
import Footer from "@/components/hero/footer";
import About from "@/components/hero/about";
import Services from "@/components/hero/services";
import Hero from "@/components/about/hero";
import SponsorCarousel from "@/components/hero/sponsor-carousel";

export default function Page() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <SponsorCarousel />
    </div>
  );
}
