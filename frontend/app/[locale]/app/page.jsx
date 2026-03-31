"use client"
import { Navbar } from "@/components/Navbar";
import { AppWidget } from "@/components/AppWidget";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Clock, FolderTree, Shield, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
             {t("hero.badge")}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-foreground">
            {t("hero.title1")} <br className="hidden md:block"/>
            <span className="text-primary">{t("hero.titleHighlight")}</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => document.getElementById('app-widget')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all flex items-center gap-2"
            >
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> {t("hero.features.0", "Zaman Kazandırır")}</div>
            <div className="flex items-center gap-2"><FolderTree className="w-5 h-5 text-primary" /> {t("hero.features.1", "Klasör Yapısını Korur")}</div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> {t("hero.features.2", "Güvenli İşlem")}</div>
          </div>
        </section>

        {/* WIDGET SECTION */}
        <section className="py-12 px-4 bg-muted/30 border-y border-border">
          <AppWidget />
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 px-4 container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">{t("steps.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-border -z-10"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-2xl font-bold text-primary mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">{t("steps.step1.title")}</h3>
              <p className="text-muted-foreground text-balance">{t("steps.step1.desc")}</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-2xl font-bold text-primary mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">{t("steps.step2.title")}</h3>
              <p className="text-muted-foreground text-balance">{t("steps.step2.desc")}</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("steps.step3.title")}</h3>
              <p className="text-muted-foreground text-balance">{t("steps.step3.desc")}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-background text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
        <p>{t("footer.madeWith")}</p>
        <div className="flex items-center gap-4">
          <span className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">{t("footer.openSource")}</span>
        </div>
      </footer>
    </div>
  );
}
