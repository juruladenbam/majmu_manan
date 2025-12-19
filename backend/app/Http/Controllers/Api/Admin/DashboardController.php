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

        $recentActivity = Bacaan::orderBy('updated_at', 'desc')
            ->take(5)
            ->get(['id', 'judul', 'slug', 'updated_at', 'created_at']);

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
