'use client';

import ScrollAnimation from './ScrollAnimation';

export default function Transformation() {
    return (
        <section className="relative overflow-hidden bg-black py-10 md:py-14 lg:py-18 px-4 md:px-8">
            {/* premium glow + background motion */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* removed color gradients for a cleaner black background */}
                <div className="absolute inset-0" style={{ background: 'transparent' }} />

                {/* grid overlay removed */}

                {/* corner accents */}
                <div className="absolute top-6 left-6 w-14 h-14 border-t border-l border-yellow-400/30" aria-hidden />
                <div className="absolute top-6 right-6 w-14 h-14 border-t border-r border-yellow-400/30" aria-hidden />
                <div className="absolute bottom-6 left-6 w-14 h-14 border-b border-l border-yellow-400/30" aria-hidden />
                <div className="absolute bottom-6 right-6 w-14 h-14 border-b border-r border-yellow-400/30" aria-hidden />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                {/* Left: Hero image card */}
                <ScrollAnimation direction="left" className="lg:w-1/2 w-full">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-orange-500/10 to-rose-500/15 blur-2xl" />
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_25px_80px_rgba(0,0,0,0.55)]">
                            <img
                                src="/g7.jpeg"
                                alt="Transformation"
                                className="w-full h-[420px] md:h-[470px] object-cover"
                            />
                            <div className="absolute inset-0" style={{
                                background:
                                  'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 100%)',
                            }} />

                            {/* badge */}
                            <div className="absolute top-5 left-5">
                                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-black/40 px-4 py-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.75)]" />
                                    <span className="text-xs md:text-sm font-semibold tracking-wide text-white/90">
                                        CRAFTED FOR CONFIDENCE
                                    </span>
                                </div>
                            </div>

                            {/* bottom highlight */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
                                <p className="mt-3 text-xs md:text-sm text-gray-200/80 leading-relaxed">
                                    From consultation to creation—every step is designed to protect your hair and elevate your look.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Right: copy + process */}
                <ScrollAnimation direction="right" className="lg:w-1/2 w-full">
                    <div className="rounded-2xl border border-yellow-400/15 bg-black/40 backdrop-blur p-6 md:p-8 shadow-[0_0_0_1px_rgba(245,158,11,0.10)]">
                        <div className="flex items-center gap-3">
                            <h3 className="text-yellow-400 text-xs md:text-sm font-semibold tracking-widest">
                                THE PROCESS
                            </h3>
                            <div className="h-px flex-1 bg-yellow-400/30" />
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 md:mt-5">
                            The Transformation
                        </h2>

                        <p className="text-gray-300 text-sm md:text-lg mt-4 leading-relaxed">
                            At Fave's Touch, we don&#39;t just change your hair—we refine your presence. Our multi-step process protects your strands and delivers a result that looks premium and lasts.
                        </p>

                        {/* steps */}
                        <div className="mt-8 md:mt-10 space-y-6 md:space-y-8">
                            {/* Step 1 */}
                            <ScrollAnimation delay={0.1} direction="up">
                                <div className="flex gap-4">
                                    <div className="shrink-0 flex items-center justify-center">
                                        <div className="h-10 w-10 rounded-xl bg-yellow-400/15 border border-yellow-400/25 shadow-[0_0_30px_rgba(245,158,11,0.14)]">
                                            <div className="text-yellow-300 font-bold text-sm">01</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-base md:text-xl font-semibold text-white">Consultation</h4>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1">We map your vision, check scalp health, and plan the perfect braid style for your lifestyle.</p>
                                    </div>
                                </div>
                            </ScrollAnimation>

                            {/* Step 2 */}
                            <ScrollAnimation delay={0.2} direction="up">
                                <div className="flex gap-4">
                                    <div className="shrink-0 flex items-center justify-center">
                                        <div className="h-10 w-10 rounded-xl bg-yellow-400/15 border border-yellow-400/25 shadow-[0_0_30px_rgba(245,158,11,0.14)]">
                                            <div className="text-yellow-300 font-bold text-sm">02</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-base md:text-xl font-semibold text-white">Preparation</h4>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1">Cleanse, detangle, moisturize, and prep correctly—so your braids lay flat, feel comfortable, and last longer.</p>
                                    </div>
                                </div>
                            </ScrollAnimation>

                            {/* Step 3 */}
                            <ScrollAnimation delay={0.3} direction="up">
                                <div className="flex gap-4">
                                    <div className="shrink-0 flex items-center justify-center">
                                        <div className="h-10 w-10 rounded-xl bg-yellow-400/15 border border-yellow-400/25 shadow-[0_0_30px_rgba(245,158,11,0.14)]">
                                            <div className="text-yellow-300 font-bold text-sm">03</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-base md:text-xl font-semibold text-white">Creation</h4>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1">Meticulous braiding with quality tension and finishing—so your style looks flawless from day one to day thirty.</p>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>

                        <div className="mt-8 md:mt-10">
                            <div className="inline-flex items-center gap-3 rounded-2xl bg-black/40 border border-yellow-400/20 px-5 py-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_22px_rgba(245,158,11,0.7)]" />
                                <p className="text-xs md:text-sm text-gray-200/90 leading-relaxed">
                                    Want a tailored plan? Book your session and bring inspiration—our team will match you with the right style and prep.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Extra right image removed: keep layout clean for “exceptional” look */}
            </div>
        </section>
    );
}