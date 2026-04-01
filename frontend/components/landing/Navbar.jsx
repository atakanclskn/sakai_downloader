'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileArchive, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['var(--background)', 'var(--background)'] // Will use backdrop blur in styles
  );
  
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        borderColor: `hsla(var(--border) / ${borderOpacity})`
      }}
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight">
          <FileArchive className="h-6 w-6 text-primary" />
          <span className="text-xl">SakaiGrab</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href="https://github.com/atakanclskn/sakai_downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {t('github')}
          </a>
          <Link
            href={`/${locale}/app`}
            className="inline-flex h-9 items-center justify-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
          >
            {t('launchApp')}
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-16 w-full border-b border-border/10 bg-background/95 backdrop-blur px-4 py-6 md:hidden flex flex-col space-y-4">
          <LanguageSwitcher />
          <a
            href="https://github.com/atakanclskn/sakai_downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground/80"
          >
            {t('github')}
          </a>
          <Link
            href={`/${locale}/app`}
            className="inline-flex h-10 items-center justify-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow"
            onClick={() => setIsOpen(false)}
          >
            {t('launchApp')}
          </Link>
        </div>
      )}
    </motion.header>
  );
}