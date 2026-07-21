'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroVideoAnimation from '@/components/HeroVideoAnimation';


export default function Hero() {
    return (
        <section className="relative h-[400px] md:h-[520px] lg:h-[650px]">
            {/* Background visuals: video (no new assets, uses existing /hero-video.mp4) */}
            <HeroVideoAnimation videoSrc="/hero-video.mp4" />


            {/* Cinematic, premium overlays */}
            <div className="absolute inset-0 pointer-events-none bg-black/25" />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(900px 420px at 15% 40%, rgba(255,215,175,0.14), rgba(0,0,0,0) 55%), radial-gradient(700px 360px at 70% 25%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)',
                }}
            />
            <div className="absolute inset-x-0 bottom-0 h-28 md:h-40 bg-gradient-to-t from-[#F7F1EC] to-transparent" />

            {/* Content */}
            <div className="absolute inset-0">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.95, delay: 0.15 }}
                    className="absolute left-4 md:left-12 lg:left-20 top-1/2 -translate-y-1/2 text-white max-w-lg lg:max-w-xl pr-4"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 backdrop-blur px-4 py-2"
                    >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#E7B58E] shadow-[0_0_18px_rgba(231,181,142,0.65)]" />
                        <span className="text-[11px] md:text-xs tracking-widest uppercase font-semibold">
                            Luxury Braiding Studio
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <div className="mt-4 md:mt-5">
                        <motion.h1
                            initial={{ opacity: 0, y: 26 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.95, delay: 0.5 }}
                            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif leading-[1.03] tracking-tight"
                        >
                            Artistry Woven Into{' '}
                            <span className="text-[#F3D3B1]">Every Strand</span>
                        </motion.h1>

                        {/* Sub text */}
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.65 }}
                            className="mt-4 md:mt-6 text-xs md:text-sm lg:text-base leading-relaxed text-white/85 max-w-[36rem]"
                        >
                            Experience the intersection of heritage craftsmanship and modern luxury. Intricate braids—built for beauty, comfort, and
                            healthy hair.
                        </motion.p>
                    </div>

                    {/* Trust microcopy row */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.78 }}
                        className="mt-4 md:mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] md:text-xs tracking-wide uppercase text-white/70"
                    >
                        <span className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E7B58E]" /> Care-first
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E7B58E]" /> Detail-driven
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E7B58E]" /> Local artists
                        </span>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.9 }}
                        className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4"
                    >
                        <Link href="/book" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto bg-[#8A4A32] px-6 md:px-8 py-3 rounded-xl hover:bg-[#6A3A22] transition text-sm md:text-base shadow-[0_18px_45px_rgba(138,74,50,0.35)]"
                            >
                                Book Appointment
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto border border-white/45 bg-white/5 px-6 md:px-8 py-3 hover:bg-white/15 transition text-xs md:text-sm uppercase rounded-xl tracking-wide"
                            onClick={() => {
                                window.location.href = '/services';
                            }}
                        >
                            Explore Services
                        </motion.button>
                    </motion.div>

                    {/* Focus hint for screen readers */}
                    <p className="sr-only">Book Appointment or Explore Services to learn more.</p>

                    {/* Divider + small footnote */}
                    <div className="mt-5 md:mt-6 flex items-center gap-3">
                        <div className="h-px w-14 md:w-20 bg-white/25" />
                        <p className="text-[11px] md:text-xs text-white/70">First appointment? We’ll match your style to your hair needs.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

