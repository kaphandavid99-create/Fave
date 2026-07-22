'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, HeartHandshake, ShieldCheck, Sparkles, Star } from 'lucide-react';

const highlights = [
  {
    title: 'Tailored artistry',
    text: 'Every style is crafted around your personality, face shape, and lifestyle for a look that feels unmistakably yours.',
    icon: Sparkles,
  },
  {
    title: 'Comfort-first care',
    text: 'We blend gentle technique with luxury service so your experience feels indulgent, calm, and confidence-boosting.',
    icon: HeartHandshake,
  },
  {
    title: 'Lasting confidence',
    text: 'From consultation to finish, we focus on detail, durability, and the kind of glow that stays long after you leave.',
    icon: ShieldCheck,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#060606] py-20 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,112,91,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(138,74,50,0.22),transparent_40%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="rounded-4xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8 lg:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C4705B]/30 bg-[#C4705B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f4c3b1]">
                <Sparkles className="h-3.5 w-3.5" />
                Why clients choose us
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Luxury hair styling that feels as extraordinary as you do.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                  We create elevated looks with precision, texture, and heart, turning every appointment into a memorable experience filled with confidence, calm, and standout beauty.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.1, duration: 0.45 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#C4705B]/15 text-[#f3b59c]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-sm leading-7 text-white/65">{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#C4705B] to-[#8A4A32] px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02]"
                >
                  Book your transformation
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                  <CalendarDays className="h-4 w-4 text-[#f3b59c]" />
                  Flexible appointments available
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[1.75rem] bg-linear-to-br from-[#C4705B]/30 via-transparent to-[#8A4A32]/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="relative h-105 overflow-hidden rounded-[1.25rem] md:h-125">
                  <Image
                    src="/first.jpeg"
                    alt="A beautifully styled look"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-medium uppercase tracking-[0.25em] text-white/80 backdrop-blur">
                    Signature finish
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-lg">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Refined, radiant, and unforgettable</p>
                        <p className="mt-1 text-sm text-white/70">Every detail tailored to your energy.</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-[#C4705B]/20 px-3 py-2 text-[#ffd8c8]">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
