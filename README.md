# Sakai Toplu Icerik Indirici

Dokuz Eylul Sakai (ve benzer Sakai kurulumlari) icin gelistirilmis, secili derslerin tum iceriklerini tek ZIP dosyasi olarak indiren full-stack uygulama.

## Ozellikler

- Sakai giris bilgileriyle oturum acma
- Ders listesini otomatik cekme
- Secili derslerin tum kaynaklarini tarama
- Tum dosyalari tek ZIP dosyasinda birlestirme
- Modern, mobil uyumlu landing + panel arayuzu

## Mimari

- `frontend/`: React + Vite istemci
- `backend/`: Express API + Playwright tabanli Sakai baglanti katmani

## 1) Backend Kurulum

```powershell
cd backend
copy .env.example .env
npm install
npx playwright install chromium
npm run dev
```

Backend varsayilan olarak `http://localhost:4000` adresinde calisir.

## 2) Frontend Kurulum

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend varsayilan olarak `http://localhost:5173` adresinde calisir.

## API Ozet

- `POST /api/auth/login`
  - body: `{ "username": "...", "password": "...", "baseUrl": "https://online.deu.edu.tr" }`
  - response: `sessionId`, `courses[]`

- `POST /api/download`
  - body: `{ "sessionId": "...", "courseIds": ["..."] }`
  - response: `downloadId`, `fileName`, `warnings[]`

- `GET /api/download/:downloadId?sessionId=...`
  - ZIP dosyasini indirir.

## Onemli Notlar

- Bu proje, kullanici girisini otomatiklestirmek icin Playwright kullanir.
- Kurumunuz SSO, MFA veya ek guvenlik adimlari kullaniyorsa login akisi uyarlama gerektirebilir.
- ZIP olusturma asamasinda indirilemeyen dosyalar varsa `rapor.txt` icinde listelenir.
- Oturum ve zip artifact bilgileri bellek uzerinde tutulur; uygulama yeniden baslayinca sifirlanir.

## Gelistirme Fikirleri

- Redis ile dagitik session/artifact yönetimi
- Kuyruk sistemi (BullMQ) ile asenkron buyuk indirmeler
- Sifre yerine kurum token/sso callback destegi
- Kullanici bazli gecmis indirme listesi
