<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Service;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user_id = User::inRandomOrder()->value('id') ?? User::factory();
        $service_id = Service::inRandomOrder()->value('id') ?? Service::factory();
        $date = $this->faker->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d');
        $time = $this->faker->dateTimeBetween('08:00', '19:00')->format('H:i');
        $duration_hours = $this->faker->numberBetween(0, 3);
        $duration_minutes = $this->faker->numberBetween(0, 60);
        $status = $this->faker->randomElement(['pending', 'confirmed', 'cancelled']);

        return [
            'user_id' => $user_id,
            'service_id' => $service_id,
            'date' => $date,
            'time' => $time,
            'duration_hours' => $duration_hours,
            'duration_minutes' => $duration_minutes,
            'status' => $status
        ];
    }
}
