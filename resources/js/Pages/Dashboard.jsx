import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

export default function Dashboard({ auth, forecast, apiError, lastUpdated, cities = [] }) {
    const [isChangingCity, setIsChangingCity] = useState(!auth.user.city);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        city: auth.user.city || '',
    });

    const handleCitySubmit = (e) => {
        e.preventDefault();
        post('/dashboard/city', {
            onSuccess: () => setIsChangingCity(false),
        });
    };  

    
    const handleRefresh = () => {
        setIsRefreshing(true);
        router.post('/dashboard/refresh', {}, {
            preserveScroll: true,
            onFinish: () => setIsRefreshing(false),
        });
    };


    const handleLogout = () => {
        router.post('/logout');
    };

    const formattedLastUpdated = new Date(lastUpdated).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    });


    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-CA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-900">
            <div>
                <header className="bg-white shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-lg font-semibold">Weather Forecast</h1>
                            <p className="text-xs text-gray-500">Signed in as {auth.user.name}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 py-8">
                    {isChangingCity ? (
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-1">
                                {auth.user.city ? 'Change Your City' : 'Select Your City'}
                            </h2>
                            <p className="text-sm text-gray-500 mb-5">
                                Search and select a city to view its 5-day weather forecast.
                            </p>

                            <form onSubmit={handleCitySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <select
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
                                        required
                                    >
                                        <option value="" disabled>Select a city...</option>
                                        {cities.map((cityName) => (
                                            <option key={cityName} value={cityName}>
                                                {cityName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                    )}
                                </div>


                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.city}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save City'}
                                    </button>

                                    {auth.user.city && (
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingCity(false)}
                                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold">{auth.user.city}</h2>
                                        <button
                                            onClick={() => setIsChangingCity(true)}
                                            className="text-xs text-blue-600 hover:underline font-medium"
                                        >
                                            Change City
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        5-Day Inclusive Forecast • Last updated at {formattedLastUpdated}

                                    </p>
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition disabled:opacity-50 self-start sm:self-auto"
                                >
                                    {isRefreshing ? 'Refreshing...' : 'Refresh Forecast'}
                                </button>
                            </div>

                            {apiError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                    {apiError}
                                </div>
                            )}

                            {forecast && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {forecast.map((day, index) => (
                                        <div
                                            key={day.date}
                                            className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
                                        >
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                                    {index === 0 ? 'Today' : formatDate(day.date)}
                                                </p>
                                                <p className="text-xs text-gray-400 mb-4">{day.date}</p>
                                                <p className="text-base font-medium text-gray-800 mb-3">
                                                    {day.condition}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-2xl font-bold">{day.temp_max}&deg;C</span>
                                                    <span className="text-sm text-gray-400">
                                                        Low {day.temp_min}&deg;C
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Precip chance: {day.precip_chance}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <footer className="py-6 text-center text-xs text-gray-400">
                Weather data provided by{' '}
                <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-gray-600"
                >
                    Open-Meteo API
                </a>
            </footer>
        </div>
    );
}
