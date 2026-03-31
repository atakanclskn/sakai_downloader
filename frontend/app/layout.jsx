import "./globals.css";

export const metadata = {
  title: "Sakai Toplu Icerik Indirici",
  description: "DEU Sakai ders iceriklerini secili dersler icin tek ZIP dosyasinda indirir."
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
