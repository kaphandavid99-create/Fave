import Hero from "@/components/Hero";
import HeroClouds from "@/components/HeroClouds";
import Standards from "@/components/Standards";
import ThreeBackground from "@/components/ThreeBackground";

import FeaturedStyle from "@/components/FeaturedStyles";
import Transformation from "@/components/Transformation";
import Newsletter from "@/components/Newsletter";
import LenisSmoothScroll from "@/components/LenisSmoothScroll";
import WaveWakeCarousel from "@/components/WaveWakeCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <LenisSmoothScroll>
      <main className="relative overflow-hidden">
        <ThreeBackground className="pointer-events-none" />


        <section className="relative">
          <HeroClouds />
          <Hero />
        </section>
        <WaveWakeCarousel />
        <Standards />
        <WhyChooseUs />
        <FeaturedStyle />
        <Transformation />
        <Newsletter />
      </main>

    </LenisSmoothScroll>
  );
}
