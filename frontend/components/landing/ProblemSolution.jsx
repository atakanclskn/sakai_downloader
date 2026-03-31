'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MousePointerClick, RefreshCcw, HandCoins } from 'lucide-react';

export default function ProblemSolution() {
  const t = useTranslations('ProblemSolution');

  return (
    <section className="py-24 border-y border-border/50 bg-background/50">
      <div className="mx-auto max-w-[1100px] px-4 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border/50">
        
        {/* Before */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start pr-0 md:pr-16 pb-12 md:pb-0"
        >
          <span className="text-xs font-mono font-bold text-destructive uppercase tracking-widest mb-4">
            {t('beforeTitle')}
          </span>
          <p className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground/50 leading-snug">
            {t('beforeText')}
          </p>
        </motion.div>

        {/* After */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-start pl-0 md:pl-16 pt-12 md:pt-0"
        >
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            {t('afterTitle')}
          </span>
          <p className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-snug">
            {t('afterText')}
          </p>
        </motion.div>

      </div>
    </section>
  );
}