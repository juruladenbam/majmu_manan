# Majmu' Manan

**Majmu' Manan** adalah aplikasi bacaan wirid yang dirancang untuk keluarga besar (lingkaran internal), terinspirasi dari **NU Online**. Aplikasi ini menyediakan pengalaman membaca konten agama secara offline dan online melalui Progressive Web App (PWA).

## 🎯 Tujuan & Fitur Utama

- **Progressive Web App (PWA)** - Dapat diakses melalui browser dan dipasang seperti aplikasi asli
- **Fitur Offline** - Menyediakan layanan bacaan tanpa koneksi internet menggunakan Service Worker
- **Navigasi Swipe** - Fleksibel berdasarkan struktur bacaan (bab atau scroll biasa)
- **Personalisasi Tamu** - Simpan penanda buku dan preferensi dalam penyimpanan lokal
- **Admin Panel** - CMS untuk mengelola konten bacaan

## 🛠️ Teknologi & Arsitektur

### Backend
- **Laravel 12** (API Only)
- **MySQL** database
- **L5-Swagger** untuk dokumentasi API
- **Laravel Sanctum** untuk otentikasi admin

### Frontend
- **React JS** dengan TypeScript
- **Vite** sebagai bundler
- **Chakra UI v3** untuk komponen UI
- **React Query (TanStack Query)** untuk manajemen state
- **React Router** untuk navigasi
- **Framer Motion** untuk animasi

### Arsitektur
- **Monorepo** dengan PNPM Workspaces
- **Feature-Based Architecture** - Kode dikelompokkan berdasarkan fitur bisnis
- **Shared Library** - Tipe TypeScript, utilitas, dan komponen bersama

## 🏗️ Struktur Proyek

```
majmu-manan/
├── backend/              # Laravel API backend
├── admin-panel/          # Aplikasi CMS admin
├── public-app/           # Aplikasi PWA untuk pengguna
├── shared-lib/           # Tipe, utilitas, dan komponen bersama
├── docs/                 # Dokumentasi arsitektur
└── ...
```

## 🚀 Instalasi & Pengaturan

### Prasyarat
- Node.js (versi terbaru)
- PHP 8.2+
- MySQL
- PNPM (direkomendasikan)

### Langkah Instalasi

1. Clone repositori:
   ```bash
   git clone [URL_REPOSITORI]
   cd majmu-manan
   ```

2. Install dependensi:
   ```bash
   pnpm install
   ```

3. Konfigurasi backend:
   ```bash
   cd backend
   cp .env.example .env
   # Sesuaikan konfigurasi database di .env
   composer install
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   ```

4. Konfigurasi frontend:
   - Di direktori `admin-panel` dan `public-app`, sesuaikan file `.env` dengan URL backend

### Jalankan Aplikasi

Jalankan masing-masing aplikasi dalam terminal terpisah:

```bash
# Backend
cd backend && php artisan serve

# Admin Panel
cd admin-panel && pnpm dev

# Public App
cd public-app && pnpm dev
```

Atau gunakan skrip workspace:
```bash
pnpm dev:admin    # Hanya admin panel
pnpm dev:public   # Hanya public app
```

## 🧪 Testing

Run tests untuk seluruh proyek:
```bash
# Backend
cd backend && php artisan test

# Frontend
cd admin-panel && pnpm test
cd public-app && pnpm test
```

## 🔧 Development Workflow

### Struktur Fitur Berbasis
Kode dikelola dalam struktur fitur berbasis:

```
src/features/reader/
├── api/           # Endpoint API
├── components/    # Komponen UI spesifik fitur
├── hooks/         # Hook kustom
├── types/         # Tipe lokal jika ada
└── index.ts       # Ekspor publik untuk fitur
```

### Penamaan Branch
Gunakan konvensi:
- `feature/nama-fitur` - Untuk fitur baru
- `bugfix/deskripsi-bug` - Untuk perbaikan bug
- `hotfix/urgent-fix` - Perbaikan mendesak

### Kontribusi
1. Buat branch baru: `git checkout -b feature/nama-fitur`
2. Lakukan perubahan dan commit: `git commit -m 'Tambah fitur: deskripsi fitur'`
3. Push ke branch: `git push origin feature/nama-fitur`
4. Buat pull request

## 📦 Deployment

### Produksi
1. Build aplikasi:
   ```bash
   pnpm build
   ```
2. Upload hasil build ke host produksi
3. Konfigurasi routing dan service worker untuk PWA
4. Pastikan `.htaccess` atau konfigurasi server menangani routing sisi klien

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan fork proyek ini, buat perubahan, dan kirim pull request. Pastikan untuk mengikuti pedoman dan gaya kode yang telah ditetapkan.

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detailnya.

---

**Majmu' Manan** - Dibangun dengan ❤️ untuk keluarga besar