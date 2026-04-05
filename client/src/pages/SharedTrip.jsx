import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedTrip } from '../services/tripService';

function SharedTrip() {
    const { token } = useParams();
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await getSharedTrip(token);
                setTrip(res.data.data);
            } catch (err) {
                console.error(err);
                setError(true);
            }
        };
        fetchTrip();
    }, [token]);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="glass p-12 rounded-[2.5rem] text-center max-w-lg">
                    <div className="text-6xl mb-6">💔</div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Trip Not Found</h2>
                    <p className="text-slate-500 font-medium mb-8">This shared link is invalid or may have expired. Please ask your friend to generate a new link!</p>
                    <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        Take me Home
                    </Link>
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-6 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Hero Header */}
                <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl h-80 flex items-end p-10 bg-indigo-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"></div>
                    
                    <div className="relative z-20 space-y-2 w-full flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${categoryConfig[trip.category || 'Other'].color}`}>
                                    {categoryConfig[trip.category || 'Other'].icon} {trip.category || 'Other'}
                                </span>
                                <span className="px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border bg-white/20 text-white border-white/50">
                                    ⭐ Shared Trip
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
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* Itinerary Section */}
                    <div>
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

                    {/* Trip Memories / Gallery Section */}
                    {trip.photos && trip.photos.length > 0 && (
                        <div className="mt-12 border-t border-slate-200 pt-16">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                    <span>📸</span>
                                    <span>Trip Memories</span>
                                </h2>
                            </div>

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
                        </div>
                    )}
                </div>

                <div className="text-center pt-12 pb-6 border-t border-slate-200">
                    <p className="text-slate-400 font-bold tracking-widest text-xs uppercase mb-4">Powered by</p>
                    <Link to="/" className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform">
                        TravelMate ✈️
                    </Link>
                    <p className="text-slate-500 font-medium text-sm mt-2">Plan your own incredible journeys today.</p>
                </div>
            </div>
        </div>
    );
}

export default SharedTrip;
