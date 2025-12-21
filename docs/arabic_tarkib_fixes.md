# Laporan Perbaikan Tarkib Teks Arab
## Majmu' Manan - Desember 2025

---

## Ringkasan
- **Total items dianalisis**: 125
- **Kesalahan ditemukan**: 8
- **Items diperbaiki**: 7
- **Status**: ✅ Selesai

---

## Daftar Kesalahan & Perbaikan

### 1. Typo: Huruf Hilang
- **Item ID**: 11
- **Bacaan**: Wasilah Fatihah
- **Section**: Tanpa Section
- **Salah**: `وَالْوَتِ عَلَى`
- **Benar**: `وَالْمَوْتِ عَلَى`
- **Keterangan**: Huruf م (mim) hilang. Makna: "dan kematian atas..."

---

### 2. I'rab (Harakat) Salah
- **Item ID**: 88
- **Bacaan**: Rotibul Haddad
- **Section**: Tanpa Section
- **Salah**: `الْنبيّ العَلَيْه`
- **Benar**: `النَّبِيِّ عَلَيْهِ`
- **Keterangan**: Harakat pada ي dan هـ harus kasrah

---

### 3. Nama Sahabat Salah
- **Item ID**: 103
- **Bacaan**: Sholawat Nariyah
- **Section**: Tanpa Section
- **Salah**: `عُمَانَ ابْنِ عَفَّان`
- **Benar**: `عُثْمَانَ ابْنِ عَفَّان`
- **Keterangan**: عمان (Oman) → عثمان (Utsman bin Affan)

---

### 4. Typo: Huruf Mirip Tertukar
- **Item ID**: 104
- **Bacaan**: Sholawat Nariyah
- **Section**: Tanpa Section
- **Salah**: `المُحْتَهدِينَ`
- **Benar**: `الْمُجْتَهِدِينَ`
- **Keterangan**: ح → ج (ha → jim). Makna: "para mujtahid"

---

### 5. Typo: Ejaan Salah
- **Item ID**: 104
- **Bacaan**: Sholawat Nariyah
- **Section**: Tanpa Section
- **Salah**: `مُقَادِيهِمْ`
- **Benar**: `مُقَدِّمِيهِمْ`
- **Keterangan**: Ejaan kata salah

---

### 6. Nama Tarekat Salah
- **Item ID**: 105
- **Bacaan**: Sholawat Nariyah
- **Section**: Tanpa Section
- **Salah**: `النَّفْسَبَنْدِيَّة`
- **Benar**: `النَّقْشَبَنْدِيَّة`
- **Keterangan**: ف→ق, س→ش. Tarekat Naqsyabandiyah

---

### 7. Nama Ulama Salah
- **Item ID**: 107
- **Bacaan**: Sholawat Nariyah
- **Section**: Tanpa Section
- **Salah**: `زَمْرَحِي`
- **Benar**: `زَمْرَجِي`
- **Keterangan**: ح → ج. Kiai Zamraji Syirazi

---

### 8. Typo: Huruf Hilang (Duplikat)
- **Item ID**: 110
- **Bacaan**: Sholawat Nariyah
- **Section**: Tanpa Section
- **Salah**: `وَالْوَتِ عَلَى`
- **Benar**: `وَالْمَوْتِ عَلَى`
- **Keterangan**: Huruf م (mim) hilang. Sama dengan Item #11

---

## Perbaikan Qosidah Romadhon (Item 122-125)

### 8. Surat Al-Qadr - Typo (Item 122)
- **Bacaan**: Doa Birrulwalidain, Qosidah Romadhon
- **Section**: Qosidah Romadhon
- **Perbaikan**:
  - `الْمَلَبِكَةُ` → `الْمَلَائِكَةُ` (malaikat)
  - `سَلَمُ` → `سَلَامٌ` (salam)
  - `أَدْرِيكَ` → `أَدْرَاكَ` (i'rab)
  - Ihdā' dipindahkan ke akhir surat

### 9. Doa Ya Rabbana - Format (Item 123)
- **Perbaikan**: Dihapus garis pemisah, bullet points, dan penomoran

### 10. Surat Al-Kautsar - Typo (Item 124)
- **Perbaikan**: `الْاَبْتَر` → `الْأَبْتَرُ`

### 11. Doa Ya Allah - Format (Item 125)
- **Perbaikan**:
  - Dihapus `*` bullets dan `..٢` markers
  - Diperbaiki harakat dan spacing

---

## Tools

### Artisan Command
```bash
# Analisis saja
php artisan arabic:analyze

# Analisis + export CSV
php artisan arabic:analyze --export

# Analisis + perbaiki
php artisan arabic:analyze --fix
```

### SQL untuk phpMyAdmin
- File: `database/sql/fix_tarkib_production.sql`

---

*Dokumen ini dibuat: 21 Desember 2025*
