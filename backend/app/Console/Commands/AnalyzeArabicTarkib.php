<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BacaanItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AnalyzeArabicTarkib extends Command
{
    protected $signature = 'arabic:analyze 
                            {--fix : Apply fixes automatically}
                            {--export : Export report to CSV}';
    
    protected $description = 'Analyze Arabic text for tarkib (grammatical) errors and optionally fix them';

    /**
     * Common Arabic text errors mapping: wrong => correct
     */
    private array $tarkibFixes = [
        // Basmalah corrections
        'الرًّحْمَنِ الَّحِيْمِ' => 'الرَّحْمٰنِ الرَّحِيْمِ',
        'الرًّحْمنِ الرَّحِيْمِ' => 'الرَّحْمٰنِ الرَّحِيْمِ',
        
        // Sahabat name corrections
        'عُمَانَ ابْنِ عَفَّان' => 'عُثْمَانَ ابْنِ عَفَّان',
        'عُمَانَ ابْنِ' => 'عُثْمَانَ ابْنِ', 
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

    public function handle(): int
    {
        $this->info('🔍 Analyzing Arabic text for tarkib errors...');
        
        $items = BacaanItem::whereNotNull('arabic')
            ->where('arabic', '!=', '')
            ->get();
        
        $this->info("Found {$items->count()} items with Arabic text.");
        
        $issues = [];
        $fixedCount = 0;
        $shouldFix = $this->option('fix');
        $shouldExport = $this->option('export');
        
        $progressBar = $this->output->createProgressBar($items->count());
        $progressBar->start();
        
        DB::beginTransaction();
        
        try {
            foreach ($items as $item) {
                $original = $item->arabic;
                $fixed = $original;
                $itemIssues = [];
                
                // Check for each known error
                foreach ($this->tarkibFixes as $wrong => $correct) {
                    if (mb_strpos($fixed, $wrong) !== false) {
                        $itemIssues[] = [
                            'item_id' => $item->id,
                            'bacaan_id' => $item->bacaan_id,
                            'section_id' => $item->section_id,
                            'wrong' => $wrong,
                            'correct' => $correct,
                            'type' => $this->categorizeError($wrong),
                        ];
                        
                        $fixed = str_replace($wrong, $correct, $fixed);
                    }
                }
                
                if (!empty($itemIssues)) {
                    $issues = array_merge($issues, $itemIssues);
                    
                    if ($shouldFix && $fixed !== $original) {
                        $item->arabic = $fixed;
                        $item->save();
                        $fixedCount++;
                    }
                }
                
                $progressBar->advance();
            }
            
            if ($shouldFix) {
                DB::commit();
            } else {
                DB::rollBack();
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage());
            return Command::FAILURE;
        }
        
        $progressBar->finish();
        $this->newLine(2);
        
        // Display results
        $this->displayResults($issues);
        
        if ($shouldFix) {
            $this->info("✅ Fixed {$fixedCount} items.");
        } else {
            $this->warn("💡 Run with --fix to apply corrections.");
        }
        
        // Export to CSV if requested
        if ($shouldExport && !empty($issues)) {
            $this->exportToCsv($issues);
        }
        
        return Command::SUCCESS;
    }
    
    private function categorizeError(string $wrong): string
    {
        $categories = [
            'harakat' => ['الرًّحْمَنِ', 'مُحُمَّد'],
            'nama_sahabat' => ['عُمَانَ'],
            'nama_tarekat' => ['النَّفْسَبَنْدِ'],
            'nama_ulama' => ['السَّفَطِي', 'زَمْرَحِي'],
            'typo' => ['المُحْتَهد', 'مُقَادِي', 'وَالْوَتِ'],
            'irab' => ['بْنٍ', 'العَلَيْه'],
        ];
        
        foreach ($categories as $category => $patterns) {
            foreach ($patterns as $pattern) {
                if (mb_strpos($wrong, $pattern) !== false) {
                    return $category;
                }
            }
        }
        
        return 'other';
    }
    
    private function displayResults(array $issues): void
    {
        if (empty($issues)) {
            $this->info("✨ No tarkib issues found!");
            return;
        }
        
        $this->error("Found " . count($issues) . " issues:");
        $this->newLine();
        
        // Group by type
        $byType = collect($issues)->groupBy('type');
        
        foreach ($byType as $type => $typeIssues) {
            $this->info("📌 {$type} (" . count($typeIssues) . " issues):");
            
            $uniqueErrors = $typeIssues->unique('wrong');
            foreach ($uniqueErrors->take(3) as $issue) {
                $this->line("   ❌ {$issue['wrong']}");
                $this->line("   ✅ {$issue['correct']}");
                $this->line("   📍 Item IDs: " . $typeIssues->where('wrong', $issue['wrong'])->pluck('item_id')->implode(', '));
                $this->newLine();
            }
        }
    }
    
    private function exportToCsv(array $issues): void
    {
        $filename = 'arabic_tarkib_issues_' . now()->format('Y-m-d_His') . '.csv';
        $path = storage_path('app/' . $filename);
        
        $fp = fopen($path, 'w');
        
        // UTF-8 BOM for Excel compatibility
        fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Header
        fputcsv($fp, ['Item ID', 'Bacaan ID', 'Section ID', 'Type', 'Wrong Text', 'Correct Text']);
        
        foreach ($issues as $issue) {
            fputcsv($fp, [
                $issue['item_id'],
                $issue['bacaan_id'],
                $issue['section_id'] ?? 'NULL',
                $issue['type'],
                $issue['wrong'],
                $issue['correct'],
            ]);
        }
        
        fclose($fp);
        
        $this->info("📄 Exported to: {$path}");
    }
}
