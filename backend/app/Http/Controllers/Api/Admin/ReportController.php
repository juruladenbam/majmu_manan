<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BacaanReport;
use App\Models\Bacaan;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BacaanReport::with(['bacaan:id,judul,slug']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('jenis') && $request->jenis !== 'all') {
            $query->where('jenis_laporan', $request->jenis);
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($reports);
    }

    public function show(int $id): JsonResponse
    {
        $report = BacaanReport::with(['bacaan', 'item', 'section'])->findOrFail($id);
        return response()->json($report);
    }

    public function count(): JsonResponse
    {
        $count = BacaanReport::where('status', 'pending')->count();
        return response()->json(['pending_count' => $count]);
    }

    public function setuju(Request $request, int $id): JsonResponse
    {
        $report = BacaanReport::findOrFail($id);

        if ($report->status !== 'pending') {
            return response()->json(['error' => 'Laporan sudah diproses'], 400);
        }

        $fieldKoreksi = $report->field_koreksi ?? [];
        
        // Admin can provide modified correction content
        $kontenKoreksi = $request->input('konten_koreksi', $report->konten_koreksi);

        switch ($report->jenis_laporan) {
            case 'item':
                $item = BacaanItem::findOrFail($report->target_id);
                foreach ($fieldKoreksi as $field) {
                    if (in_array($field, ['arabic', 'latin', 'terjemahan', 'indonesia'])) {
                        $item->$field = $kontenKoreksi[$field] ?? $item->$field;
                    }
                }
                $item->save();
                break;

            case 'section':
                $section = BacaanSection::findOrFail($report->target_id);
                if (in_array('judul_section', $fieldKoreksi)) {
                    $section->judul_section = $kontenKoreksi['judul_section'] ?? $section->judul_section;
                }
                $section->save();
                break;

            case 'bacaan':
                $bacaan = Bacaan::findOrFail($report->bacaan_id);
                foreach ($fieldKoreksi as $field) {
                    if (in_array($field, ['judul', 'judul_arab', 'deskripsi'])) {
                        $bacaan->$field = $kontenKoreksi[$field] ?? $bacaan->$field;
                    }
                }
                $bacaan->save();
                break;
        }

        $report->update(['status' => 'disetujui']);

        return response()->json([
            'message' => 'Laporan disetujui dan data telah diperbarui',
            'report' => $report->fresh(),
        ]);
    }

    public function tolak(Request $request, int $id): JsonResponse
    {
        $report = BacaanReport::findOrFail($id);

        if ($report->status !== 'pending') {
            return response()->json(['error' => 'Laporan sudah diproses'], 400);
        }

        $report->update(['status' => 'ditolak']);

        return response()->json([
            'message' => 'Laporan ditolak',
            'report' => $report->fresh(),
        ]);
    }
}
