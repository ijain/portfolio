<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function index(Request $request): LengthAwarePaginator
    {
        $limit = (int) $request->query('limit', 10);
        $limit = min($limit, 100);

        $booking = Booking::with(['service:id,name', 'user:id,name'])
            ->select('id', 'user_id', 'service_id', 'date', 'time',
                'duration_hours', 'duration_minutes', 'status')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        $booking->setHidden(['service_id', 'user_id']);

        return $booking;
    }

    public function store(Request $request): Booking
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'time' => 'required|time',
            'duration_hours' => 'sometimes|integer',
            'duration_minutes' => 'sometimes|integer',
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
            'date' => 'required|date',
            'time' => 'required|time',
            'duration_hours' => 'sometimes|integer',
            'duration_minutes' => 'sometimes|integer',
            'status' => 'sometimes|in:pending,confirmed,cancelled'
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
