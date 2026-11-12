import { router } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold">Welcome, {auth.user.name}!</h1>
                    <p className="text-sm text-gray-500">
                        Saved City: {auth.user.city ? auth.user.city : 'None selected yet'}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
