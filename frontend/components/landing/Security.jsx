'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Lock, ServerOff, Ghost } from 'lucide-react';

export default function Security() {
  const t = useTranslations('Security');

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="bg-[hsl(var(--security-bg))] text-[hsl(var(--security-fg))] py-32 px-4 selection:bg-primary selection:text-primary-foreground">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Lock className="w-12 h-12 text-primary mb-8" />
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-20 max-w-3xl leading-[1.1]">
            {t('title')}
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={itemVariants} className="flex flex-col">
            <ServerOff className="w-6 h-6 mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-3 tracking-tight">
              {t('point1Title')}
            </h3>
            <p className="text-[hsl(var(--security-fg))]/60 leading-relaxed text-sm">
              {t('point1Text')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col">
            <Ghost className="w-6 h-6 mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-3 tracking-tight">
              {t('point2Title')}
            </h3>
            <p className="text-[hsl(var(--security-fg))]/60 leading-relaxed text-sm">
              {t('point2Text')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col">
            {/* simple custom svg for closed tab */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <h3 className="text-xl font-bold mb-3 tracking-tight">
              {t('point3Title')}
            </h3>
            <p className="text-[hsl(var(--security-fg))]/60 leading-relaxed text-sm">
              {t('point3Text')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}