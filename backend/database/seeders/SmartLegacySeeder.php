<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SmartLegacySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('sql/legacy_data.sql');
        
        if (!File::exists($path)) {
            $this->command->error("Legacy SQL file not found at: " . $path);
            return;
        }

        $sql = File::get($path);
        
        // 1. Parse and Insert 'bacaans'
        $this->processBacaans($sql);

        // 2. Parse and Insert 'bacaan_details' (Split into Sections & Items)
        $this->processDetails($sql);
    }

    private function processBacaans($sql)
    {
        // Extract INSERT INTO `bacaans` ... VALUES (...)
        preg_match_all("/INSERT INTO `bacaans` VALUES (.*?);/s", $sql, $matches);
        
        if (empty($matches[1])) return;

        foreach ($matches[1] as $block) {
            // Split tuples: (1, '..', ...), (2, '..', ...)
            // Use regex to capture content inside parens
            preg_match_all("/\((.*?)\)/s", $block, $tuples);
            
            foreach ($tuples[1] as $tuple) {
                // Parse CSV respecting quoted strings
                $row = str_getcsv($tuple, ",", "'");
                // Clean up extra quotes if str_getcsv didn't catch them all or if SQL dump format varies
                $row = array_map(function($val) {
                    return trim($val, " '");
                }, $row);

                // Mapping based on Legacy Schema:
                // 0: id_bacaan, 1: judul_arb, 2: judul_latin, 3: judul_ina, 4: slug, 5: gambar, 6: keterangan, ...
                
                $id = $row[0];
                $judulLatin = $row[2] ?: 'Tanpa Judul'; // Default if empty
                $judulArab = $row[1];
                $slug = $row[4];
                $gambar = $row[5];
                $desc = $row[6];

                DB::table('bacaans')->insert([
                    'id' => $id,
                    'judul' => $judulLatin,
                    'judul_arab' => $judulArab,
                    'slug' => $slug ?: Str::slug($judulLatin),
                    'gambar' => $gambar,
                    'deskripsi' => $desc,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function processDetails($sql)
    {
        // Extract INSERT INTO `bacaan_details` ... VALUES (...)
        preg_match_all("/INSERT INTO `bacaan_details` VALUES (.*?);/s", $sql, $matches);
        
        if (empty($matches[1])) return;

        foreach ($matches[1] as $block) {
            // Because details can have nested commas in text, standard split is risky.
            // We need a robust regex or parser. 
            // The sql dump format: (1,1,NULL,'0','text...',NULL,NULL,0,'date','date',NULL)
            // Let's assume standard mysqldump format where strings are quoted with '
            
            // Regex to match (...) tuples
            if(preg_match_all("/\(([^)]+)\)/", $block, $tuples)) {
                foreach ($tuples[0] as $rawTuple) {
                     // Remove outer parens
                    $inner = substr($rawTuple, 1, -1);
                    
                    // Parse fields. This is tricky with commas in text.
                    // Hacky parser: split by ',' but ignore comma inside quotes.
                    $row = preg_split("/,(?=(?:[^']*'[^']*')*[^']*$)/", $inner);
                    
                    if (count($row) < 6) continue; // Skip invalid rows

                    $row = array_map(function($val) {
                        return trim(trim($val), "'"); // Trim whitespace then quotes
                    }, $row);

                    // Mapping:
                    // 0: id_detail, 1: bacaan_id, 2: segmen_parent, 3: segmen_child, 4: arb, 5: ina, 6: ket, 7: is_syiir
                    
                    $bacaanId = ($row[1] === 'NULL') ? null : (int)$row[1];
                    $segmenParent = ($row[2] === 'NULL') ? null : $row[2];
                    $segmenChild = ($row[3] === 'NULL') ? null : $row[3];
                    $arb = ($row[4] === 'NULL') ? null : $row[4];
                    $ina = ($row[5] === 'NULL') ? null : $row[5];
                    $isSyiir = isset($row[7]) ? (int)$row[7] : 0;
                    
                    // Skip if bacaanId is null (invalid data)
                    if (!$bacaanId) continue;

                    // Logic: 
                    // IF segmen_parent != NULL (and != '0' usually) -> It's a Section Header (Group)
                    // But wait, look at data: (1,1,NULL,'0','Bismillah'...) -> This is an Item (Parent NULL)
                    // (100, 3, '1', '0', NULL, 'Bab 1', ...) -> This is a Section (Parent '1', Child '0'?, Text null/ina only)
                    
                    // Refined Logic from V2 Plan:
                    // 1. Identify Sections: Rows where segmen_parent IS NOT NULL.
                    //    Actually, usually the "Header" row itself might have arb=NULL/empty and ina="Title".
                    //    OR we just treat unique segmen_parent values as sections.
                    
                    // Let's use the Logic from previous MigrasiSeeder, but live.
                    
                    // CASE A: It's a Section Definition (e.g. "Bab 1")
                    // Often represented by a row with valid Parent, but maybe child is 0, and Arab is empty?
                    // In previous logic: We grouped by segmen_parent to create sections.
                    
                    // PROBLEM: We are iterating line by line. We can't group easily without memory.
                    // SOLUTION: Insert ITEMS first, but we need SECTION_ID.
                    // This implies we need to create Sections first or on the fly.
                    
                    // STRATEGY: 
                    // 1. If segmen_parent is NOT NULL and NOT '0':
                    //    Check if Section exists for (bacaan_id, urutan=segmen_parent).
                    //    If not, create it. Use a placeholder title or fetch from this row if it looks like a header.
                    
                    $sectionId = null;

                    if ($segmenParent && $segmenParent !== '0') {
                        // Find or Create Section
                        // We use 'urutan' to identify the section locally within the bacaan
                        $section = DB::table('bacaan_sections')
                            ->where('bacaan_id', $bacaanId)
                            ->where('urutan', $segmenParent)
                            ->first();
                        
                        if (!$section) {
                            // Determine Title: If this row has no Arabic but has Ina, use Ina as Title.
                            // Else use generic.
                            $title = (!empty($ina) && (empty($arb) || $arb === 'NULL')) ? $ina : "Bagian $segmenParent";
                            
                            $sectionId = DB::table('bacaan_sections')->insertGetId([
                                'bacaan_id' => $bacaanId,
                                'judul_section' => $title,
                                'slug_section' => Str::slug($title),
                                'urutan' => (int)$segmenParent,
                                'created_at' => now(),
                            ]);
                            
                            // If this row WAS just a header (no arabic content), we are done with it. 
                            // Don't insert as item.
                            if (empty($arb) || $arb === 'NULL') continue; 
                            
                        } else {
                            $sectionId = $section->id;
                            // If we found the section, but THIS row is the header definition (empty arb), update title?
                            if ((empty($arb) || $arb === 'NULL') && !empty($ina)) {
                                DB::table('bacaan_sections')->where('id', $sectionId)->update([
                                    'judul_section' => $ina,
                                    'slug_section' => Str::slug($ina)
                                ]);
                                continue;
                            }
                        }
                    }

                    // CASE B: Insert Item
                    // Valid item if it has Arabic content OR it's a valid part of the reading.
                    if (!empty($arb) && $arb !== 'NULL') {
                        DB::table('bacaan_items')->insert([
                            'bacaan_id' => $bacaanId,
                            'section_id' => $sectionId,
                            'urutan' => (int)($segmenChild ?? 0),
                            'arabic' => $arb,
                            'latin' => null, // Legacy didn't have separate latin column per row usually
                            'terjemahan' => $ina,
                            'tipe_tampilan' => ($isSyiir == 1) ? 'syiir' : 'text',
                            'created_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}