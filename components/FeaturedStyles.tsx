'use client';

import Image from "next/image";
import ScrollAnimation from './ScrollAnimation';

export default function FeaturedStyle() {
    return (
        <section className="relative overflow-hidden py-12 md:py-16 bg-[#F3D5D8] px-4 md:px-8 lg:px-20">
            {/* Premium background (subtle grid only—no color gradient wash) */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(58,36,28,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(58,36,28,0.55) 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                        maskImage:
                            'radial-gradient(closest-side at 50% 35%, rgba(0,0,0,1), rgba(0,0,0,0))',
                    }}
                />
            </div>


            <div className="relative">
                <ScrollAnimation direction="fade">
                    <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-[#3A241C]/80">
                        CURATED GALLERY
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 mt-2 md:mt-0 gap-3 md:gap-0">
                        <h1 className="text-2xl md:text-3xl font-serif text-[#3A241C]">Featured Styles</h1>
                        <a
                            href="/gallery"
                            className="group inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#3A241C] underline underline-offset-4"
                        >
                            VIEW ALL WORK
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                </ScrollAnimation>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                    {/* Card 1 */}
                    <ScrollAnimation delay={0.1} direction="left">
                        <div className="w-full">
                            <div className="relative mx-auto w-[280px] h-[350px] md:w-[320px] md:h-[400px] lg:w-[350px] lg:h-[450px]">
                                <Image
                                    src="/girl1.jpg"
                                    alt="Goddess knotless"
                                    fill
                                    className="rounded-2xl object-cover"
                                    priority
                                />

                                {/* Glow */}
                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            'radial-gradient(400px circle at 20% 15%, rgba(245,158,11,0.35), rgba(0,0,0,0) 60%)',
                                    }}
                                />

                                {/* Glass overlay */}
                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 100%)',
                                    }}
                                />

                                {/* Frame */}
                                <div
                                    aria-hidden
                                    className="absolute -inset-[1px] rounded-[2.1rem] border border-yellow-500/20"
                                />

                                {/* Caption */}
                                <div className="absolute left-4 right-4 bottom-4">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-black/40 border border-yellow-400/25 px-4 py-2 backdrop-blur">
                                        <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.75)]" />
                                        <span className="text-[11px] md:text-xs font-semibold tracking-widest text-white/90">
                                            SIGNATURE SERIES
                                        </span>
                                    </div>
                                    <h2 className="mt-3 text-lg md:text-xl font-serif text-white">
                                        Goddess knotless
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Card 2 */}
                    <ScrollAnimation delay={0.2} direction="up">
                        <div className="w-full">
                            <div className="relative mx-auto mt-2 md:mt-[50px] w-[280px] h-[350px] md:w-[320px] md:h-[400px] lg:w-[350px] lg:h-[450px]">
                                <Image
                                    src="/g5.jpeg"
                                    alt="Tribal Crown"
                                    fill
                                    className="rounded-2xl object-cover"
                                />

                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            'radial-gradient(420px circle at 70% 20%, rgba(249,115,22,0.30), rgba(0,0,0,0) 60%)',
                                    }}
                                />

                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.60) 100%)',
                                    }}
                                />

                                <div
                                    aria-hidden
                                    className="absolute -inset-[1px] rounded-[2.1rem] border border-yellow-500/20"
                                />

                                <div className="absolute left-4 right-4 bottom-4">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-black/40 border border-yellow-400/25 px-4 py-2 backdrop-blur">
                                        <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.75)]" />
                                        <span className="text-[11px] md:text-xs font-semibold tracking-widest text-white/90">
                                            ARTISTIC EDITION
                                        </span>
                                    </div>
                                    <h2 className="mt-3 text-lg md:text-xl font-serif text-white">
                                        Tribal Crown
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Card 3 */}
                    <ScrollAnimation delay={0.3} direction="right">
                        <div className="w-full">
                            <div className="relative mx-auto w-[280px] h-[350px] md:w-[320px] md:h-[400px] lg:w-[350px] lg:h-[450px]">
                                <Image
                                    src="/g3.jpeg"
                                    alt="Luxe Bohemian"
                                    fill
                                    className="rounded-2xl object-cover"
                                />

                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            'radial-gradient(420px circle at 45% 15%, rgba(225,29,72,0.22), rgba(0,0,0,0) 60%)',
                                    }}
                                />

                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.58) 100%)',
                                    }}
                                />

                                <div
                                    aria-hidden
                                    className="absolute -inset-[1px] rounded-[2.1rem] border border-yellow-500/20"
                                />

                                <div className="absolute left-4 right-4 bottom-4">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-black/40 border border-yellow-400/25 px-4 py-2 backdrop-blur">
                                        <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.75)]" />
                                        <span className="text-[11px] md:text-xs font-semibold tracking-widest text-white/90">
                                            HERITAGE MORDERN
                                        </span>
                                    </div>
                                    <h2 className="mt-3 text-lg md:text-xl font-serif text-white">
                                        Luxe Bohemian
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}