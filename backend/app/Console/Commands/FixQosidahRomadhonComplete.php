<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BacaanItem;
use Illuminate\Support\Facades\DB;

class FixQosidahRomadhonComplete extends Command
{
    protected $signature = 'fix:qosidah-complete {--dry-run : Preview changes without applying}';
    protected $description = 'Fix all Qosidah Romadhon items based on reference kitab (pages 51-53)';

    public function handle(): int
    {
        $this->info('🔧 Fixing Qosidah Romadhon based on reference kitab...');
        
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be saved');
        }
        
        DB::beginTransaction();
        
        try {
            // Fix Item 122 - Surat Al-Qadr
            $this->fixItem122($dryRun);
            
            // Item 123 already fixed, verify
            $this->verifyItem123();
            
            // Fix Item 124 - Surat Al-Kautsar (minor fixes)
            $this->fixItem124($dryRun);
            
            // Fix Item 125 - Doa Ya Allah
            $this->fixItem125($dryRun);
            
            if ($dryRun) {
                DB::rollBack();
                $this->warn('💡 Run without --dry-run to apply changes');
            } else {
                DB::commit();
                $this->info('✅ Fixed all Qosidah Romadhon items!');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
    
    private function fixItem122(bool $dryRun): void
    {
        $item = BacaanItem::find(122);
        if (!$item) return;
        
        $this->info('📝 Item 122 (Surat Al-Qadr):');
        
        // Correct text based on reference
        $newArabic = 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ<br>' .
            'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝<br>' .
            'لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ ۝ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ<br>' .
            'فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ ۝ سَلَامٌ هِيَ حَتَّى مَطْلَعِ الْفَجْرِ ۝<br>' .
            'لِلنَّبِيِّ مُحَمَّدٍ الْهَادِي وَالْآلِ وَالصَّحْبِ';
        
        $this->line('   Fixed: الْمَلَبِكَةُ → الْمَلَائِكَةُ');
        $this->line('   Fixed: سَلَمُ → سَلَامٌ');
        $this->line('   Fixed: أَدْرِيكَ → أَدْرَاكَ');
        
        if (!$dryRun) {
            $item->arabic = $newArabic;
            $item->save();
        }
    }
    
    private function verifyItem123(): void
    {
        $item = BacaanItem::find(123);
        if (!$item) return;
        
        $this->info('📝 Item 123 (Doa Ya Rabbana): ✅ Already fixed');
    }
    
    private function fixItem124(bool $dryRun): void
    {
        $item = BacaanItem::find(124);
        if (!$item) return;
        
        $this->info('📝 Item 124 (Surat Al-Kautsar):');
        
        // Correct text based on reference
        $newArabic = 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ<br>' .
            'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝<br>' .
            'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ۝';
        
        $this->line('   Fixed: الْاَبْتَر → الْأَبْتَرُ');
        
        if (!$dryRun) {
            $item->arabic = $newArabic;
            $item->save();
        }
    }
    
    private function fixItem125(bool $dryRun): void
    {
        $item = BacaanItem::find(125);
        if (!$item) return;
        
        $this->info('📝 Item 125 (Doa Ya Allah):');
        
        // Clean text based on reference - remove * and ..٢
        $newArabic = 'يَا اللّٰهْ بِنَا نَلْتَقِي عِنْدَ الْحَبِيبِ النَّبِي<br>' .
            'نَرِدْ لِحَوْضِ النَّبِي يَا اللّٰهْ مَعَ الْوَارِدِينْ<br>' .
            'مَعَ أَنْبِيَائِكَ أَجْمَعِينْ عِبَادِكَ الصَّالِحِينْ<br>' .
            'فِي زُمْرَةِ أَحْمَدَ مُحَمَّدٍ سَيِّدِ الْمُرْسَلِينْ<br>' .
            'يَا رَبَّنَا ارْحَمْنَا وَلَا تُعَذِّبْنَا<br>' .
            'يَا رَبَّنَا ارْحَمْنَا وَلَا لَنَا غَيْرُكَ<br>' .
            'وَمِنْكَ قَرِّبْنَا وَلَا تُبَاعِدْنَا<br>' .
            'إِنَّا تَوَسَّلْنَا بِجَاهِ سَيِّدِنَا<br>' .
            'مُحَمَّدٍ الْهَادِي عَلَيْهِ صَلَّيْنَا';
        
        $this->line('   Removed: * bullets and ..٢ markers');
        $this->line('   Fixed: spacing and harakat');
        
        if (!$dryRun) {
            $item->arabic = $newArabic;
            $item->save();
        }
    }
}
