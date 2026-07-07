# NisanDavetiye

Nişan e-davetiyesi — DAL → BLL → API → UI katmanlı mimari.

## Proje yapısı

```
NisanDavetiye.sln
├── NisanDavetiye.DAL       Veritabanı, entity, repository
├── NisanDavetiye.BLL       İş kuralları, servisler
├── NisanDavetiye.API       REST API
└── NisanDavetiye.UI        React davetiye arayüzü + admin
```

## Çalıştırma

### 1. API (Visual Studio veya terminal)

```bash
cd NisanDavetiye.API
dotnet run
```

API: http://localhost:5279

### 2. UI

```bash
cd NisanDavetiye.UI
npm install
npm run dev
```

Davetiye linki admin panelinde görünür (`/admin` → **Davetiye Linki**).  
Ana sayfa (`/`) artık davetiyeyi göstermez; yalnızca `/i/{uid}` ile erişilir.

Admin: http://localhost:5173/admin

**Admin anahtarı:** Geliştirmede `appsettings.Development.json` içinde tanımlıdır.  
Canlı ortamda `Admin__ApiKey` ortam değişkeni veya User Secrets kullanın; anahtarı repoya yazmayın.

## Güvenlik

- Davetiye URL’si 32 karakterlik rastgele `uid` ile korunur (`/i/abc123…`)
- RSVP ve fotoğraf yükleme yalnızca geçerli davet anahtarı (`X-Davet-Key`) ile çalışır
- Admin işlemleri `X-Admin-Key` ile korunur
- Form isteklerinde IP başına dakikada 20 istek sınırı (rate limit)

## Medya dosyalarını değiştirme

Kendi resim, video ve müziğinizi şu klasöre koyun (aynı dosya adlarıyla üzerine yazın):

```
NisanDavetiye.UI/public/assets/
├── images/
│   ├── kapak.jpg
│   ├── cift.jpg
│   ├── zarf-arka.jpg
│   ├── galeri-1.jpg … galeri-4.jpg
├── video/
│   └── acilis.mp4
└── audio/
    └── muzik.mp3
```

Alternatif: Admin panelinden URL alanlarını güncelleyebilirsiniz.

## Özellikler

- Animasyonlu zarf + balmumu mührü
- Açılış videosu
- Arka plan müziği
- Kapak, hoş geldin, geri sayım
- Tarih, mekân, harita, gün akışı
- Fotoğraf galerisi
- RSVP formu
- Admin paneli + Excel dışa aktarma
- Davetiye ayarları düzenleme
