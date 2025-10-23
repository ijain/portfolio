<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(Booking::with(['user', 'service'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $validated['user_id'] = auth()->id();

        return Booking::create($validated);
    }

    public function show(Booking $booking)
    {
        $booking->load(['user', 'service']);

        return response()->json($booking, 200);
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'status' => 'sometimes|required|in:pending,confirmed,completed,cancelled',
        ]);

        $booking->update($validated);

        return response()->json($booking, 200);
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        
        return response()->json(null, 204);
    }
}
