import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "Sakai Downloader - DEU",
  description: "Ders materyallerinizi tek tıkla topluca indirin. Üniversite hayatınızı kolaylaştırın.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
