'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Platforms() {
  const t = useTranslations('Platforms');

  return (
    <section className="py-24 border-t border-border/50 bg-background flex flex-col items-center">
      <div className="mx-auto max-w-[1100px] px-4 text-center w-full">
        
        <p className="text-sm font-mono tracking-widest uppercase text-foreground/50 mb-8">
          {t('title')}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-8">
          <span className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium bg-foreground/5 text-foreground transition-colors hover:bg-foreground/10">
            {t('sakai')} <span className="ml-2 text-green-500">✓</span>
          </span>
          <span className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium bg-foreground/5 text-foreground transition-colors hover:bg-foreground/10">
            {t('moodle')} <span className="ml-2 text-green-500">✓</span>
          </span>
          <span className="inline-flex items-center rounded-full border border-border/30 px-4 py-2 text-sm font-medium text-foreground/40 opacity-70">
            {t('canvas')}
          </span>
          <span className="inline-flex items-center rounded-full border border-border/30 px-4 py-2 text-sm font-medium text-foreground/40 opacity-70">
            {t('blackboard')}
          </span>
        </div>

        <a 
          href="https://github.com/atakanclskn/sakai_downloader/pulls" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-foreground/50 hover:text-foreground transition-colors underline decoration-foreground/20 underline-offset-4"
        >
          {t('prPrompt')}
        </a>
        
      </div>
    </section>
  );
}