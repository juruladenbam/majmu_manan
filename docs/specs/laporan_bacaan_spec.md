# Spesifikasi Fitur Laporan Bacaan

## 1. Overview

Fitur ini memungkinkan pengguna publik (guest) untuk melaporkan kesalahan pada konten bacaan (bacaan, section, atau item) dengan dua opsi:
- **Benarkan Langsung**: User langsung mengisi koreksi yang diusulkan
- **Pakai Catatan**: User menambahkan catatan untuk perbaikan

## 2. entities

### 2.1 Laporan Bacaan (bacaan_reports)
| Field | Tipe | Deskripsi |
|-------|------|-----------|
| id | bigint | Primary key |
| bacaan_id | bigint | FK ke bacaans |
| pelapor_nama | varchar(255) | Nama pelapor (opsional) |
| pelapor_email | varchar(255) | Email pelapor (opsional) |
| kategori | enum | salah_ketik, teks_hilang, terjemahan_salah, lain_lain |
| jenis_laporan | enum | bacaan, section, item |
| target_id | bigint | ID section atau item (jika jenis_laporan = section/item) |
| field_koreksi | json | Field yang dikoreksi: arabic, latin, terjemahan, judul_section, judul, judul_arab, deskripsi |
| konten_asli | longtext | Konten sebelum koreksi |
| konten_koreksi | longtext | Konten koreksi yang diusulkan |
| status | enum | pending, disetujui, ditolak |
| created_at | timestamp | |
| updated_at | timestamp | |

## 3. API Endpoints

### Public (No Auth)
- `POST /api/reports` - Buat laporan baru

### Admin Protected
- `GET /api/admin/reports` - List semua laporan (with pagination, filter status)
- `GET /api/admin/reports/{id}` - Detail laporan
- `POST /api/admin/reports/{id}/setuju` - Setuju & apply koreksi
- `POST /api/admin/reports/{id}/tolak` - Tolak laporan
- `GET /api/admin/reports/count` - Count laporan pending (untuk badge)

## 4. User Interface - Public App

### 4.1 Item: Long Press
- Hold 500ms pada baris item → muncul dropdown "Lapor"
- Dropdown: [Benarkan Langsung] [Pakai Catatan]

### 4.2 Section: Menu Tiga Titik
- Icon ... di samping judul section
- Klik → dropdown: [Lapor Section] [Bookmark] dll
- Same flow: pilih Benarkan Langsung atau Pakai Catatan

### 4.3 Bacaan: Menu Tiga Titik
- Icon ... di header bacaan ( samping bookmark)
- Same flow

### 4.4 Form Laporan
- Modal dengan field:
  - Kategori: dropdown (Salah Ketik, Teks Hilang, Terjemahan Salah, Lainnya)
  - Nama (opsional): input text
  - Email (opsional): input email
  - Field dikoreksi: checkbox (arabic, latin, terjemahan) - untuk item
  - Untuk Section: checkbox (judul_section)
  - Untuk Bacaan: checkbox (judul, judul_arab, deskripsi)
  - Konten Sekarang: read-only display
  - Koreksi yang diusulkan: Rich Text Editor (Lexical, sama seperti admin)
  - Submit: button

## 5. User Interface - Admin Panel

### 5.1 Sidebar
- Menu "Laporan" dengan badge count (jika ada laporan pending)

### 5.2 Halaman Daftar Laporan
- Table dengan kolom: Tanggal, Jenis, Target, Kategori, Status, Aksi
- Filter: status (pending/disetujui/ditolak), jenis (bacaan/section/item)
- Sort: terbaru

### 5.3 Halaman Detail Laporan
- Info pelapor (nama, email - jika ada)
- Jenis laporan & target (link ke section/item yang dilaporkan)
- Kategori masalah
- Preview konten asli
- Preview koreksi (dalam rich editor - editable)
- Tombol: [Setuju] [Tolak]

### 5.4 Aksi Setuju
- Jika disetujui, update data asli:
  - Item: update arabic/latin/terjemahan sesuai field_koreksi
  - Section: update judul_section
  - Bacaan: update judul/judul_arab/deskripsi
- Update status laporan = 'disetujui'
- Refresh cache jika ada

### 5.5 Aksi Tolak
- Simpan laporan dengan status = 'ditolak'
- Data asli TIDAK berubah
