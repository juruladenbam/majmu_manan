<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bacaan;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $stats = [
            'total_bacaan' => Bacaan::count(),
            'total_sections' => BacaanSection::count(),
            'total_items' => BacaanItem::count(),
            'multi_section_count' => Bacaan::where('is_multi_section', true)->count(),
        ];

        // Get recent activity considering updates from bacaan, sections, AND items
        $recentActivity = Bacaan::withMax('sections', 'updated_at')
            ->withMax('items', 'updated_at')
            ->with(['sections' => function($q) {
                $q->orderByDesc('updated_at')->limit(1);
            }, 'items' => function($q) {
                $q->orderByDesc('updated_at')->limit(1);
            }])
            ->get(['id', 'judul', 'slug', 'updated_at', 'created_at'])
            ->map(function($bacaan) {
                $bacaanTime = $bacaan->updated_at;
                $sectionTime = $bacaan->sections_max_updated_at;
                $itemTime = $bacaan->items_max_updated_at;
                
                // Determine which was updated most recently
                $latestTime = max($bacaanTime, $sectionTime ?? $bacaanTime, $itemTime ?? $bacaanTime);
                $bacaan->latest_activity = $latestTime;
                
                // Determine change source
                if ($latestTime == $itemTime && $bacaan->items->first()) {
                    $item = $bacaan->items->first();
                    $preview = strip_tags($item->arabic ?? $item->terjemahan ?? '');
                    $bacaan->change_source = 'item';
                    
                    // Detect if Arabic (contains Arabic Unicode range)
                    $isArabic = preg_match('/[\x{0600}-\x{06FF}]/u', $preview);
                    if (mb_strlen($preview) > 50) {
                        // For Arabic: ellipsis on left (start of RTL text)
                        // For Latin: ellipsis on right (end of LTR text)
                        $bacaan->change_preview = $isArabic 
                            ? '...' . mb_substr($preview, -50) 
                            : mb_substr($preview, 0, 50) . '...';
                    } else {
                        $bacaan->change_preview = $preview;
                    }
                } elseif ($latestTime == $sectionTime && $bacaan->sections->first()) {
                    $section = $bacaan->sections->first();
                    $bacaan->change_source = 'section';
                    $bacaan->change_preview = $section->judul_section;
                } else {
                    $bacaan->change_source = 'bacaan';
                    $bacaan->change_preview = 'Detail utama';
                }
                
                // Clean up relations
                unset($bacaan->sections, $bacaan->items);
                
                return $bacaan;
            })
            ->sortByDesc('latest_activity')
            ->take(5)
            ->values();

        $contentHealth = [
            'bacaan_without_image' => Bacaan::whereNull('gambar')->orWhere('gambar', '')->count(),
            'empty_sections' => BacaanSection::whereDoesntHave('items')->count(),
            'items_without_translation' => BacaanItem::whereNull('terjemahan')->orWhere('terjemahan', '')->count(),
        ];

        $maintenanceMode = AppSetting::where('key', 'maintenance_mode')->value('value') === 'true';

        return response()->json([
            'stats' => $stats,
            'recent_activity' => $recentActivity,
            'content_health' => $contentHealth,
            'maintenance_mode' => $maintenanceMode,
        ]);
    }
}
