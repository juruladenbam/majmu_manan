<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\BacaanReport;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bacaan_id' => 'required|exists:bacaans,id',
            'kategori' => 'required|in:salah_ketik,teks_hilang,terjemahan_salah,lain_lain',
            'jenis_laporan' => 'required|in:bacaan,section,item',
            'mode_koreksi' => 'required|in:langsung,catatan',
            'target_id' => 'required_if:jenis_laporan,section,item|nullable',
            'field_koreksi' => 'required|array|min:1',
            'field_koreksi.*' => 'string',
            'konten_asli' => 'nullable',
            'konten_koreksi' => 'required',
            'pelapor_nama' => 'nullable|string|max:255',
            'pelapor_email' => 'nullable|email|max:255',
        ]);

        // Validate target exists based on jenis_laporan
        if ($validated['jenis_laporan'] === 'section') {
            $exists = BacaanSection::where('id', $validated['target_id'])
                ->where('bacaan_id', $validated['bacaan_id'])->exists();
            if (!$exists) {
                return response()->json(['error' => 'Section tidak ditemukan'], 404);
            }
        } elseif ($validated['jenis_laporan'] === 'item') {
            $exists = BacaanItem::where('id', $validated['target_id'])
                ->where('bacaan_id', $validated['bacaan_id'])->exists();
            if (!$exists) {
                return response()->json(['error' => 'Item tidak ditemukan'], 404);
            }
        }

        // Handle JSON strings if passed as string from frontend
        if (is_string($validated['konten_asli'])) {
            $validated['konten_asli'] = json_decode($validated['konten_asli'], true);
        }
        if (is_string($validated['konten_koreksi'])) {
            $validated['konten_koreksi'] = json_decode($validated['konten_koreksi'], true);
        }

        $report = BacaanReport::create($validated);

        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'report' => $report,
        ], 201);
    }
}
