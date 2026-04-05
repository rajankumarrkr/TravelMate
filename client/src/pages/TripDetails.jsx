import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById, uploadTripPhoto, generateShareToken } from '../services/tripService';
import { addExpense, getExpenses } from '../services/expenseService';
import TripMap from '../components/TripMap';

const categoryConfig = {
    'Adventure': { icon: '🧗', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200' },
    'Family':    { icon: '👨‍👩‍👧', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' },
    'Solo':      { icon: '🎒', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200' },
    'Romantic':  { icon: '💕', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200' },
    'Business':  { icon: '💼', color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/20 border-sky-200' },
    'Magic AI':  { icon: '✨', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200' },
    'Other':     { icon: '📍', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200' },
};

const expenseIcons = { food: '🍱', travel: '✈️', hotel: '🏨', other: '🎭' };

function SectionHeader({ icon, title, badge }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2">
                <span>{icon}</span><span>{title}</span>
            </h2>
            {badge && (
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {badge}
                </span>
            )}
        </div>
    );
}

function TripDetails() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [form, setForm] = useState({ category: 'food', amount: '', note: '' });

    const fetchTrip = async () => {
        const res = await getTripById(id);
        setTrip(res.data.data);
    };

    const fetchExpenses = async () => {
        const res = await getExpenses(id);
        setExpenses(res.data.data.expenses);
        setTotal(res.data.data.total);
    };

    useEffect(() => { fetchTrip(); fetchExpenses(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAddExpense = async (e) => {
        e.preventDefault();
        await addExpense({ ...form, tripId: id, amount: Number(form.amount) });
        setForm({ category: 'food', amount: '', note: '' });
        setShowExpenseForm(false);
        fetchExpenses();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            await uploadTripPhoto(id, formData);
            fetchTrip();
        } catch { alert('Failed to upload photo'); }
        finally { setUploading(false); }
    };

    const handleShareClick = async () => {
        setIsSharing(true);
        try {
            const res = await generateShareToken(id);
            const token = res.data.data.token;
            const shareUrl = `${window.location.origin}/shared/${token}`;
            await navigator.clipboard.writeText(shareUrl);
            alert('✅ Share link copied to clipboard!');
        } catch {
            alert('Failed to generate sharing link.');
        } finally { setIsSharing(false); }
    };

    if (!trip) {
        return (
            <div className="min-h-screen dark:bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-semibold">Loading trip…</p>
                </div>
            </div>
        );
    }

    const cfg = categoryConfig[trip.category || 'Other'];
    const budgetOver = trip.budget > 0 && total > trip.budget;
    const budgetPct = trip.budget > 0 ? Math.min((total / trip.budget) * 100, 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-28 md:pb-20">
            {/* Hero Banner */}
            <div className="relative h-56 sm:h-72 overflow-hidden bg-indigo-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                {/* Back button */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-20 left-4 z-10 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >‹</button>

                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-8">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2 ${cfg.color}`}>
                        {cfg.icon} {trip.category || 'Other'}
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                        {trip.destination}
                    </h1>
                    <p className="text-white/70 text-xs font-semibold mt-1">
                        📅 {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} → {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>

                {/* Share Button */}
                <button
                    onClick={handleShareClick}
                    disabled={isSharing}
                    className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-10 px-4 py-2.5 bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-sm hover:bg-white/25 transition-all flex items-center gap-2"
                >
                    {isSharing ? '⏳' : '🔗'} {isSharing ? 'Generating…' : 'Share'}
                </button>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

                {/* Budget Summary Card */}
                <div className="glass rounded-3xl p-5 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Budget Tracker</p>
                            <p className={`text-2xl font-black ${budgetOver ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
                                ₹{total.toLocaleString()}
                                {trip.budget > 0 && <span className="text-sm font-semibold text-slate-400 ml-1">/ ₹{trip.budget.toLocaleString()}</span>}
                            </p>
                        </div>
                        {budgetOver && (
                            <div className="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-black text-rose-600 text-right">
                                🚨 Over by<br />₹{(total - trip.budget).toLocaleString()}
                            </div>
                        )}
                    </div>
                    {trip.budget > 0 && (
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${budgetOver ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                style={{ width: `${budgetPct}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Map Section */}
                <div>
                    <SectionHeader icon="🗺️" title="Destination Map" badge="Live" />
                    <TripMap destination={trip.destination} />
                </div>

                {/* Itinerary — Timeline Style */}
                <div>
                    <SectionHeader icon="🗓️" title="Journey Itinerary" badge={`${trip.itinerary.length} Days`} />
                    <div className="space-y-0">
                        {trip.itinerary.map((item, idx) => (
                            <div key={item.day} className="flex gap-4 group">
                                {/* Timeline spine */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 group-hover:scale-110 transition-transform">
                                        {String(item.day).padStart(2, '0')}
                                    </div>
                                    {idx < trip.itinerary.length - 1 && (
                                        <div className="w-0.5 flex-1 min-h-[1.5rem] bg-indigo-100 dark:bg-slate-700 my-1" />
                                    )}
                                </div>
                                {/* Content */}
                                <div className={`glass rounded-3xl p-4 w-full mb-3 hover:shadow-md transition-all ${idx < trip.itinerary.length - 1 ? 'mb-3' : ''}`}>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Day {item.day}</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">{item.plan}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expenses Section */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2">
                            <span>💸</span><span>Expenses</span>
                        </h2>
                        <button
                            onClick={() => setShowExpenseForm(!showExpenseForm)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200"
                        >
                            {showExpenseForm ? '✕ Close' : '+ Add'}
                        </button>
                    </div>

                    {/* Expense Form */}
                    {showExpenseForm && (
                        <div className="glass rounded-3xl p-5 mb-4 border border-white/40 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <form onSubmit={handleAddExpense} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                                        <select name="category" onChange={handleChange}
                                            className="w-full p-3 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="food">🍱 Food</option>
                                            <option value="travel">✈️ Transport</option>
                                            <option value="hotel">🏨 Hotel</option>
                                            <option value="other">🎭 Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Amount (₹)</label>
                                        <input type="number" name="amount" placeholder="0" value={form.amount}
                                            onChange={handleChange} required
                                            className="w-full p-3 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Note</label>
                                    <input name="note" placeholder="e.g. Lunch at the beach..." value={form.note}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <button className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-black dark:hover:bg-indigo-700 active:scale-95 transition-all">
                                    Record Expense →
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Expense List */}
                    {expenses.length === 0 ? (
                        <div className="glass rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">No expenses logged yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {expenses.map((exp) => (
                                <div key={exp._id} className="glass rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:shadow-md transition-all group">
                                    <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                        {expenseIcons[exp.category] || '💸'}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{exp.note || 'No description'}</p>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{exp.category}</p>
                                    </div>
                                    <p className="font-black text-slate-800 dark:text-white text-base shrink-0">₹{exp.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trip Memories */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2">
                            <span>📸</span><span>Memories</span>
                        </h2>
                        <div className="relative">
                            <input type="file" onChange={handleFileChange} accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" disabled={uploading} />
                            <button disabled={uploading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-200">
                                {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '+ Photo'}
                            </button>
                        </div>
                    </div>

                    {trip.photos && trip.photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {trip.photos.map((photo, idx) => (
                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden group relative shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all">
                                    <img src={photo.url} alt="memory" loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Memory {idx + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="text-4xl mb-3 opacity-40">🖼️</div>
                            <p className="text-slate-400 text-sm font-semibold">No photos yet. Add your first memory!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TripDetails;