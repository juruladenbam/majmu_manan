<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Tarkib fixes mapping: wrong => correct
     */
    private array $tarkibFixes = [
        // Basmalah corrections
        'الرًّحْمَنِ الَّحِيْمِ' => 'الرَّحْمٰنِ الرَّحِيْمِ',
        'الرًّحْمنِ الرَّحِيْمِ' => 'الرَّحْمٰنِ الرَّحِيْمِ',
        
        // Sahabat name corrections
        'عُمَانَ ابْنِ عَفَّان' => 'عُثْمَانَ ابْنِ عَفَّان',
        'سَيّدِنَا عُمَانَ' => 'سَيّدِنَا عُثْمَانَ',
        
        // Tarekat name corrections
        'النَّفْسَبَنْدِيَّةِ' => 'النَّقْشَبَنْدِيَّةِ',
        'النَّفْسَبَنْدِيَّة' => 'النَّقْشَبَنْدِيَّة',
        'النَّفْسَبَنْدِي' => 'النَّقْشَبَنْدِي',
        
        // Scholar name corrections
        'السَّفَطِي' => 'السَّقَطِي',
        'زَمْرَحِي' => 'زَمْرَجِي',
        
        // Common typos
        'المُحْتَهدِينَ' => 'الْمُجْتَهِدِينَ',
        'المُحْتَهدِيْنَ' => 'الْمُجْتَهِدِيْنَ',
        'مُقَادِيهِمْ' => 'مُقَدِّمِيهِمْ',
        'وَالْوَتِ عَلَى' => 'وَالْمَوْتِ عَلَى',
        
        // I'rab corrections
        'الْنبيّ العَلَيْه' => 'النَّبِيِّ عَلَيْهِ',
        'عَلِيٍّ بْنٍ اَبِي طِالِبْ' => 'عَلِيِّ بْنِ أَبِي طَالِبٍ',
        
        // Muhammad name harakat
        'مُحُمَّدٍ' => 'مُحَمَّدٍ',
        'مُحُمَّدٌ' => 'مُحَمَّدٌ',
        'مُحُمَّدًا' => 'مُحَمَّدًا',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create backup table first
        DB::statement('CREATE TABLE IF NOT EXISTS bacaan_items_backup_tarkib AS SELECT * FROM bacaan_items WHERE 1=0');
        
        // Backup only items that will be changed
        $itemsToBackup = [];
        foreach ($this->tarkibFixes as $wrong => $correct) {
            $results = DB::table('bacaan_items')
                ->whereNotNull('arabic')
                ->where('arabic', 'LIKE', "%{$wrong}%")
                ->pluck('id')
                ->toArray();
            $itemsToBackup = array_merge($itemsToBackup, $results);
        }
        
        $itemsToBackup = array_unique($itemsToBackup);
        
        if (!empty($itemsToBackup)) {
            DB::statement("INSERT INTO bacaan_items_backup_tarkib SELECT * FROM bacaan_items WHERE id IN (" . implode(',', $itemsToBackup) . ")");
        }
        
        // Apply fixes
        $totalFixed = 0;
        foreach ($this->tarkibFixes as $wrong => $correct) {
            $affected = DB::table('bacaan_items')
                ->whereNotNull('arabic')
                ->where('arabic', 'LIKE', "%{$wrong}%")
                ->update([
                    'arabic' => DB::raw("REPLACE(arabic, '{$wrong}', '{$correct}')")
                ]);
            $totalFixed += $affected;
        }
        
        // Log the changes
        \Log::info("Arabic Tarkib Migration: Fixed {$totalFixed} occurrences in " . count($itemsToBackup) . " items.");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore from backup
        $backupExists = DB::select("SHOW TABLES LIKE 'bacaan_items_backup_tarkib'");
        
        if (!empty($backupExists)) {
            $backupItems = DB::table('bacaan_items_backup_tarkib')->get();
            
            foreach ($backupItems as $item) {
                DB::table('bacaan_items')
                    ->where('id', $item->id)
                    ->update(['arabic' => $item->arabic]);
            }
            
            DB::statement('DROP TABLE IF EXISTS bacaan_items_backup_tarkib');
        }
    }
};
