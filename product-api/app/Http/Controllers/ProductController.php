<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    // List all products
    public function index(Request $request): LengthAwarePaginator
    {
         // Get 'per_page' from query params, default to 10
        $limit = (int) $request->query('limit', 10);

        // Optional: enforce a maximum limit for safety
        $limit = min($limit, 100);

        return Product::select([ 'name', 'description', 'price', 'stock'])->paginate($limit);
    }

    // Show a single product
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
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'image' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($validated);
        $product->setHidden(['updated_at', 'created_at']);

        return $product;
    }

    // Update an existing product
    public function update(Request $request, Product $product): Product
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'image' => 'nullable|string',
            'stock' => 'sometimes|required|integer|min:0',
        ]);

        $product->update($validated);
        $product->setHidden(['updated_at', 'created_at']);

        return $product;
    }

    // Delete a product
    public function destroy(Product $product): JsonResponse
    {
         if ($product->delete()) {
            return response()->json(['message' => 'Product deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Failed to delete product.'], 400);
    }
}
