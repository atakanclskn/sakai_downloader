import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ProblemSolution from '@/components/landing/ProblemSolution';
import HowItWorks from '@/components/landing/HowItWorks';
import Platforms from '@/components/landing/Platforms';
import Security from '@/components/landing/Security';
import OpenSource from '@/components/landing/OpenSource';
import Footer from '@/components/landing/Footer';
import { getGithubStars } from '@/lib/github';
import { setRequestLocale } from 'next-intl/server';

export default async function LandingPage({ params: { locale } }) {
  setRequestLocale(locale);
  const stars = await getGithubStars();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Platforms />
        <ProblemSolution />
        <HowItWorks />
        <Security />
        <OpenSource stars={stars} />
      </main>
      <Footer />
    </div>
  );
}