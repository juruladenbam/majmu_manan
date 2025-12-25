<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Bacaan;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use Illuminate\Support\Facades\File;

class ExportManaqibData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bacaan:export-manaqib';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export Manaqib data from DB to JSON and SQL dump';

    /**
     * Reverse mapping from DB tipe_tampilan to JSON type
     */
    private array $reverseTypeMapping = [
        'text' => 'prose',
        'syiir' => 'poetry',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting Manaqib export...");

        $bacaan = Bacaan::with(['sections' => function($q) {
            $q->orderBy('urutan');
        }, 'sections.items' => function($q) {
            $q->orderBy('urutan');
        }])->where('slug', 'manaqib')->first();

        if (!$bacaan) {
            $this->error("Bacaan with slug 'manaqib' not found in database.");
            return;
        }

        $this->exportJson($bacaan);
        $this->exportSql($bacaan);

        $this->info("Export completed successfully!");
    }

    private function exportJson(Bacaan $bacaan)
    {
        $jsonPath = base_path('../docs/teks-manaqib.json');
        
        // Read existing metadata if file exists to preserve it
        $metadata = [
            "title" => "Manaqib Syeikh Abdul Qodir Al-Jailani",
            "event" => "Festival BAM",
            "file_name" => "manaqib bam full A5.pdf",
            "structure_type" => "mixed_content_with_separators"
        ];

        if (File::exists($jsonPath)) {
            $existing = json_decode(File::get($jsonPath), true);
            if (isset($existing['metadata'])) {
                $metadata = $existing['metadata'];
            }
        }

        $content = [];

        foreach ($bacaan->sections as $section) {
            $blocks = [];
            foreach ($section->items as $item) {
                // Map DB tipe_tampilan back to JSON type
                // Default to 'prose' if not found, or keep original if valid
                $type = $this->reverseTypeMapping[$item->tipe_tampilan] ?? $item->tipe_tampilan;

                $block = [
                    "type" => $type,
                    "description" => $item->note_kaki, // note_kaki maps to description
                    "text" => $item->arabic
                ];
                $blocks[] = $block;
            }

            // Convert "Bab 1" back to "BAB 1" if desired, or keep as is.
            // The user's JSON had "BAB 1", existing formatChapterTitle does ucfirst.
            // Let's try to preserve uppercase simply or just use what's in DB.
            // If the DB has "Bab 1", and we want "BAB 1", we might need logic.
            // But usually the user wants what is in the DB.
            
            $content[] = [
                "chapter" => $section->judul_section,
                "blocks" => $blocks
            ];
        }

        $data = [
            "metadata" => $metadata,
            "content" => $content
        ];

        File::put($jsonPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $this->info("JSON exported to: " . $jsonPath);
    }

    private function exportSql(Bacaan $bacaan)
    {
        $sqlPath = base_path('../docs/manaqib_dump.sql');
        
        $sql = "-- Manaqib Data Dump\n";
        $sql .= "-- Generated at: " . date('Y-m-d H:i:s') . "\n\n";
        
        // Helper to escape strings for SQL
        $esc = function($value) {
            if ($value === null) return 'NULL';
            // Simple escaping for single quotes
            return "'" . addslashes($value) . "'";
        };

        // 1. Bacaans
        // We delete existing by slug first to be clean
        $sql .= "-- DELETE existing Manaqib data if present\n";
        $sql .= "DELETE FROM bacaan_items WHERE bacaan_id IN (SELECT id FROM bacaans WHERE slug = 'manaqib');\n";
        $sql .= "DELETE FROM bacaan_sections WHERE bacaan_id IN (SELECT id FROM bacaans WHERE slug = 'manaqib');\n";
        $sql .= "DELETE FROM bacaans WHERE slug = 'manaqib';\n\n";

        $sql .= "-- Insert Bacaan\n";
        // We might want to keep the same ID to maintain relationships if any
        // But auto-increment is standard. We'll use a variable for ID to link sections.
        
        $sql .= "INSERT INTO `bacaans` (`slug`, `judul`, `judul_arab`, `deskripsi`, `is_multi_section`, `created_at`, `updated_at`) VALUES (\n";
        $sql .= implode(", ", [
            $esc($bacaan->slug),
            $esc($bacaan->judul),
            $esc($bacaan->judul_arab),
            $esc($bacaan->deskripsi),
            $bacaan->is_multi_section ? 1 : 0,
            "NOW()", "NOW()"
        ]);
        $sql .= ");\n";
        
        $sql .= "SET @bacaan_id = LAST_INSERT_ID();\n\n";

        // 2. Sections
        foreach ($bacaan->sections as $section) {
            $sql .= "-- Section: {$section->judul_section}\n";
            $sql .= "INSERT INTO `bacaan_sections` (`bacaan_id`, `judul_section`, `slug_section`, `urutan`, `created_at`, `updated_at`) VALUES (\n";
            $sql .= implode(", ", [
                "@bacaan_id",
                $esc($section->judul_section),
                $esc($section->slug_section),
                $section->urutan,
                "NOW()", "NOW()"
            ]);
            $sql .= ");\n";
            $sql .= "SET @section_id = LAST_INSERT_ID();\n";

            // 3. Items
            if ($section->items->count() > 0) {
                $sql .= "INSERT INTO `bacaan_items` (`bacaan_id`, `section_id`, `urutan`, `arabic`, `latin`, `terjemahan`, `tipe_tampilan`, `note_kaki`, `created_at`, `updated_at`) VALUES \n";
                $values = [];
                foreach ($section->items as $item) {
                    $vals = implode(", ", [
                        "@bacaan_id",
                        "@section_id",
                        $item->urutan,
                        $esc($item->arabic),
                        $esc($item->latin),
                        $esc($item->terjemahan),
                        $esc($item->tipe_tampilan),
                        $esc($item->note_kaki),
                        "NOW()", "NOW()"
                    ]);
                    $values[] = "($vals)";
                }
                $sql .= implode(",\n", $values) . ";\n\n";
            }
        }

        File::put($sqlPath, $sql);
        $this->info("SQL Dump exported to: " . $sqlPath);
    }
}
