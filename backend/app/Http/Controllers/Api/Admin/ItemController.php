<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BacaanItem;

class ItemController extends Controller
{
    /**
     * @OA\Post(
     *      path="/api/admin/items",
     *      tags={"Admin Items"},
     *      security={{"sanctum":{}}},
     *      summary="Create Item",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"bacaan_id"},
     *              @OA\Property(property="bacaan_id", type="integer"),
     *              @OA\Property(property="section_id", type="integer", nullable=true),
     *              @OA\Property(property="arabic", type="string"),
     *              @OA\Property(property="terjemahan", type="string"),
     *              @OA\Property(property="tipe_tampilan", type="string", enum={"text", "syiir", "judul_tengah", "image", "keterangan"}),
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
            'tipe_tampilan' => 'required|in:text,syiir,judul_tengah,image,keterangan'
        ]);

        $item = BacaanItem::create($request->all());
        return response()->json($item, 201);
    }

    /**
     * @OA\Put(
     *      path="/api/admin/items/{id}",
     *      tags={"Admin Items"},
     *      security={{"sanctum":{}}},
     *      summary="Update Item",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\RequestBody(
     *          @OA\JsonContent(
     *              @OA\Property(property="arabic", type="string"),
     *              @OA\Property(property="terjemahan", type="string"),
     *              @OA\Property(property="urutan", type="integer")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $item = BacaanItem::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    /**
     * @OA\Delete(
     *      path="/api/admin/items/{id}",
     *      tags={"Admin Items"},
     *      security={{"sanctum":{}}},
     *      summary="Delete Item",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Deleted")
     * )
     */
    public function destroy($id)
    {
        BacaanItem::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    /**
     * @OA\Post(
     *      path="/api/admin/items/reorder",
     *      tags={"Admin Items"},
     *      security={{"sanctum":{}}},
     *      summary="Reorder Items",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"items"},
     *              @OA\Property(
     *                  property="items",
     *                  type="array",
     *                  @OA\Items(
     *                      @OA\Property(property="id", type="integer"),
     *                      @OA\Property(property="urutan", type="integer")
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(response=200, description="Reordered")
     * )
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:bacaan_items,id',
            'items.*.urutan' => 'required|integer|min:0'
        ]);

        foreach ($request->items as $item) {
            BacaanItem::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
        }

        return response()->json(['message' => 'Items reordered']);
    }
}