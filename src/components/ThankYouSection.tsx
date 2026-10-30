import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { Heart, Calendar, Snowflake, MapPin, ArrowRight } from 'lucide-react';

export default function ThankYouSection() {
  const { t } = useLanguage();

  return (
    <section id="zahvala" className="relative py-20 px-4 bg-brand-surface border-y border-brand-border overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-brand-gold/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-[2px] mb-6">
            <Snowflake size={14} className="animate-spin-slow" />
            <span>{t.notice.badge}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-brand-text mb-4 leading-tight">
            {t.notice.title}
          </h2>

          <p className="text-brand-gold font-serif italic text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            {t.notice.subtitle}
          </p>

          {/* Message card */}
          <div className="bg-brand-bg/80 border border-brand-border p-6 sm:p-10 rounded-sm shadow-2xl max-w-3xl mx-auto text-left space-y-4 mb-10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-brand-gold mb-2">
              <Heart size={20} className="fill-brand-gold text-brand-gold" />
              <span className="text-xs uppercase tracking-widest font-sans font-bold">Felix Bovec</span>
            </div>
            <p className="text-brand-text opacity-90 leading-relaxed font-sans text-sm sm:text-base">
              {t.notice.text1}
            </p>
            <p className="text-brand-text opacity-90 leading-relaxed font-sans text-sm sm:text-base">
              {t.notice.text2}
            </p>

            <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between flex-wrap gap-4">
              <span className="font-serif italic text-brand-gold text-base sm:text-lg">
                {t.notice.team}
              </span>
              <span className="text-xs uppercase tracking-widest text-brand-text opacity-50 font-sans">
                Bovec, Mala vas
              </span>
            </div>
          </div>

          {/* Quick info boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-10">
            <div className="bg-brand-bg/50 border border-brand-border p-4 rounded-sm flex flex-col items-center">
              <Snowflake className="text-brand-gold mb-2" size={22} />
              <span className="text-[10px] uppercase tracking-widest text-brand-text opacity-60 mb-1">Status</span>
              <span className="text-sm font-semibold text-brand-text">{t.notice.status}</span>
            </div>

            <div className="bg-brand-bg/50 border border-brand-gold/40 p-4 rounded-sm flex flex-col items-center shadow-[0_0_15px_rgba(212,175,55,0.08)]">
              <Calendar className="text-brand-gold mb-2" size={22} />
              <span className="text-[10px] uppercase tracking-widest text-brand-gold mb-1">{t.notice.reopeningTitle}</span>
              <span className="text-sm font-bold text-brand-gold">{t.notice.reopeningDate}</span>
            </div>

            <div className="bg-brand-bg/50 border border-brand-border p-4 rounded-sm flex flex-col items-center">
              <MapPin className="text-brand-gold mb-2" size={22} />
              <span className="text-[10px] uppercase tracking-widest text-brand-text opacity-60 mb-1">Lokacija</span>
              <span className="text-sm font-semibold text-brand-text">Mala vas 16, Bovec</span>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 bg-brand-gold text-black px-6 py-3 rounded-sm font-bold uppercase tracking-[1px] text-xs transition-all hover:brightness-110 shadow-lg"
            >
              <span>{t.notice.seeMenu}</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-brand-border bg-brand-bg/60 text-brand-text hover:text-brand-gold hover:border-brand-gold/60 px-6 py-3 rounded-sm font-semibold uppercase tracking-[1px] text-xs transition-all"
            >
              <span>{t.nav.contact}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
