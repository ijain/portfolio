<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    // List all services
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

    // Store a new service
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $service = Service::create($request->all());

        return response()->json($service, 201);
    }

    // Show a single service
    public function show(Service $service)
    {
        return response()->json($service, 200);
    }

    // Update a service
    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $service->update($request->all());

        return response()->json($service, 200);
    }

    // Delete a service
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(null, 204);
    }
}
