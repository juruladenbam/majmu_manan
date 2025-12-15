<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BacaanItem;
use Illuminate\Support\Facades\DB;

class CleanArabicText extends Command
{
    protected $signature = 'clean:arabic';
    protected $description = 'Format Arabic text: normalize breaks and spaces';

    public function handle()
    {
        $this->info('Starting formatting process...');

        $items = BacaanItem::whereNotNull('arabic')->get();
        $count = 0;

        DB::transaction(function () use ($items, &$count) {
            foreach ($items as $item) {
                $original = $item->arabic;
                
                // 1. Initial replacement of literal newlines to HTML breaks
                $cleaned = str_replace(['\n', '\r'], '<br>', $original);
                
                // 2. Convert standard PHP newlines to HTML breaks
                $cleaned = nl2br($cleaned, false);

                // 3. COLLAPSE multiple breaks:
                // Replace any sequence of <br>, spaces, newlines, etc. that results in multiple visual breaks
                // into a single <br> tag.
                // Regex explanation: Match <br> (optional slash), followed by whitespace, one or more times.
                $cleaned = preg_replace('/(<br\s*\/?>\s*)+/i', '<br>', $cleaned);

                // 4. Clean up spaces around the break
                // Remove spaces immediately before <br>
                $cleaned = preg_replace('/\s+(<br>)/i', '$1', $cleaned);
                // Remove spaces immediately after <br>
                $cleaned = preg_replace('/(br>)\s+/i', '$1', $cleaned);

                // 5. Trim overall
                $cleaned = trim($cleaned);

                if ($original !== $cleaned) {
                    $item->arabic = $cleaned;
                    $item->save();
                    $count++;
                    $this->line("Normalized Item ID: {$item->id}");
                }
            }
        });

        $this->info("Successfully normalized {$count} records.");
    }
}