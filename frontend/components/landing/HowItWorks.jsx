'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const t = useTranslations('HowItWorks');

  const steps = [
    { num: "01", titleKey: "step1Title", textKey: "step1Text" },
    { num: "02", titleKey: "step2Title", textKey: "step2Text" },
    { num: "03", titleKey: "step3Title", textKey: "step3Text" }
  ];

  return (
    <section className="py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-4">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold tracking-tight mb-20 md:mb-24"
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col"
            >
              <span className="text-6xl font-sans tracking-tighter text-border font-bold mb-6 select-none -ml-1">
                {step.num}
              </span>
              <h3 className="text-xl font-semibold mb-3 text-foreground tracking-tight">
                {t(step.titleKey)}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {t(step.textKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}