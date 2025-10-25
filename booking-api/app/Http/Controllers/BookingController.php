<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;

class BookingController extends Controller
{
    public function index(): Collection
    {
        return Booking::with(['user', 'service'])->get();
    }

    public function store(Request $request): Booking
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $validated['user_id'] = auth()->id();

        $booking = Booking::create($validated);

        return $booking;
    }

    public function show(Booking $booking): Booking
    {
        $booking->load(['user', 'service']);

        return $booking;
    }

    public function update(Request $request, Booking $booking): Booking
    {
        $validated = $request->validate([
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'status' => 'sometimes|required|in:pending,confirmed,completed,cancelled',
        ]);

        $booking->update($validated);

        return $booking;
    }

    public function destroy(Booking $booking): Response
    {
        $booking->delete();

        return response()->noContent(); // clean 204 response
    }
}
