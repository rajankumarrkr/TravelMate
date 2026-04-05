import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById, uploadTripPhoto, generateShareToken } from '../services/tripService';
import { addExpense, getExpenses } from '../services/expenseService';
import TripMap from '../components/TripMap';

function TripDetails() {
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const [form, setForm] = useState({
        category: 'food',
        amount: '',
        note: '',
    });

    // Fetch trip
    const fetchTrip = async () => {
        const res = await getTripById(id);
        setTrip(res.data.data);
    };

    // Fetch expenses
    const fetchExpenses = async () => {
        const res = await getExpenses(id);
        setExpenses(res.data.data.expenses);
        setTotal(res.data.data.total);
    };

    useEffect(() => {
        fetchTrip();
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        await addExpense({
            ...form,
            tripId: id,
            amount: Number(form.amount),
        });

        setForm({ category: 'food', amount: '', note: '' });
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
            fetchTrip(); // Refresh to get the new photos
        } catch (error) {
            console.error(error);
            alert('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const handleShareClick = async () => {
        setIsSharing(true);
        try {
            const res = await generateShareToken(id);
            const token = res.data.data.token;
            const shareUrl = `${window.location.origin}/shared/${token}`;
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard! You can now share this trip with friends.');
        } catch (error) {
            console.error(error);
            alert('Failed to generate sharing link.');
        } finally {
            setIsSharing(false);
        }
    };

    if (!trip) {
        return (
            <div className="min-h-screen hero-gradient flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const categoryConfig = {
        'Adventure': { icon: '🧗', color: 'text-amber-600 bg-amber-50/90 border-amber-200' },
        'Family': { icon: '👨‍👩‍👧', color: 'text-emerald-600 bg-emerald-50/90 border-emerald-200' },
        'Solo': { icon: '🎒', color: 'text-purple-600 bg-purple-50/90 border-purple-200' },
        'Romantic': { icon: '💕', color: 'text-rose-600 bg-rose-50/90 border-rose-200' },
        'Business': { icon: '💼', color: 'text-sky-600 bg-sky-50/90 border-sky-200' },
        'Magic AI': { icon: '✨', color: 'text-indigo-600 bg-indigo-50/90 border-indigo-200' },
        'Other': { icon: '📍', color: 'text-slate-600 bg-slate-50/90 border-slate-200' },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Hero Header */}
                <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl h-80 flex items-end p-10 bg-indigo-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"></div>
                    
                    <div className="relative z-20 space-y-2 w-full flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${categoryConfig[trip.category || 'Other'].color}`}>
                                    {categoryConfig[trip.category || 'Other'].icon} {trip.category || 'Other'}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic mt-2">
                                {trip.destination}
                            </h1>
                            <p className="text-indigo-100 font-bold tracking-widest text-xs">
                                {new Date(trip.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} —{' '}
                                {new Date(trip.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        
                        <button
                            onClick={handleShareClick}
                            disabled={isSharing}
                            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 shadow-xl whitespace-nowrap"
                        >
                            {isSharing ? 'Generating...' : '🔗 Share Trip'}
                        </button>
                    </div>
                </div>

                {/* Interactive Map */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-2">
                            <span>🗺️</span>
                            <span>Destination Map</span>
                        </h2>
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800">
                            Live
                        </span>
                    </div>
                    <TripMap destination={trip.destination} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Itinerary Section */}
                    <div className="lg:col-span-12">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 dark:text-white">
                                <span>🗺️</span>
                                <span>Journey Itinerary</span>
                            </h2>
                            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {trip.itinerary.length} Days Planned
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trip.itinerary.map((item) => (
                                <div key={item.day} className="glass group hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xl hover:shadow-indigo-100 rounded-[2rem] p-8 relative transition-all border-transparent hover:border-indigo-100 border">
                                    <div className="absolute top-8 right-8 text-4xl font-black text-indigo-50 dark:text-slate-700 group-hover:text-indigo-100 transition-colors">
                                        {item.day < 10 ? `0${item.day}` : item.day}
                                    </div>
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Day {item.day}</h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                                        {item.plan}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expense Section */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="glass rounded-[2.5rem] p-10 shadow-xl sticky top-32">
                            <h3 className="text-2xl font-black tracking-tight mb-8 dark:text-white">Add Expense 💰</h3>
                            
                            <form onSubmit={handleAddExpense} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        name="category"
                                        onChange={handleChange}
                                        className="w-full p-5 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="food">🍱 Food & Dining</option>
                                        <option value="travel">✈️ Transport</option>
                                        <option value="hotel">🏨 Accommodation</option>
                                        <option value="other">🎭 Entertainment</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        value={form.amount}
                                        className="w-full p-5 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note / Detail</label>
                                    <textarea
                                        name="note"
                                        placeholder="Lunch at the pier..."
                                        value={form.note}
                                        className="w-full p-5 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium h-32"
                                        onChange={handleChange}
                                    />
                                </div>

                                <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-black hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                    <span>Record Expense</span>
                                    <span className="group-hover:rotate-12 transition-transform">&rarr;</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Expense List Section */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tighter dark:text-white">Finance 📈</h2>
                            <div className={`px-6 py-3 text-white rounded-2xl text-xl font-black shadow-lg tracking-tight ${total > trip.budget ? 'bg-rose-600 shadow-rose-200' : 'bg-indigo-600 shadow-indigo-100'}`}>
                                ₹{total.toLocaleString()} <span className="opacity-60 text-sm font-medium">/ ₹{trip.budget?.toLocaleString() || 0}</span>
                            </div>
                        </div>

                        {/* Budget Limit Alert */}
                        {trip.budget > 0 && total > trip.budget && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
                                <div className="text-2xl mt-0.5">🚨</div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest opacity-80 mb-1">Budget Exceeded</h3>
                                    <p className="font-semibold text-sm">
                                        You exceeded your budget of ₹{trip.budget.toLocaleString()} by ₹{(total - trip.budget).toLocaleString()}!
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {expenses.length === 0 ? (
                                <div className="p-12 text-center glass rounded-[2rem] border-dashed border-2 border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No expenses logged</p>
                                </div>
                            ) : (
                                expenses.map((exp) => (
                                    <div key={exp._id} className="glass p-6 rounded-3xl hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-between group border border-transparent hover:border-indigo-100">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl rounded-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 transition-colors">
                                                {exp.category === 'food' ? '🍱' : exp.category === 'travel' ? '✈️' : exp.category === 'hotel' ? '🏨' : '🎭'}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-1">{exp.category}</h4>
                                                <p className="font-bold text-slate-800 dark:text-white text-lg leading-none">
                                                    {exp.note || 'No description'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                            ₹{exp.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Trip Memories / Gallery Section */}
                    <div className="lg:col-span-12 mt-12 border-t border-slate-200 dark:border-slate-700 pt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 dark:text-white">
                                <span>📸</span>
                                <span>Trip Memories</span>
                            </h2>
                            
                            <div className="relative overflow-hidden group">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                                    disabled={uploading}
                                />
                                <button 
                                    disabled={uploading}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group-hover:-translate-y-1 active:translate-y-0"
                                >
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <span>+ Add Photo</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {trip.photos && trip.photos.length > 0 ? (
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                {trip.photos.map((photo, idx) => (
                                    <div key={idx} className="break-inside-avoid relative group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-transparent hover:border-indigo-100 bg-white">
                                        <img 
                                            src={photo.url} 
                                            alt="Trip memory" 
                                            loading="lazy"
                                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <span className="text-white font-bold text-sm tracking-widest uppercase">Memory {idx + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass p-16 rounded-[3rem] text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                                <div className="text-5xl mb-4 opacity-50">🖼️</div>
                                <h3 className="text-xl font-bold text-slate-400">No photos uploaded yet</h3>
                                <p className="text-slate-400 text-sm mt-2">Upload your favorite memories to build your gallery.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripDetails;