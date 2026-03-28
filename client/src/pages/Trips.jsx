import { useEffect, useState } from 'react';
import { createTrip, getTrips, deleteTrip } from '../services/tripService';
import { useNavigate } from 'react-router-dom';

function Trips() {
    const [form, setForm] = useState({
        destination: '',
        startDate: '',
        endDate: '',
    });

    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();

    // Fetch trips
    const fetchTrips = async () => {
        try {
            const res = await getTrips();
            setTrips(res.data.data);
        } catch (error) {
            console.error(error);
            alert('Failed to load trips');
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Create trip
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createTrip(form);
            alert('Trip created successfully');

            // Reset form
            setForm({
                destination: '',
                startDate: '',
                endDate: '',
            });

            fetchTrips();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating trip');
        }
    };

    // Delete trip
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // prevent click navigation

        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await deleteTrip(id);
            fetchTrips();
        } catch (error) {
            console.error(error);
            alert('Failed to delete trip');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 border-b border-slate-200 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight">Your Journeys 🛫</h1>
                        <p className="text-slate-500 font-medium italic">"The world is a book and those who do not travel read only one page."</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 italic">
                        {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Planned
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Create Trip Form */}
                    <div className="lg:col-span-5">
                        <div className="glass p-8 rounded-3xl shadow-xl shadow-slate-200/50 sticky top-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-indigo-600">✨</span>
                                New Adventure
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        placeholder="Where to next?"
                                        value={form.destination}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={form.startDate}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={form.endDate}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 group">
                                    <span>Create Trip</span>
                                    <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Trip List */}
                    <div className="lg:col-span-7 space-y-6">
                        <h2 className="text-xl font-bold mb-4 text-slate-400 uppercase tracking-widest">Upcoming & Past</h2>
                        
                        {trips.length === 0 ? (
                            <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-slate-200 bg-white/30">
                                <div className="text-6xl mb-4 opacity-50">🏔️</div>
                                <h3 className="text-xl font-bold text-slate-400">No destinations yet</h3>
                                <p className="text-slate-400 text-sm italic">Use the form to add your travel plans.</p>
                            </div>
                        ) : (
                            trips.map((trip) => (
                                <div
                                    key={trip._id}
                                    onClick={() => navigate(`/trips/${trip._id}`)}
                                    className="glass p-6 rounded-3xl group cursor-pointer hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-transparent hover:border-indigo-100 flex items-center gap-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors shrink-0">
                                        🏝️
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1 uppercase">
                                            {trip.destination}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                                            <span>📅</span>
                                            <span>
                                                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-indigo-300">→</span>
                                            <span>
                                                {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(trip._id, e)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Trip"
                                    >
                                        <span className="text-xs font-black">✕</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Trips;