<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bacaan;
use App\Models\BacaanSection;

class BacaanController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/bacaan",
     *      tags={"Public Reader"},
     *      summary="List all Bacaan (Menu)",
     *      @OA\Response(response=200, description="List")
     * )
     */
    public function index()
    {
        return response()->json(
            \Illuminate\Support\Facades\Cache::remember('bacaan_index', 60 * 60, function () {
                return Bacaan::select('id', 'judul', 'judul_arab', 'slug', 'gambar', 'deskripsi', 'is_multi_section')
                    ->withCount('sections')
                    ->get();
            })
        );
    }

    /**
     * @OA\Get(
     *      path="/api/bacaan/{slug}",
     *      tags={"Public Reader"},
     *      summary="Get Bacaan Metadata & Section List",
     *      @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *      @OA\Response(response=200, description="Detail with Sections")
     * )
     */
    public function show($slug)
    {
        $bacaan = Bacaan::where('slug', $slug)
            ->with(['sections' => function($q) {
                $q->orderBy('urutan', 'asc');
            }])
            ->firstOrFail();

        // For single-section bacaans, include items directly
        if (!$bacaan->is_multi_section) {
            // Get items either from first section or items with null section_id
            $bacaan->load(['items' => function($q) {
                $q->orderBy('urutan', 'asc');
            }]);
        }

        return response()->json($bacaan);
    }

    /**
     * @OA\Get(
     *      path="/api/bacaan/{slug}/{section_slug}",
     *      tags={"Public Reader"},
     *      summary="Get Content of a Section",
     *      @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter(name="section_slug", in="path", required=true, @OA\Schema(type="string")),
     *      @OA\Response(response=200, description="Section Items")
     * )
     */
    public function showSection($slug, $sectionSlug)
    {
        $bacaan = Bacaan::where('slug', $slug)->firstOrFail();
        
        $section = BacaanSection::where('bacaan_id', $bacaan->id)
            ->where('slug_section', $sectionSlug)
            ->with(['items' => function($q) {
                $q->orderBy('urutan', 'asc');
            }])
            ->firstOrFail();

        return response()->json($section);
    }
}