<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
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
        // Generate a random start and end time (1–3 hours apart)
        $start = $this->faker->dateTimeBetween('now', '+1 week');
        $end = (clone $start)->modify('+' . $this->faker->numberBetween(1, 3) . ' hours');

        $user_id = User::inRandomOrder()->value('id') ?? User::factory();
        $service_id = Service::inRandomOrder()->value('id') ?? Service::factory();

        $status = $this->faker->randomElement(['pending', 'confirmed', 'cancelled']);

        return [
            'user_id' => $user_id,
            'service_id' => $service_id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => $status
        ];
    }
}
