<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BacaanItem;
use App\Models\BacaanSection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FixRotibulHaddad extends Command
{
    protected $signature = 'fix:rotibul-haddad {--dry-run : Preview changes without applying}';
    protected $description = 'Reorganize Rotibul Haddad text with proper sections and formatting';

    private $bacaanId = 5; // Rotibul Haddad

    public function handle(): int
    {
        $this->info('🔧 Reorganizing Rotibul Haddad...');
        
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be saved');
        }
        
        DB::beginTransaction();
        
        try {
            // 1. Create new sections
            $sections = $this->createSections($dryRun);
            
            // 2. Reorganize items into sections
            $this->reorganizeItems($sections, $dryRun);
            
            // 3. Cleanup formatting
            $this->cleanupFormatting($dryRun);
            
            if ($dryRun) {
                DB::rollBack();
                $this->warn('💡 Run without --dry-run to apply changes');
            } else {
                DB::commit();
                $this->info('✅ Rotibul Haddad reorganized successfully!');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
    
    private function createSections(bool $dryRun): array
    {
        $this->info('📁 Creating sections...');
        
        // Delete old empty section
        if (!$dryRun) {
            BacaanSection::where('bacaan_id', $this->bacaanId)->delete();
        }
        
        $sectionData = [
            ['judul' => 'Muqaddimah', 'urutan' => 1],
            ['judul' => 'Bacaan Pokok', 'urutan' => 2],
            ['judul' => 'Hadiah Fatihah', 'urutan' => 3],
            ['judul' => 'Doa', 'urutan' => 4],
            ['judul' => 'Penutup', 'urutan' => 5],
        ];
        
        $sections = [];
        foreach ($sectionData as $data) {
            $this->line("   Creating: {$data['judul']}");
            
            if (!$dryRun) {
                $section = BacaanSection::create([
                    'bacaan_id' => $this->bacaanId,
                    'judul_section' => $data['judul'],
                    'slug_section' => Str::slug($data['judul']),
                    'urutan' => $data['urutan'],
                ]);
                $sections[$data['judul']] = $section->id;
            } else {
                $sections[$data['judul']] = $data['urutan']; // Placeholder
            }
        }
        
        return $sections;
    }
    
    private function reorganizeItems(array $sections, bool $dryRun): void
    {
        $this->info('📝 Reorganizing items...');
        
        // Item mapping: item_id => section_name
        $itemMapping = [
            // Muqaddimah (item 60)
            60 => 'Muqaddimah',
            
            // Bacaan Pokok (items 61-79)
            61 => 'Bacaan Pokok', // Al-Fatihah
            62 => 'Bacaan Pokok', // Ayat Kursi
            63 => 'Bacaan Pokok', // Lanjutan
            64 => 'Bacaan Pokok', // Akhir Al-Baqarah
            65 => 'Bacaan Pokok', // Tahlil
            66 => 'Bacaan Pokok', // Tasbih
            67 => 'Bacaan Pokok', // Subhanallah
            68 => 'Bacaan Pokok', // A'udzu
            69 => 'Bacaan Pokok', // Bismillah
            70 => 'Bacaan Pokok', // Bismillah walhamd
            71 => 'Bacaan Pokok', // Amanna
            72 => 'Bacaan Pokok', // Ya Rabbana
            73 => 'Bacaan Pokok', // Ya Dzal Jalal
            74 => 'Bacaan Pokok', // Ya Qowiyyu
            75 => 'Bacaan Pokok', // Ashlahallah
            76 => 'Bacaan Pokok', // Ya Aliyyu
            77 => 'Bacaan Pokok', // Ya Farijal Hamm
            78 => 'Bacaan Pokok', // Astaghfirullah
            79 => 'Bacaan Pokok', // La ilaha illallah
            
            // Hadiah Fatihah (items 80-89)
            80 => 'Hadiah Fatihah',
            81 => 'Hadiah Fatihah',
            82 => 'Hadiah Fatihah',
            83 => 'Hadiah Fatihah',
            84 => 'Hadiah Fatihah',
            85 => 'Hadiah Fatihah',
            86 => 'Hadiah Fatihah',
            87 => 'Hadiah Fatihah',
            88 => 'Hadiah Fatihah',
            89 => 'Hadiah Fatihah',
            
            // Doa (items 90-98)
            90 => 'Doa',
            91 => 'Doa',
            92 => 'Doa',
            93 => 'Doa',
            94 => 'Doa',
            95 => 'Doa',
            96 => 'Doa',
            97 => 'Doa',
            98 => 'Doa',
            
            // Penutup (items 99-100)
            99 => 'Penutup',
            100 => 'Penutup',
        ];
        
        foreach ($itemMapping as $itemId => $sectionName) {
            $item = BacaanItem::find($itemId);
            if ($item && isset($sections[$sectionName])) {
                if (!$dryRun) {
                    $item->section_id = $sections[$sectionName];
                    $item->save();
                }
            }
        }
        
        $this->line('   Mapped ' . count($itemMapping) . ' items to sections');
    }
    
    private function cleanupFormatting(bool $dryRun): void
    {
        $this->info('🧹 Cleaning up formatting...');
        
        $items = BacaanItem::where('bacaan_id', $this->bacaanId)->get();
        $cleaned = 0;
        
        foreach ($items as $item) {
            $original = $item->arabic;
            $text = $original;
            
            // Replace inconsistent numbering with nice verse markers
            // .١ . or ٢ . or .٥ . → ۝١ 
            $text = preg_replace('/\.?\s*([١٢٣٤٥٦٧٨٩٠]+)\s*\.?\s*/u', '۝$1 ', $text);
            
            // Clean up double dots
            $text = str_replace('..', '.', $text);
            
            // Clean up multiple spaces
            $text = preg_replace('/\s{2,}/u', ' ', $text);
            
            // Clean up spaces around <br>
            $text = preg_replace('/\s*<br>\s*/i', '<br>', $text);
            
            if ($text !== $original) {
                if (!$dryRun) {
                    $item->arabic = $text;
                    $item->save();
                }
                $cleaned++;
            }
        }
        
        $this->line("   Cleaned {$cleaned} items");
    }
}
