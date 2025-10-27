<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;

class ServiceController extends Controller
{
     // List all services
    public function index(): Collection
    {
        return Service::all();
    }

    // Store a new service
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $service = Service::create($validated);

        return response($service, 201); // explicit 201 Created
    }

    // Show a single service
    public function show(Service $service): Service
    {
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

        return $service;
    }

    // Delete a service
    public function destroy(Service $service): Response
    {
        $service->delete();

        return response()->noContent(); // clean 204 response
    }
}
