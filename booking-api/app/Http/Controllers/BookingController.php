<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Booking;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function index(Request $request): LengthAwarePaginator
    {
         // Get 'per_page' from query params, default to 10
        $limit = (int) $request->query('limit', 10);

        // Optional: enforce a maximum limit for safety
        $limit = min($limit, 100);

        $booking = Booking::with(['service:id,name', 'user:id,name'])
            ->select('id', 'service_id', 'user_id', 'start_time', 'end_time', 'status')
            ->paginate($limit);

        $booking->setHidden(['service_id', 'user_id']);

        return $booking;
    }

    public function store(Request $request): Booking
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'sometimes|in:pending,confirmed,cancelled'
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = $validated['status'] ?? 'pending';

        $booking = Booking::create($validated);
        $booking->setHidden(['updated_at', 'created_at']);

        $booking->load(['service:id,name', 'user:id,name']);
        $booking->setHidden(['updated_at', 'created_at', 'service_id', 'user_id']);

        return $booking;
    }

    public function show(Booking $booking): Booking
    {
        $booking->load(['service:id,name', 'user:id,name']);
        $booking->setHidden(['updated_at', 'created_at', 'service_id', 'user_id']);

        return $booking;
    }

    public function update(Request $request, Booking $booking): Booking
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'status' => 'sometimes|required|in:pending,confirmed,cancelled',
        ]);

        $booking->update($validated);

        $booking->load(['service:id,name', 'user:id,name']);
        $booking->setHidden(['updated_at', 'created_at', 'service_id', 'user_id']);

        return $booking;
    }

    public function destroy(Booking $booking): JsonResponse
    {
        if ($booking->delete()) {
            return response()->json(['message' => 'Booking deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Failed to delete booking.'], 400);
    }
}
