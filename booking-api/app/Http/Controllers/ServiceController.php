<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(Request $request): LengthAwarePaginator
    {
        $limit = (int) $request->query('limit', 10);
        $limit = min($limit, 100);

        return Service::select('id', 'name', 'description')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);
    }

    public function store(Request $request): Service
    {
        $validated = $request->validate([
            'name' => 'required|string|max:60',
            'description' => 'required|string|max:255'
        ]);

        $service = Service::create($validated);
        $service->setHidden(['updated_at', 'created_at']);

        return $service;
    }

    public function show(Service $service): Service
    {
        $service->setHidden(['updated_at', 'created_at']);

        return $service;
    }

    public function update(Request $request, Service $service): Service
    {
        $validated = $request->validate([
            'name' => 'required|string|max:60',
            'description' => 'required|string|max:255'
        ]);

        $service->update($validated);
        $service->setHidden(['updated_at', 'created_at']);

        return $service;
    }

    public function destroy(Service $service): JsonResponse
    {
         if ($service->delete()) {
            return response()->json(['message' => 'Service deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Failed to delete service.'], 400);
    }
}
