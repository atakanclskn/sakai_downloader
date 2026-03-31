'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Folder, Folders, FileArchive } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
  </svg>
);

export default function Hero() {
  const t = useTranslations('Hero');

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern z-0" />
      
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left: Text Content */}
        <motion.div 
          className="flex-1 text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={textVariants} className="mb-6 inline-flex items-center border border-border px-3 py-1 text-xs font-mono tracking-tight text-foreground/80 uppercase">
            {t('eyebrow')}
          </motion.div>
          
          <motion.h1 
            variants={textVariants}
            className="mb-8 font-bold leading-[1.1] tracking-tighter text-foreground"
            style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
          >
            {t('title')}
          </motion.h1>
          
          <motion.p 
            variants={textVariants}
            className="mb-10 max-w-xl text-lg text-foreground/70 leading-relaxed mx-auto md:mx-0"
          >
            {t('subtitle')}
          </motion.p>
          
          <motion.div variants={textVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link 
              href="/app" 
              className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2 bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:-translate-y-1"
            >
              {t('launchApp')}
            </Link>
            <a 
              href="https://github.com/atakanclskn/sakai_downloader" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2 border border-border bg-transparent px-8 font-medium transition-transform hover:-translate-y-1 hover:bg-foreground/5"
            >
              <GithubIcon className="h-4 w-4" />
              {t('github')}
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Abstract Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 w-full max-w-sm flex items-center justify-center h-[400px] border border-border/50 bg-background relative shadow-sm"
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* The animation: Folders converging into a zip */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: i === 0 ? -100 : i === 1 ? 0 : 100, 
                  y: i === 1 ? -100 : 0, 
                  opacity: 0,
                  scale: 0.5 
                }}
                animate={{ 
                  x: 0, 
                  y: 0, 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut" 
                }}
                className="absolute text-foreground/40"
              >
                <Folder strokeWidth={1} size={64} />
              </motion.div>
            ))}
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 0, 1.2, 1],
                opacity: [0, 0, 1, 1] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "circOut"
              }}
              className="absolute text-primary"
            >
              <FileArchive strokeWidth={1.5} size={80} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}