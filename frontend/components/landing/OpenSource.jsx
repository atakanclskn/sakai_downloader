'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
  </svg>
);

export default function OpenSource({ stars }) {
  const t = useTranslations('OpenSource');

  return (
    <section className="py-32 bg-background border-t border-border/50 text-center">
      <div className="mx-auto max-w-[1100px] px-4 flex flex-col items-center justify-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="h-16 w-16 mb-8 rounded-full border border-border flex items-center justify-center bg-foreground/5 relative">
            <GithubIcon className="w-8 h-8 text-foreground" />
            {stars !== null && (
              <div className="absolute -top-2 -right-6 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-current" /> {stars}
              </div>
            )}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            {t('title')}
          </h2>
          
          <p className="text-lg text-foreground/60 mb-10 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
          
          <a
            href="https://github.com/atakanclskn/sakai_downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 items-center justify-center gap-2 bg-foreground px-8 font-semibold text-background transition-transform hover:-translate-y-1"
          >
            {t('starOnGithub')}
          </a>
        </motion.div>

      </div>
    </section>
  );
}