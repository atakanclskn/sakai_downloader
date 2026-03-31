'use client';

import { useTranslations } from 'next-intl';
import { FileArchive } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-border/50 bg-background py-16">
      <div className="mx-auto max-w-[1100px] px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center space-x-2 font-bold tracking-tight opacity-50">
            <FileArchive className="h-5 w-5 text-primary grayscale" />
            <span className="text-lg">SakaiGrab</span>
          </div>
          <p className="text-sm font-mono text-foreground/40">
            {t('tagline')}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-6">
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <ThemeToggle />
            <a 
              href="https://github.com/atakanclskn/sakai_downloader"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/50 hover:text-foreground transition-colors font-medium"
            >
              GitHub
            </a>
          </div>
          
          <a 
            href="https://atakanclskn.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold tracking-widest text-foreground/30 hover:text-primary transition-colors"
          >
            {t('designedBy')}
          </a>
        </div>
        
      </div>
    </footer>
  );
}