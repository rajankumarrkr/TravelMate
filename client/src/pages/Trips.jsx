import { useEffect, useState } from 'react';
import { createTrip, getTrips, deleteTrip } from '../services/tripService';
import { useNavigate } from 'react-router-dom';

const categoryConfig = {
    'Adventure': { icon: '🧗', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    'Family':    { icon: '👨‍👩‍👧', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    'Solo':      { icon: '🎒', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
    'Romantic':  { icon: '💕', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' },
    'Business':  { icon: '💼', color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800' },
    'Magic AI':  { icon: '✨', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' },
    'Other':     { icon: '📍', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
};

function Trips() {
    const [form, setForm] = useState({ destination: '', startDate: '', endDate: '', category: 'Other' });
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTrips = async () => {
        try {
            const res = await getTrips();
            setTrips(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchTrips(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTrip(form);
            setForm({ destination: '', startDate: '', endDate: '', category: 'Other' });
            setShowForm(false);
            fetchTrips();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating trip');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this trip?')) return;
        try { await deleteTrip(id); fetchTrips(); }
        catch (err) { alert('Failed to delete'); }
    };

    const getDayCount = (start, end) => {
        const diff = new Date(end) - new Date(start);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-28 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pt-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight dark:text-white">Your Journeys 🛫</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95 flex items-center gap-2"
                    >
                        {showForm ? '✕ Close' : '+ New Trip'}
                    </button>
                </div>

                {/* Create Trip Form — collapsible */}
                {showForm && (
                    <div className="glass rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/40 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-lg font-black dark:text-white mb-5 flex items-center gap-2">
                            <span>✨</span> Plan a New Adventure
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Destination</label>
                                <input
                                    type="text" name="destination" placeholder="Where to next?"
                                    value={form.destination} onChange={handleChange} required
                                    className="w-full p-4 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Start Date</label>
                                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required
                                        className="w-full p-4 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">End Date</label>
                                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required
                                        className="w-full p-4 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Category</label>
                                <select name="category" value={form.category} onChange={handleChange}
                                    className="w-full p-4 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold">
                                    {Object.entries(categoryConfig).filter(([c]) => c !== 'Magic AI').map(([cat, cfg]) => (
                                        <option key={cat} value={cat}>{cfg.icon} {cat}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <><span>Launch Trip</span><span>🚀</span></>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Trip List */}
                {trips.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <div className="text-6xl mb-4">🏔️</div>
                        <h3 className="text-lg font-black text-slate-400 dark:text-slate-500">No trips yet</h3>
                        <p className="text-slate-400 text-sm mt-1">Tap "+ New Trip" to plan your first adventure</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {trips.map((trip) => {
                            const cfg = categoryConfig[trip.category || 'Other'];
                            const days = getDayCount(trip.startDate, trip.endDate);
                            const upcoming = new Date(trip.startDate) >= new Date();
                            return (
                                <div
                                    key={trip._id}
                                    onClick={() => navigate(`/trips/${trip._id}`)}
                                    className="glass rounded-3xl p-5 cursor-pointer group hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 active:scale-[0.99] flex items-center gap-4"
                                >
                                    {/* Icon Badge */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${cfg.color} border`}>
                                        {cfg.icon}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors truncate uppercase">
                                                {trip.destination}
                                            </h3>
                                            {upcoming && (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                                                    Upcoming
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                            <span>📅 {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="font-bold text-indigo-400">{days}d</span>
                                        </div>
                                    </div>

                                    {/* Delete / Arrow */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={(e) => handleDelete(trip._id, e)}
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 text-sm"
                                        >✕</button>
                                        <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-lg">›</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Trips;