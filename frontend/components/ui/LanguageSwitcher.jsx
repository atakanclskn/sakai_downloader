'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { startTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'tr' : 'en';
    // When using custom middleware for i18n, typically you replace the locale in the path.
    // A simple hack when pathname starts with /en or /tr:
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={toggleLocale}
      className="inline-flex h-9 items-center justify-center space-x-2 text-sm font-medium transition-colors hover:bg-foreground/5 px-2 rounded-sm"
      aria-label="Switch language"
    >
      <span className="text-base">{locale === 'en' ? '🇹🇷' : '🇬🇧'}</span>
      <span className="uppercase text-foreground/80 hover:text-foreground">{locale === 'en' ? 'TR' : 'EN'}</span>
    </button>
  );
}