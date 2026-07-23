import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

// Import images directly so Vite processes them properly
import imgBurgerSpecial from '../assets/images/burger_special_1783940592831.jpg';
import imgCrispyChickenSalad from '../assets/images/crispy_chicken_salad_1783940611493.jpg';
import imgTerrace from '../assets/images/terrace.jpg';
import imgTwoCrispyPlates from '../assets/images/two_crispy_plates_1783940626341.jpg';
import imgBurger1 from '../assets/images/burger-1.jpg';
import imgCout from '../assets/images/Cout.jpg';

const images = [
  imgBurgerSpecial, // Poseben sočen burger s slanino
  imgCrispyChickenSalad, // Pohano s solato in skuto
  imgTerrace, // Terasa
  imgTwoCrispyPlates, // Dva krožnika pohanega
  imgBurger1, // Burger od blizu
  imgCout  // Barvna zunanjost / terasa
];

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="py-20 bg-brand-surface border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif italic font-normal text-brand-gold mb-6"
          >
            {t.gallery.title}
          </motion.h2>
          <div className="w-16 h-[1px] bg-brand-gold-muted mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-brand-border p-[1px]">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden bg-brand-bg group"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
