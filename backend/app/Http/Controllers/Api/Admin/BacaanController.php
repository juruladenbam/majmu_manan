<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bacaan;
use Illuminate\Support\Str;

use App\Models\BacaanSection;

class BacaanController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/admin/bacaan",
     *      tags={"Admin Bacaan"},
     *      security={{"sanctum":{}}},
     *      summary="List all Bacaan",
     *      @OA\Response(response=200, description="List of Bacaan")
     * )
     */
    public function index()
    {
        return response()->json(Bacaan::withCount('sections')->get());
    }

    /**
     * @OA\Post(
     *      path="/api/admin/bacaan",
     *      tags={"Admin Bacaan"},
     *      security={{"sanctum":{}}},
     *      summary="Create Bacaan",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"judul"},
     *              @OA\Property(property="judul", type="string"),
     *              @OA\Property(property="judul_arab", type="string"),
     *              @OA\Property(property="deskripsi", type="string"),
     *              @OA\Property(property="is_multi_section", type="boolean")
     *          )
     *      ),
     *      @OA\Response(response=201, description="Created")
     * )
     */
    public function store(Request $request)
    {
        $request->validate(['judul' => 'required']);
        
        $bacaan = Bacaan::create([
            'judul' => $request->judul,
            'judul_arab' => $request->judul_arab,
            'slug' => Str::slug($request->judul) . '-' . Str::random(5),
            'deskripsi' => $request->deskripsi,
            'is_multi_section' => $request->has('is_multi_section') ? $request->is_multi_section : false
        ]);

        // Automatically create a default section if it's single section (or always create one to be safe as "General" section)
        // Plan said: "Otomatis buat 1 section default saat bacaan baru dibuat"
        // Even for multi-section, starting with 1 section is fine.
        BacaanSection::create([
            'bacaan_id' => $bacaan->id,
            'judul_section' => null, // Default empty title for single section mode
            'urutan' => 1
        ]);

        return response()->json($bacaan, 201);
    }

    /**
     * @OA\Get(
     *      path="/api/admin/bacaan/{id}",
     *      tags={"Admin Bacaan"},
     *      security={{"sanctum":{}}},
     *      summary="Get Bacaan Detail",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Detail")
     * )
     */
    public function show($id)
    {
        return response()->json(Bacaan::with([
            'sections' => function($q) {
                $q->orderBy('urutan', 'asc');
            },
            'sections.items' => function($q) {
                $q->orderBy('urutan', 'asc');
            }
        ])->findOrFail($id));
    }

    /**
     * @OA\Put(
     *      path="/api/admin/bacaan/{id}",
     *      tags={"Admin Bacaan"},
     *      security={{"sanctum":{}}},
     *      summary="Update Bacaan",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="judul", type="string"),
     *              @OA\Property(property="judul_arab", type="string"),
     *              @OA\Property(property="deskripsi", type="string"),
     *              @OA\Property(property="is_multi_section", type="boolean")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $bacaan = Bacaan::findOrFail($id);
        $bacaan->update($request->only(['judul', 'judul_arab', 'deskripsi', 'is_multi_section']));
        
        // Ensure there is at least one section if switching back to single section? 
        // Logic: If sections count is 0, create one.
        if ($bacaan->sections()->count() == 0) {
             BacaanSection::create([
                'bacaan_id' => $bacaan->id,
                'judul_section' => null,
                'urutan' => 1
            ]);
        }

        return response()->json($bacaan);
    }

    /**
     * @OA\Delete(
     *      path="/api/admin/bacaan/{id}",
     *      tags={"Admin Bacaan"},
     *      security={{"sanctum":{}}},
     *      summary="Delete Bacaan",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Deleted")
     * )
     */
    public function destroy($id)
    {
        Bacaan::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}