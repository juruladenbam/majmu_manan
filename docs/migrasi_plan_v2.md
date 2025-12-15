Berikut adalah SQL Script Lengkap yang dibagi menjadi dua bagian:
    1. DDL (Data Definition Language): Membuat tabel baru.
    2. DML (Data Manipulation Language): Memindahkan (migrasi) data lama ke tabel baru dengan logika pemisahan Section (Bab) dan Item (Isi).

## BAGIAN 1: Membuat Struktur Baru (Schema V2)
```sql
-- 1. Buat Tabel Sections (Untuk Bab/Fasal/Pengelompokan)
CREATE TABLE `bacaan_sections` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `bacaan_id` int NOT NULL, -- Masih menggunakan INT menyesuaikan tabel bacaans lama
  `judul_section` varchar(255) DEFAULT NULL, -- Contoh: "Mukadimah", "Bab 1"
  `slug_section` varchar(255) DEFAULT NULL,  -- Nanti di-generate via aplikasi/admin
  `urutan` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bacaan_sections_bacaan_id_index` (`bacaan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Buat Tabel Items (Untuk Ayat/Baris per halaman)
CREATE TABLE `bacaan_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `bacaan_id` int NOT NULL,
  `section_id` bigint UNSIGNED NULL, -- NULLABLE, jika bacaan tidak punya bab
  `urutan` int NOT NULL DEFAULT 0,
  
  -- Konten
  `arabic` longtext COLLATE utf8mb4_unicode_ci,      -- Arab Berharakat
  `latin` longtext COLLATE utf8mb4_unicode_ci,       -- Transliterasi (Perlu diisi nanti)
  `terjemahan` longtext COLLATE utf8mb4_unicode_ci,  -- Arti Bahasa Indonesia
  
  -- Metadata Tampilan
  `tipe_tampilan` enum('text', 'syiir', 'judul_tengah', 'image', 'keterangan') DEFAULT 'text',
  `note_kaki` text COLLATE utf8mb4_unicode_ci,
  
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bacaan_items_bacaan_id_index` (`bacaan_id`),
  KEY `bacaan_items_section_id_index` (`section_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## BAGIAN 2: Script Migrasi Otomatis (Old -> New)
Script ini menggunakan logika:

Jika data lama punya segmen_parent, itu akan dianggap sebagai Section.

Baris data lama yang isinya hanya "Judul" (Arab kosong, Indonesia ada) akan dijadikan Judul Section.

Sisanya akan dimasukkan sebagai Item.

```sql
-- STEP A: Migrasi Data 'Header/Bab' ke tabel `bacaan_sections`
-- Kita ambil data yang memiliki segmen_parent unik dari tabel lama
INSERT INTO `bacaan_sections` (bacaan_id, judul_section, urutan, created_at)
SELECT 
    DISTINCT b.bacaan_id, 
    -- Mencoba mengambil judul bab dari baris yang Arab-nya kosong di grup tersebut (jika ada)
    (SELECT d.ina FROM bacaan_details d 
     WHERE d.bacaan_id = b.bacaan_id 
     AND d.segmen_parent = b.segmen_parent 
     AND (d.arb IS NULL OR d.arb = '') 
     LIMIT 1) as judul_temp,
    CAST(b.segmen_parent AS UNSIGNED) as urutan_baru, -- Konversi string '1' jadi integer 1
    NOW()
FROM bacaan_details b
WHERE b.segmen_parent IS NOT NULL 
AND b.segmen_parent != '0' -- Mengabaikan segmen 0 jika itu bukan bab
GROUP BY b.bacaan_id, b.segmen_parent;

-- Update Judul Section yang masih NULL (Default ke "Bagian X")
UPDATE bacaan_sections 
SET judul_section = CONCAT('Bagian ', urutan) 
WHERE judul_section IS NULL;


-- STEP B: Migrasi Data 'Isi/Konten' ke tabel `bacaan_items`
-- 1. Migrasi item yang PUNYA Section (Parent)
INSERT INTO `bacaan_items` (bacaan_id, section_id, urutan, arabic, terjemahan, tipe_tampilan, created_at)
SELECT 
    d.bacaan_id,
    s.id as section_id,
    CAST(d.segmen_child AS UNSIGNED) as urutan_item,
    d.arb,
    d.ina,
    CASE 
        WHEN d.is_syiir = 1 THEN 'syiir' 
        ELSE 'text' 
    END as tipe,
    NOW()
FROM bacaan_details d
JOIN bacaan_sections s 
    ON d.bacaan_id = s.bacaan_id 
    AND d.segmen_parent = CAST(s.urutan AS CHAR) -- Mapping parent lama ke section baru
WHERE d.arb IS NOT NULL AND d.arb != ''; -- Hanya ambil yang ada konten Arabnya (bukan header)

-- 2. Migrasi item yang TIDAK PUNYA Section (Parent NULL / Flat)
INSERT INTO `bacaan_items` (bacaan_id, section_id, urutan, arabic, terjemahan, tipe_tampilan, created_at)
SELECT 
    d.bacaan_id,
    NULL, -- Tidak masuk section manapun
    CAST(COALESCE(d.segmen_child, d.id_bacaan_detail) AS UNSIGNED),
    d.arb,
    d.ina,
    'text',
    NOW()
FROM bacaan_details d
WHERE d.segmen_parent IS NULL 
   OR (d.segmen_parent = '0' AND NOT EXISTS (SELECT 1 FROM bacaan_sections s WHERE s.bacaan_id = d.bacaan_id AND s.urutan = 0));
```