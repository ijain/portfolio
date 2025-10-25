<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Product;

class ProductController extends Controller
{
    // List all products
    public function index(): Collection
    {
        return Product::all();
    }

    // Show a single product
    public function show(Product $product): Product
    {
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

        return Product::create($validated);
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

        return $product;
    }

    // Delete a product (returns 204 No Content)
    public function destroy(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }

    // Alias for destroy
    public function delete(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }
}
