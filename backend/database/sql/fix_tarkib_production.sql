-- =====================================================
-- Fix Arabic Text Tarkib - Majmu Manan
-- Run this in phpMyAdmin on production database
-- =====================================================

-- BACKUP FIRST! (Optional but recommended)
-- CREATE TABLE bacaan_items_backup AS SELECT * FROM bacaan_items;

-- Begin Transaction
START TRANSACTION;

-- 1. Fix typo: والوت → والموت (missing mim)
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'وَالْوَتِ عَلَى', 'وَالْمَوْتِ عَلَى')
WHERE arabic LIKE '%وَالْوَتِ عَلَى%';

-- 2. Fix typo: المحتهدين → المجتهدين (ha → jim)
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'المُحْتَهدِينَ', 'الْمُجْتَهِدِينَ')
WHERE arabic LIKE '%المُحْتَهدِينَ%';

UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'المُحْتَهدِيْنَ', 'الْمُجْتَهِدِيْنَ')
WHERE arabic LIKE '%المُحْتَهدِيْنَ%';

-- 3. Fix typo: مقاديهم → مقدميهم
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'مُقَادِيهِمْ', 'مُقَدِّمِيهِمْ')
WHERE arabic LIKE '%مُقَادِيهِمْ%';

-- 4. Fix i'rab: النبيّ العليه → النبيِّ عليهِ
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'الْنبيّ العَلَيْه', 'النَّبِيِّ عَلَيْهِ')
WHERE arabic LIKE '%الْنبيّ العَلَيْه%';

-- 5. Fix sahabat name: عمان → عثمان (Utsman bin Affan)
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'عُمَانَ ابْنِ عَفَّان', 'عُثْمَانَ ابْنِ عَفَّان')
WHERE arabic LIKE '%عُمَانَ ابْنِ عَفَّان%';

UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'سَيّدِنَا عُمَانَ', 'سَيّدِنَا عُثْمَانَ')
WHERE arabic LIKE '%سَيّدِنَا عُمَانَ%';

UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'عُمَانَ ابْنِ', 'عُثْمَانَ ابْنِ')
WHERE arabic LIKE '%عُمَانَ ابْنِ%';

-- 6. Fix tarekat name: النفسبندي → النقشبندي (Naqsyabandiyah)
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'النَّفْسَبَنْدِيَّةِ', 'النَّقْشَبَنْدِيَّةِ')
WHERE arabic LIKE '%النَّفْسَبَنْدِيَّةِ%';

UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'النَّفْسَبَنْدِيَّة', 'النَّقْشَبَنْدِيَّة')
WHERE arabic LIKE '%النَّفْسَبَنْدِيَّة%';

UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'النَّفْسَبَنْدِي', 'النَّقْشَبَنْدِي')
WHERE arabic LIKE '%النَّفْسَبَنْدِي%';

-- 7. Fix ulama name: السفطي → السقطي (Al-Saqathi)
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'السَّفَطِي', 'السَّقَطِي')
WHERE arabic LIKE '%السَّفَطِي%';

-- 8. Fix ulama name: زمرحي → زمرجي (Kiai Zamraji)
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'زَمْرَحِي', 'زَمْرَجِي')
WHERE arabic LIKE '%زَمْرَحِي%';

-- 9. Fix i'rab: Ali bin Abi Thalib
UPDATE bacaan_items 
SET arabic = REPLACE(arabic, 'عَلِيٍّ بْنٍ اَبِي طِالِبْ', 'عَلِيِّ بْنِ أَبِي طَالِبٍ')
WHERE arabic LIKE '%عَلِيٍّ بْنٍ اَبِي طِالِبْ%';

-- Commit Transaction
COMMIT;

-- Verify (optional - run this to check)
-- SELECT id, LEFT(arabic, 100) FROM bacaan_items 
-- WHERE id IN (11, 88, 103, 104, 105, 107, 110);
