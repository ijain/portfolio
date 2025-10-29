<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Service;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
     // List all services
    public function index(Request $request): LengthAwarePaginator
    {
        // Get 'per_page' from query params, default to 10
        $limit = (int) $request->query('limit', 10);

        // Optional: enforce a maximum limit for safety
        $limit = min($limit, 100);

        return Service::select('id', 'name', 'description')->paginate($limit);
    }

    // Store a new service
    public function store(Request $request): Service
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $service = Service::create($validated);
        $service->setHidden(['updated_at', 'created_at']);

        return $service;
    }

    // Show a single service
    public function show(Service $service): Service
    {
        $service->setHidden(['updated_at', 'created_at']);

        return $service;
    }

    // Update a service
    public function update(Request $request, Service $service): Service
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $service->update($validated);
        $service->setHidden(['updated_at', 'created_at']);

        return $service;
    }

    // Delete a service
    public function destroy(Service $service): JsonResponse
    {
         if ($service->delete()) {
            return response()->json(['message' => 'Service deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Failed to delete service.'], 400);
    }
}
