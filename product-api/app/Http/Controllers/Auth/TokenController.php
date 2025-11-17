<?php
declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TokenController extends Controller
{
    /*
     * Generate a demo token for the first user in the database.
     */
   public function generateTestToken()
    {
        $user = User::first();

        if (!$user) {
            return response()->json([
                'message' => 'No users found. Please run the factory/seeder first.'
            ], 404);
        }

        $token = $user->createToken('DemoToken')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token
        ]);
    }

    /*
     * Generate Swagger token via email/password.
     */
    public function generateToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }
        
        $token = $user->createToken('DemoToken', [], now()->addHours(2))->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token
        ]);
    }
}
