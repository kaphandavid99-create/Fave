'use client';

import { FaGem, FaLeaf, FaShieldAlt, FaAward } from 'react-icons/fa';
import Image from "next/image";
import ScrollAnimation from './ScrollAnimation';
import ThreeBackground from './ThreeBackground';


export default function Standards() {
  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-24 lg:py-28">

      {/* Three.js animated background */}
      <div className="absolute inset-0 -z-10">
        {/* lazy-load-ish: only runs on client since Standards is already a client component */}
        <div className="w-full h-full">
          {/* ThreeBackground is client-side (type-checking suppressed previously) */}
          <ThreeBackground className="w-full h-full" />
        </div>
      </div>

      {/* Premium background effects */}

      {/* Keep existing premium overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">

        {/* Radial glows */}
        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(800px circle at 15% 25%, rgba(245,158,11,0.15), rgba(0,0,0,0) 50%), radial-gradient(600px circle at 85% 35%, rgba(249,115,22,0.12), rgba(0,0,0,0) 50%), radial-gradient(700px circle at 50% 90%, rgba(225,29,72,0.08), rgba(0,0,0,0) 55%)',
          filter: 'saturate(1.15)',
        }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden style={{
          backgroundImage:
            'linear-gradient(to right, rgba(245,158,11,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(closest-side at 50% 40%, rgba(0,0,0,1), rgba(0,0,0,0))',
        }} />

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-yellow-400/25" aria-hidden />
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-yellow-400/25" aria-hidden />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-yellow-400/25" aria-hidden />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-yellow-400/25" aria-hidden />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left Content */}
          <ScrollAnimation direction="left" className="order-2 lg:order-1">
            <div className="rounded-2xl border border-yellow-400/15 bg-black/40 backdrop-blur p-8 md:p-10 shadow-[0_0_0_1px_rgba(245,158,11,0.10)]">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
                <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-widest">
                  OUR PROMISE
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                The Luxe Standard
              </h2>

              <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-10">
                Our commitment to excellence extends beyond the visual. We believe that true beauty starts with the integrity of the hair and the health of the scalp.
              </p>

              {/* Standards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <ScrollAnimation delay={0.1} direction="up">
                  <div className="group p-5 rounded-xl border border-yellow-400/10 bg-yellow-400/5 hover:bg-yellow-400/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaGem className="text-yellow-300 text-lg" />
                      </div>
                      <h3 className="font-semibold text-white text-base md:text-lg">
                        Premium Quality
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      Only the highest-grade hypoallergenic fibers for a lightweight, natural feel.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation delay={0.2} direction="up">
                  <div className="group p-5 rounded-xl border border-yellow-400/10 bg-yellow-400/5 hover:bg-yellow-400/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaLeaf className="text-yellow-300 text-lg" />
                      </div>
                      <h3 className="font-semibold text-white text-base md:text-lg">
                        Scalp Wellness
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      Detoxifying treatments and tension-relief consultations in every session.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation delay={0.3} direction="up">
                  <div className="group p-5 rounded-xl border border-yellow-400/10 bg-yellow-400/5 hover:bg-yellow-400/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaShieldAlt className="text-yellow-300 text-lg" />
                      </div>
                      <h3 className="font-semibold text-white text-base md:text-lg">
                        Safe & Gentle
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      Techniques designed to protect your natural hair and promote growth.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation delay={0.4} direction="up">
                  <div className="group p-5 rounded-xl border border-yellow-400/10 bg-yellow-400/5 hover:bg-yellow-400/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaAward className="text-yellow-300 text-lg" />
                      </div>
                      <h3 className="font-semibold text-white text-base md:text-lg">
                        Expert Craftsmanship
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      Years of specialized training and experience in premium styling techniques.
                    </p>
                  </div>
                </ScrollAnimation>

              </div>
            </div>
          </ScrollAnimation>

          {/* Right Images */}
          <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
            <ScrollAnimation delay={0.2} direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-orange-500/10 to-rose-500/15 blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_25px_80px_rgba(0,0,0,0.55)]">
                  <div className="relative w-full h-[350px] md:h-[400px] lg:h-[450px]">
                    <Image
                      src="/first.jpeg"
                      alt="Premium Hair Care"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0" style={{
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.45) 100%)',
                    }} />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-5 left-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-black/40 px-4 py-2 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.75)]" />
                      <span className="text-xs md:text-sm font-semibold tracking-widest text-white/90">
                        PREMIUM CARE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.4} direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/15 via-rose-500/10 to-yellow-400/20 blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_25px_80px_rgba(0,0,0,0.55)]">
                  <div className="relative w-full h-[280px] md:h-[320px] lg:h-[380px]">
                    <Image
                      src="/second.jpeg"
                      alt="Wellness Products"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0" style={{
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.45) 100%)',
                    }} />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-5 left-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-black/40 px-4 py-2 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.75)]" />
                      <span className="text-xs md:text-sm font-semibold tracking-widest text-white/90">
                        WELLNESS FOCUS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

        </div>
      </div>
    </section>
  );
}