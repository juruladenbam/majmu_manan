<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BacaanItem;
use Illuminate\Support\Facades\DB;

class CleanRotibulHaddad extends Command
{
    protected $signature = 'clean:rotibul-haddad {--dry-run : Preview changes without applying}';
    protected $description = 'Clean up Rotibul Haddad formatting with nice verse markers';

    private $bacaanId = 5; // Rotibul Haddad

    public function handle(): int
    {
        $this->info('🧹 Cleaning Rotibul Haddad formatting...');
        
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be saved');
        }
        
        DB::beginTransaction();
        
        try {
            $items = BacaanItem::where('bacaan_id', $this->bacaanId)->orderBy('urutan')->get();
            $this->info("Found {$items->count()} items");
            
            $cleaned = 0;
            
            foreach ($items as $item) {
                $original = $item->arabic;
                $text = $original;
                
                // Check if this is a Fatihah or Quran verse (contains specific patterns)
                $isQuranOrFatihah = $this->isQuranOrFatihah($text);
                
                if ($isQuranOrFatihah) {
                    // For Quran/Fatihah: use verse markers ۝
                    $text = preg_replace('/\.?\s*([١٢٣٤٥٦٧٨٩٠]+)\s*\.?\s*/u', ' ۝$1 ', $text);
                } else {
                    // For dzikir/doa: just remove the old numbering, keep clean
                    $text = preg_replace('/\.?\s*([١٢٣٤٥٦٧٨٩٠]+)\s*\.?\s*/u', '', $text);
                }
                
                // Common cleanup
                $text = str_replace('..', '.', $text);
                $text = preg_replace('/\s{2,}/u', ' ', $text);
                $text = preg_replace('/\s*<br>\s*/i', '<br>', $text);
                $text = trim($text);
                $text = preg_replace('/^\.+\s*/u', '', $text);
                $text = preg_replace('/^<br>/i', '', $text);
                
                if ($text !== $original) {
                    if (!$dryRun) {
                        $item->arabic = $text;
                        $item->save();
                    }
                    $cleaned++;
                    $type = $isQuranOrFatihah ? 'Quran/Fatihah' : 'Dzikir/Doa';
                    $this->line("   Cleaned ID: {$item->id} ({$type})");
                }
            }
            
            if ($dryRun) {
                DB::rollBack();
                $this->warn("💡 Would clean {$cleaned} items. Run without --dry-run to apply.");
            } else {
                DB::commit();
                $this->info("✅ Cleaned {$cleaned} items!");
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
    
    private function isQuranOrFatihah(string $text): bool
    {
        // Simpler patterns that indicate Quran or Fatihah (without complex harakat)
        $quranPatterns = [
            'الحمد لله رب العالمين',
            'الْحَمْدُ',
            'رَبِّ الْعَالَمِيْنَ',
            'مالك يوم الدين',
            'ماَلِكِ يَوْمِ',
            'إياك نعبد',
            'إِيِّاكَ نَعْبُدُ',
            'اهدنا الصراط',
            'اِهْدِنَا الصِّرَاطَ',
            'صراط الذين',
            'صِرَاطَ الَّذِيْنَ',
            'الله لا إله إلا هو الحي القيوم', // Ayat Kursi
            'اللَّهُ لَا إِلَٰهَ',
            'الْحَيُّ الْقَيُّومُ',
            'آمن الرسول',
            'آمَنَ الرَّسُوْلُ',
            'لله ما في السماوات',
            'لِّلَّهِ مَا فِي',
        ];
        
        foreach ($quranPatterns as $pattern) {
            if (mb_stripos($text, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }
}
