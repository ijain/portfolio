<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request): LengthAwarePaginator
    {
        $limit = (int) $request->query('limit', 10);
        $limit = min($limit, 100);

        return Product::select([ 'id', 'name', 'description', 'price', 'stock', 'image'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);
    }

    public function show(Product $product): Product
    {
        $product->setHidden(['updated_at', 'created_at']);

        return $product;
    }

    // Store a new product
    public function store(Request $request): Product
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($validated);
        $product->setHidden(['updated_at', 'created_at']);

        return $product;
    }

    public function update(Request $request, Product $product): Product
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'required|string',
            'price' => 'sometimes|required|numeric',
            'image' => 'nullable|string',
            'stock' => 'sometimes|required|integer|min:0',
        ]);

        $product->update($validated);
        $product->setHidden(['updated_at', 'created_at']);

        return $product;
    }

    public function destroy(Product $product): JsonResponse
    {
        // Delete the image if it exists
        if ($product->image) {
            $imagePath = 'public/products/' . $product->image;
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
        }

        if ($product->delete()) {
            return response()->json(['message' => 'Product deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Failed to delete product.'], 400);
    }
}
