<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bacaan;
use Illuminate\Support\Str;

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
        return response()->json(Bacaan::all());
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
     *              @OA\Property(property="deskripsi", type="string")
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
            'deskripsi' => $request->deskripsi
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
        return response()->json(Bacaan::with(['sections.items' => function($q) {
            $q->orderBy('urutan', 'asc');
        }])->findOrFail($id));
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
     *              @OA\Property(property="deskripsi", type="string")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $bacaan = Bacaan::findOrFail($id);
        $bacaan->update($request->only(['judul', 'judul_arab', 'deskripsi']));
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