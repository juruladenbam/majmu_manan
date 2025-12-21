<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BacaanItem;
use Illuminate\Support\Facades\DB;

class FixQosidahRomadhon extends Command
{
    protected $signature = 'fix:qosidah-romadhon {--dry-run : Preview changes without applying}';
    protected $description = 'Fix Qosidah Romadhon text structure and formatting';

    public function handle(): int
    {
        $this->info('🔧 Fixing Qosidah Romadhon structure...');
        
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be saved');
        }
        
        DB::beginTransaction();
        
        try {
            // 1. Fix Item 122: Add ihdā' at the end
            $item122 = BacaanItem::find(122);
            if ($item122) {
                $this->info('📝 Item 122 (Surat Al-Qadr):');
                $this->line('   Original: ' . mb_substr($item122->arabic, -100));
                
                // Add ihdā' to the end of Surat Al-Qadr
                $newArabic122 = $item122->arabic;
                if (mb_strpos($newArabic122, 'لِلنَّبِيّ') === false) {
                    $newArabic122 = rtrim($newArabic122) . '<br>لِلنَّبِيِّ مُحَمَّدٍ الْهَادِي وَالْآلِ وَالصَّحْبِ';
                }
                
                $this->line('   New ending: ...لِلنَّبِيِّ مُحَمَّدٍ الْهَادِي وَالْآلِ وَالصَّحْبِ');
                
                if (!$dryRun) {
                    $item122->arabic = $newArabic122;
                    $item122->save();
                }
            }
            
            // 2. Fix Item 123: Remove ihdā' and separator, clean up bullets
            $item123 = BacaanItem::find(123);
            if ($item123) {
                $this->info('📝 Item 123 (Doa Ya Rabbana):');
                
                // Build the new clean text - start fresh with just the Ya Rabbana doa
                $newArabic123 = 'يَارَبَّنَا اقْبَلْنَا فِي شَهْرِنَا رَمَضَانْ<br>' .
                    'يَارَبَّنَا احْفَظْنَا فِي شَهْرِنَا رَمَضَانْ<br>' .
                    'يَارَبِّ سَامِحْنَا فِي شَهْرِنَا رَمَضَانْ<br>' .
                    'يَارَبِّ اغْفِرْ لَنَا فِي شَهْرِنَا رَمَضَانْ<br>' .
                    'يَارَبَّنَا ارْحَمْنَا فِي شَهْرِنَا رَمَضَانْ<br>' .
                    'يَارَبِّ عَامِلْنَا بِاللُّطْفِ وَالْإِحْسَانْ<br>' .
                    'يَارَبَّنَا ادْخِلْنَا فِي جَنَّةِ الرِّضْوَانْ<br>' .
                    'يَارَبِّ سَلِّمْنَا مِنْ لَهْبَةِ النِّيْرَانْ<br>' .
                    'يَارَبَّنَا انْفَعْنَا بِبَرَكَةِ الْقُرْآنْ<br>' .
                    'يَا سَلَامْ سَلِّمْنَا مِنْ عَوَائِقَ عَاقَتْنَا<br>' .
                    'يَا سَلَامْ اُكْتُبْ سَلَامًا بَيْنَ زَمْزَمَ وَالْمَقَامْ';
                
                $this->line('   Old: Had ihdā, separators, and bullet points');
                $this->line('   New: Clean Ya Rabbana doa only');
                
                if (!$dryRun) {
                    $item123->arabic = $newArabic123;
                    $item123->save();
                }
            }
            
            if ($dryRun) {
                DB::rollBack();
                $this->warn('💡 Run without --dry-run to apply changes');
            } else {
                DB::commit();
                $this->info('✅ Fixed Qosidah Romadhon structure!');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
