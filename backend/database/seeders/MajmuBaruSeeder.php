<?php

namespace Database\Seeders;

use App\Models\Bacaan;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MajmuBaruSeeder extends Seeder
{
    /**
     * Daftar file JSON yang akan di-import dari majmu_baru.
     */
    private array $files = [
        'doa_birril_walidain.json',
    ];

    public function run(): void
    {
        $basePath = base_path('../docs/majmu_baru');

        if (!File::isDirectory($basePath)) {
            $this->command->error("Directory not found: {$basePath}");
            return;
        }

        $this->command->info('=== Importing Majmu Baru Data ===');
        $this->command->newLine();

        $totalBacaan = 0;
        $totalSections = 0;
        $totalItems = 0;

        foreach ($this->files as $filename) {
            $filePath = $basePath . '/' . $filename;

            if (!File::exists($filePath)) {
                $this->command->warn("  Skipped: {$filename} (file not found)");
                continue;
            }

            $json = json_decode(File::get($filePath), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->command->error("  Failed to parse {$filename}: " . json_last_error_msg());
                continue;
            }

            if (!isset($json['bacaan'])) {
                $this->command->error("  Invalid structure in {$filename}: missing 'bacaan' key");
                continue;
            }

            $result = $this->importBacaan($json['bacaan'], $filename);
            $totalBacaan++;
            $totalSections += $result['sections'];
            $totalItems += $result['items'];
        }

        $this->command->newLine();
        $this->command->info("=== Import Complete ===");
        $this->command->info("  Bacaan: {$totalBacaan}");
        $this->command->info("  Sections: {$totalSections}");
        $this->command->info("  Items: {$totalItems}");
    }

    private function importBacaan(array $data, string $filename): array
    {
        $slug = $data['slug'] ?? null;

        if (!$slug) {
            $this->command->error("  Skipped {$filename}: missing slug");
            return ['sections' => 0, 'items' => 0];
        }

        // Create or update bacaan
        $bacaan = Bacaan::updateOrCreate(
            ['slug' => $slug],
            [
                'judul' => $data['judul'] ?? 'Tanpa Judul',
                'judul_arab' => $data['judul_arab'] ?? null,
                'is_multi_section' => (bool) ($data['is_multi_section'] ?? false),
            ]
        );

        $this->command->info("  [{$filename}] {$bacaan->judul}");

        // Clear existing sections and items for idempotent seeding
        // Use soft delete if the model uses it, though the model definition wasn't seen, 
        // the MajmuLamaSeeder uses delete() directly.
        BacaanItem::where('bacaan_id', $bacaan->id)->delete();
        BacaanSection::where('bacaan_id', $bacaan->id)->delete();

        $sectionCount = 0;
        $itemCount = 0;

        if (!empty($data['sections'])) {
            foreach ($data['sections'] as $sectionData) {
                $section = BacaanSection::create([
                    'bacaan_id' => $bacaan->id,
                    'judul_section' => $sectionData['judul_section'] ?? 'Bagian ' . ($sectionData['urutan'] ?? $sectionCount + 1),
                    'slug_section' => $sectionData['slug_section'] ?? null,
                    'urutan' => $sectionData['urutan'] ?? $sectionCount + 1,
                ]);
                $sectionCount++;

                if (!empty($sectionData['items'])) {
                    foreach ($sectionData['items'] as $itemData) {
                        $this->createItem($bacaan->id, $section->id, $itemData);
                        $itemCount++;
                    }
                }
            }
        }

        if (!empty($data['items'])) {
            foreach ($data['items'] as $itemData) {
                $this->createItem($bacaan->id, null, $itemData);
                $itemCount++;
            }
        }

        return ['sections' => $sectionCount, 'items' => $itemCount];
    }

    private function createItem(int $bacaanId, ?int $sectionId, array $data): void
    {
        $allowedTypes = ['text', 'syiir', 'judul_tengah', 'image', 'keterangan'];
        $tipeTampilan = $data['tipe_tampilan'] ?? 'text';

        if (!in_array($tipeTampilan, $allowedTypes)) {
            $tipeTampilan = 'text';
        }

        // Note: MajmuLamaSeeder has 'note_kaki' and 'latin' as well.
        BacaanItem::create([
            'bacaan_id' => $bacaanId,
            'section_id' => $sectionId,
            'urutan' => $data['urutan'] ?? 0,
            'arabic' => $data['arabic'] ?? null,
            'latin' => $data['latin'] ?? null,
            'terjemahan' => $data['terjemahan'] ?? null,
            'tipe_tampilan' => $tipeTampilan,
            'note_kaki' => $data['note_kaki'] ?? null,
        ]);
    }
}
