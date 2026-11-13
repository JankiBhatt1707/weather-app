<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    public function getFiveDayForecast(float $latitude, float $longitude): ?array
    {
        $host = 'api.' . 'open-meteo.' . 'com';
        $url = 'https://' . $host . '/v1/forecast';


        $response = Http::timeout(10)->get($url, [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'daily' => 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
            'timezone' => 'auto',
            'forecast_days' => 5,
        ]);

        if ($response->failed()) {
            return null;
        }

        $daily = $response->json('daily');

        if (!is_array($daily) || empty($daily['time'])) {
            return null;
        }

        $forecast = [];
        $count = count($daily['time']);

        for ($i = 0; $i < $count; $i++) {
            $forecast[] = [
                'date' => $daily['time'][$i],
                'condition' => $this->mapWeatherCode((int) ($daily['weather_code'][$i] ?? 0)),
                'temp_max' => round($daily['temperature_2m_max'][$i] ?? 0),
                'temp_min' => round($daily['temperature_2m_min'][$i] ?? 0),
                'precip_chance' => $daily['precipitation_probability_max'][$i] ?? 0,
            ];
        }

        return $forecast;
    }

    private function mapWeatherCode(int $code): string
    {
        if ($code === 0) {
            return 'Clear sky';
        }
        if ($code <= 3) {
            return 'Partly cloudy';
        }
        if ($code <= 48) {
            return 'Foggy';
        }
        if ($code <= 67 || ($code >= 80 && $code <= 82)) {
            return 'Rain';
        }
        if ($code <= 77 || ($code >= 85 && $code <= 86)) {
            return 'Snow';
        }
        if ($code >= 95) {
            return 'Thunderstorm';
        }

        return 'Cloudy';
    }
}
