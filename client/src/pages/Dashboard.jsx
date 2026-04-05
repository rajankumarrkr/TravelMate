import { useEffect, useState } from 'react';
import { getDashboard } from '../services/dashboardService';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

function Dashboard() {
    const { t } = useTranslation();
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">{t('dashboard.title')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.subtitle')}</p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/trips"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-2"
                        >
                            <span>{t('dashboard.manage_trips')}</span>
                            <span className="text-xl">✈️</span>
                        </Link>

                        <Link
                            to="/ai-planner"
                            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center gap-2"
                        >
                            <span className="text-xl">✨</span>
                            <span>{t('navbar.magic_ai')}</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 glass text-rose-600 rounded-2xl font-bold hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all border border-rose-100 dark:border-rose-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Notification Center */}
                {data.notifications && data.notifications.length > 0 && (
                    <div className="mb-12 space-y-4">
                        {data.notifications.map((note) => (
                            <div 
                                key={note.id} 
                                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                                    note.isCritical 
                                        ? 'bg-rose-50 border-rose-200 text-rose-800' 
                                        : note.type === 'reminder'
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                                        : 'bg-amber-50 border-amber-200 text-amber-800'
                                } shadow-sm animate-in fade-in slide-in-from-top-4`}
                            >
                                <div className="text-2xl">
                                    {note.type === 'reminder' ? '📅' : note.isCritical ? '🚨' : '⚠️'}
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest opacity-80 mb-0.5">{note.title}</h3>
                                    <p className="font-semibold text-sm">{note.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all border-b-4 border-indigo-500 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">📅</div>
                            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.total_trips')}</h2>
                            <p className="text-4xl font-black text-slate-800 dark:text-white">{data.totalTrips}</p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-100 transition-all border-b-4 border-emerald-500 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">💰</div>
                            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.total_expenses')}</h2>
                            <p className="text-4xl font-black text-emerald-600">
                                ₹{data.totalExpenses}
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-cyan-100 transition-all border-b-4 border-cyan-500 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🌍</div>
                            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.upcoming_trips')}</h2>
                            <p className="text-4xl font-black text-cyan-600">
                                {data.upcomingTripsCount}
                            </p>
                        </div>
                    </div>
                    
                    <div className="glass p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-100 transition-all border-b-4 border-purple-500 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">⏳</div>
                            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.days_traveled')}</h2>
                            <p className="text-4xl font-black text-purple-600">
                                {data.totalDaysTraveled || 0}
                            </p>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-4 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 py-1.5 px-3 rounded-lg inline-block w-fit">
                            {t('dashboard.avg_days', { count: data.avgTripDuration || 0 })}
                        </p>
                    </div>
                </div>

                {/* Advanced Analytics */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight dark:text-white">{t('dashboard.advanced_analytics')}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Expense by Category Chart */}
                        <div className="glass p-8 rounded-3xl shadow-sm w-full">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{t('dashboard.expense_by_category')}</h3>
                            {data.expenseByCategory && data.expenseByCategory.length > 0 ? (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.expenseByCategory}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {data.expenseByCategory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => `₹${value.toLocaleString()}`}
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-80 flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    {t('dashboard.no_expense_data')}
                                </div>
                            )}
                        </div>

                        {/* Monthly Spending Chart */}
                        <div className="glass p-8 rounded-3xl shadow-sm w-full">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{t('dashboard.monthly_spending')}</h2>
                            {data.monthlySpending && data.monthlySpending.length > 0 ? (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.monthlySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis 
                                                dataKey="month" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#f8fafc' }}
                                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar 
                                                dataKey="amount" 
                                                fill="#4f46e5" 
                                                radius={[6, 6, 6, 6]} 
                                                barSize={40}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-80 flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    {t('dashboard.no_timeline_data')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Trips Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight dark:text-white">{t('dashboard.recent_adventures')}</h2>
                        <Link to="/trips" className="text-sm font-bold text-indigo-600 hover:underline">{t('dashboard.view_all')}</Link>
                    </div>

                    {data.recentTrips.length === 0 ? (
                        <div className="glass p-12 rounded-3xl text-center">
                            <div className="text-5xl mb-4">🎒</div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('dashboard.no_trips_yet')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">Start your journey by creating your first trip.</p>
                            <Link to="/trips" className="text-indigo-600 font-bold hover:underline">{t('dashboard.create_trip_now')}</Link>
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
                                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 transition-colors">📍</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
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