import { useEffect, useState } from 'react';
import { getDashboard } from '../services/dashboardService';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboard();
                setData(res.data.data);
            } catch (error) {
                console.error(error);
                alert('Failed to load dashboard');
            }
        };

        fetchData();
    }, []);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!data) {
        return <div className="p-10 text-xl">Loading dashboard...</div>;
    }

    return (
        <div className="p-10 min-h-screen bg-gray-100">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">TravelMate Dashboard ✈️</h1>

                <div className="flex gap-3">
                    <Link
                        to="/trips"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Manage Trips
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 shadow rounded bg-white">
                    <h2 className="text-lg text-gray-500">Total Trips</h2>
                    <p className="text-3xl font-bold">{data.totalTrips}</p>
                </div>

                <div className="p-6 shadow rounded bg-white">
                    <h2 className="text-lg text-gray-500">Total Expenses</h2>
                    <p className="text-3xl font-bold text-green-600">
                        ₹{data.totalExpenses}
                    </p>
                </div>

                <div className="p-6 shadow rounded bg-white">
                    <h2 className="text-lg text-gray-500">Upcoming Trips</h2>
                    <p className="text-3xl font-bold text-blue-600">
                        {data.upcomingTripsCount}
                    </p>
                </div>
            </div>

            {/* Recent Trips */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Recent Trips</h2>

                {data.recentTrips.length === 0 ? (
                    <p className="text-gray-500">No trips yet. Start planning!</p>
                ) : (
                    <div className="space-y-4">
                        {data.recentTrips.map((trip) => (
                            <div
                                key={trip._id}
                                className="p-4 shadow rounded bg-white"
                            >
                                <h3 className="text-xl font-semibold">
                                    {trip.destination}
                                </h3>

                                <p className="text-gray-600">
                                    {new Date(trip.startDate).toDateString()} —{' '}
                                    {new Date(trip.endDate).toDateString()}
                                </p>

                                <p className="text-sm text-gray-400 mt-1">
                                    Created: {new Date(trip.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;