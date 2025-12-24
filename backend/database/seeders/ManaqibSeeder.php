<?php

namespace Database\Seeders;

use App\Models\Bacaan;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ManaqibSeeder extends Seeder
{
    /**
     * Map JSON block type to database tipe_tampilan
     */
    private array $typeMapping = [
        'prose' => 'text',
        'poetry' => 'syiir',
    ];

    public function run(): void
    {
        $jsonPath = base_path('../docs/teks-manaqib.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("JSON file not found: {$jsonPath}");
            return;
        }

        $json = json_decode(File::get($jsonPath), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error("Failed to parse JSON: " . json_last_error_msg());
            return;
        }

        $this->command->info("Importing Manaqib data...");

        // Create main bacaan entry
        $bacaan = Bacaan::updateOrCreate(
            ['slug' => 'manaqib'],
            [
                'judul' => $json['metadata']['title'] ?? 'Manaqib Syeikh Abdul Qodir Al-Jailani',
                'judul_arab' => 'مناقب الشيخ عبد القادر الجيلاني',
                'deskripsi' => 'Kitab Manaqib karya Syeikh Ja\'far al-Barzanji',
            ]
        );

        $this->command->info("Created bacaan: {$bacaan->judul}");

        // Clear existing sections and items for this bacaan
        BacaanItem::where('bacaan_id', $bacaan->id)->delete();
        BacaanSection::where('bacaan_id', $bacaan->id)->delete();

        $sectionOrder = 0;
        $totalItems = 0;

        // Process each chapter
        foreach ($json['content'] as $chapter) {
            $sectionOrder++;
            
            // Create section for chapter
            $section = BacaanSection::create([
                'bacaan_id' => $bacaan->id,
                'judul_section' => $this->formatChapterTitle($chapter['chapter']),
                'slug_section' => Str::slug($chapter['chapter']),
                'urutan' => $sectionOrder,
            ]);

            $this->command->info("  Section {$sectionOrder}: {$section->judul_section}");

            $itemOrder = 0;

            // Process each block in chapter
            foreach ($chapter['blocks'] as $block) {
                $itemOrder++;
                $totalItems++;

                BacaanItem::create([
                    'bacaan_id' => $bacaan->id,
                    'section_id' => $section->id,
                    'urutan' => $itemOrder,
                    'arabic' => $block['text'] ?? '',
                    'latin' => null,
                    'terjemahan' => null,
                    'tipe_tampilan' => $this->mapType($block['type'] ?? 'prose'),
                    'note_kaki' => $block['description'] ?? null,
                ]);
            }

            $this->command->info("    -> {$itemOrder} items");
        }

        $this->command->info("Import complete: {$sectionOrder} sections, {$totalItems} items");
    }

    /**
     * Format chapter title: "BAB 1" -> "Bab 1"
     */
    private function formatChapterTitle(string $chapter): string
    {
        return ucfirst(strtolower($chapter));
    }

    /**
     * Map JSON type to database tipe_tampilan
     */
    private function mapType(string $type): string
    {
        return $this->typeMapping[$type] ?? 'text';
    }
}
