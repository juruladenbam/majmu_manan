<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BacaanSection;
use Illuminate\Support\Str;

class SectionController extends Controller
{
    /**
     * @OA\Post(
     *      path="/api/admin/sections",
     *      tags={"Admin Sections"},
     *      security={{"sanctum":{}}},
     *      summary="Create Section",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"bacaan_id", "judul_section"},
     *              @OA\Property(property="bacaan_id", type="integer"),
     *              @OA\Property(property="judul_section", type="string"),
     *              @OA\Property(property="urutan", type="integer")
     *          )
     *      ),
     *      @OA\Response(response=201, description="Created")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'bacaan_id' => 'required|exists:bacaans,id',
            'judul_section' => 'required'
        ]);

        $section = BacaanSection::create([
            'bacaan_id' => $request->bacaan_id,
            'judul_section' => $request->judul_section,
            'slug_section' => Str::slug($request->judul_section) . '-' . Str::random(5),
            'urutan' => $request->urutan ?? 0
        ]);

        return response()->json($section, 201);
    }

    /**
     * @OA\Put(
     *      path="/api/admin/sections/{id}",
     *      tags={"Admin Sections"},
     *      security={{"sanctum":{}}},
     *      summary="Update Section",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="judul_section", type="string"),
     *              @OA\Property(property="urutan", type="integer")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $section = BacaanSection::findOrFail($id);
        $section->update($request->only(['judul_section', 'urutan']));
        return response()->json($section);
    }

    /**
     * @OA\Delete(
     *      path="/api/admin/sections/{id}",
     *      tags={"Admin Sections"},
     *      security={{"sanctum":{}}},
     *      summary="Delete Section",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Deleted")
     * )
     */
    public function destroy($id)
    {
        BacaanSection::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}