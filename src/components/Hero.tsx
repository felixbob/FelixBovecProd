import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

import imgBvout from '../images/BVout.png';
const logoImg = '/felixFIN.png';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-bg">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imgBvout} 
          alt="Felix Bovec Exterior" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/30 via-brand-bg/50 to-brand-bg z-10" />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pt-24 pb-8 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Main Logo */}
          <div className="mb-6 sm:mb-8 inline-flex items-center justify-center h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
            <img src={logoImg} alt="Felix Logo" className="h-full w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }} />
              <h1 className="hidden text-5xl lg:text-7xl tracking-tighter text-brand-text mb-0 font-sans font-bold">FELIX</h1>
          </div>
          
          <h2 className="text-xl md:text-3xl text-brand-text mb-6 drop-shadow-lg max-w-2xl mx-auto font-serif italic font-normal">
            {t.hero.subtitle}
          </h2>

          {/* Winter break & thank you notice badge */}
          <a
            href="#zahvala"
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs sm:text-sm font-medium tracking-wide hover:bg-brand-gold/25 transition-all shadow-lg backdrop-blur-sm group"
          >
            <span>❄️</span>
            <span>{t.notice.badge}</span>
            <span className="opacity-60">&bull;</span>
            <span className="underline group-hover:text-white transition-colors">{t.notice.title}</span>
          </a>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#zahvala"
              className="inline-flex items-center gap-2 bg-brand-gold text-black px-8 py-3.5 rounded-sm font-bold uppercase tracking-[1px] text-xs sm:text-sm transition-all hover:brightness-110 shadow-xl"
            >
              <span>{t.notice.title}</span>
            </a>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 border border-white/20 bg-black/40 text-brand-text hover:border-brand-gold hover:text-brand-gold px-8 py-3.5 rounded-sm font-bold uppercase tracking-[1px] text-xs sm:text-sm transition-all shadow-xl"
            >
              {t.hero.cta}
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-brand-gold opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
           animate={{ y: [0, 10, 0] }}
           transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
}
