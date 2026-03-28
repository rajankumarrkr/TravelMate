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
        return (
            <div className="min-h-screen hero-gradient flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium text-slate-500 animate-pulse">Loading your travels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight">TravelMate Dashboard</h1>
                        <p className="text-slate-500 font-medium">Welcome back! Here's what's happening with your trips.</p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/trips"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-2"
                        >
                            <span>Manage Trips</span>
                            <span className="text-xl">✈️</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 glass text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all border border-rose-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all border-b-4 border-indigo-500 group">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">📅</div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Trips</h2>
                        <p className="text-4xl font-black text-slate-800">{data.totalTrips}</p>
                    </div>

                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-100 transition-all border-b-4 border-emerald-500 group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">💰</div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Expenses</h2>
                        <p className="text-4xl font-black text-emerald-600">
                            ₹{data.totalExpenses}
                        </p>
                    </div>

                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-cyan-100 transition-all border-b-4 border-cyan-500 group sm:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🌍</div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming Trips</h2>
                        <p className="text-4xl font-black text-cyan-600">
                            {data.upcomingTripsCount}
                        </p>
                    </div>
                </div>

                {/* Recent Trips Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Adventures</h2>
                        <Link to="/trips" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
                    </div>

                    {data.recentTrips.length === 0 ? (
                        <div className="glass p-12 rounded-3xl text-center">
                            <div className="text-5xl mb-4">🎒</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No trips yet</h3>
                            <p className="text-slate-500 mb-6">Start your journey by creating your first trip.</p>
                            <Link to="/trips" className="text-indigo-600 font-bold hover:underline">Create a trip now &rarr;</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.recentTrips.map((trip) => (
                                <div
                                    key={trip._id}
                                    onClick={() => navigate(`/trips/${trip._id}`)}
                                    className="glass p-6 rounded-3xl hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">📍</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                {trip.destination}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-400">
                                                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} —{' '}
                                                {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-400 italic font-black">
                                        &rarr;
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;