<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WeatherController extends Controller
{
    public function __construct(private WeatherService $weatherService)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $forecast = null;
        $apiError = null;

        if ($user->city && $user->latitude && $user->longitude) {
            $forecast = $this->weatherService->getFiveDayForecast(
                (float) $user->latitude,
                (float) $user->longitude
            );

            if ($forecast === null) {
                $apiError = 'Unable to retrieve weather data right now. Please try refreshing.';
            }
        }

        return Inertia::render('Dashboard', [
            'forecast' => $forecast,
            'apiError' => $apiError,
            'lastUpdated' => ($user->updated_at ?? now())->toIso8601String(),
            'cities' => array_keys(config('cities')),
        ]);
    }

    public function updateCity(Request $request)
    {
        $availableCities = config('cities');

        $request->validate([
            'city' => ['required', 'string', Rule::in(array_keys($availableCities))],
        ]);

        $selected = $request->input('city');

        $request->user()->update([
            'city' => $selected,
            'latitude' => $availableCities[$selected]['latitude'],
            'longitude' => $availableCities[$selected]['longitude'],
        ]);

        return redirect()->route('dashboard');
    }

    public function refresh(Request $request)
    {
        $request->user()->touch();

        return redirect()->route('dashboard');
    }

}
