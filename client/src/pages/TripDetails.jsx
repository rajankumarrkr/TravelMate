import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { addExpense, getExpenses } from '../services/expenseService';

function TripDetails() {
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);

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

    if (!trip) {
        return (
            <div className="min-h-screen hero-gradient flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Hero Header */}
                <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl h-80 flex items-end p-10 bg-indigo-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"></div>
                    
                    <div className="relative z-20 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">Destinations</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic italic">
                            {trip.destination}
                        </h1>
                        <p className="text-indigo-100 font-bold tracking-widest text-xs">
                            {new Date(trip.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} —{' '}
                            {new Date(trip.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Itinerary Section */}
                    <div className="lg:col-span-12">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <span>🗺️</span>
                                <span>Journey Itinerary</span>
                            </h2>
                            <div className="px-4 py-2 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {trip.itinerary.length} Days Planned
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trip.itinerary.map((item) => (
                                <div key={item.day} className="glass group hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 rounded-[2rem] p-8 relative transition-all border-transparent hover:border-indigo-100 border">
                                    <div className="absolute top-8 right-8 text-4xl font-black text-indigo-50 group-hover:text-indigo-100 transition-colors">
                                        {item.day < 10 ? `0${item.day}` : item.day}
                                    </div>
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Day {item.day}</h3>
                                    <p className="text-slate-700 leading-relaxed font-semibold">
                                        {item.plan}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expense Section */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="glass rounded-[2.5rem] p-10 shadow-xl sticky top-32">
                            <h3 className="text-2xl font-black tracking-tight mb-8">Add Expense 💰</h3>
                            
                            <form onSubmit={handleAddExpense} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        name="category"
                                        onChange={handleChange}
                                        className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none cursor-pointer"
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
                                        className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
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
                                        className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium h-32"
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
                            <h2 className="text-3xl font-black tracking-tighter">Finance 📈</h2>
                            <div className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xl font-black shadow-lg shadow-indigo-100 tracking-tight">
                                ₹{total.toLocaleString()}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {expenses.length === 0 ? (
                                <div className="p-12 text-center glass rounded-[2rem] border-dashed border-2 border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No expenses logged</p>
                                </div>
                            ) : (
                                expenses.map((exp) => (
                                    <div key={exp._id} className="glass p-6 rounded-3xl hover:bg-white transition-all flex items-center justify-between group border border-transparent hover:border-indigo-100">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-slate-50 flex items-center justify-center text-3xl rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                                {exp.category === 'food' ? '🍱' : exp.category === 'travel' ? '✈️' : exp.category === 'hotel' ? '🏨' : '🎭'}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-1">{exp.category}</h4>
                                                <p className="font-bold text-slate-800 text-lg leading-none">
                                                    {exp.note || 'No description'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-slate-800 tracking-tight">
                                            ₹{exp.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripDetails;