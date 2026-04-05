import { useState } from 'react';
import { generateMagicPlan } from '../services/aiService';
import { createTrip } from '../services/tripService';
import { useNavigate } from 'react-router-dom';

function AITripPlanner() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const navigate = useNavigate();

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setItinerary(null);

        try {
            const res = await generateMagicPlan(prompt);
            setItinerary(res.data.data);
        } catch (error) {
            console.error(error);
            alert('Magic failed! Please try again with a clearer prompt.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsTrip = async () => {
        if (!itinerary) return;

        try {
            const tripData = {
                destination: itinerary.destination,
                startDate: new Date().toISOString(), // Default to today
                endDate: new Date(Date.now() + (itinerary.totalDays - 1) * 24 * 60 * 60 * 1000).toISOString(),
                budget: itinerary.estimatedTotalCost,
                itinerary: itinerary.itinerary,
                category: 'Magic AI',
                notes: `Generated from prompt: "${prompt}"`,
            };

            await createTrip(tripData);
            alert('Trip saved to your dashboard! ✨');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to save trip. Try again.');
        }
    };

    return (
        <div className="min-h-screen hero-gradient pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 bg-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-200 animate-pulse">
                        Supercharged by AI ⚡
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
                        Magic Trip Planner
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Describe your dream trip in one sentence, and let our AI craft the perfect itinerary for you.
                    </p>
                </div>

                {/* Input Section */}
                <div className="glass p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                        <textarea
                            className="w-full p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-slate-500 text-xl font-medium focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all min-h-[120px] shadow-sm"
                            placeholder="e.g., 5-day luxury adventure in Bali with beach clubs and surfing..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                        />
                        
                        <div className="flex flex-wrap gap-3">
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider ml-1 self-center">Quick Ideas:</span>
                            {['3-day budget Delhi', 'Honeymoon in Goa', 'Weekend trek in Munnar'].map(idea => (
                                <button
                                    key={idea}
                                    type="button"
                                    onClick={() => setPrompt(idea)}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-all active:scale-95 shadow-sm"
                                >
                                    {idea}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Consulting the Travel Gods...</span>
                                </>
                            ) : (
                                <>
                                    <span>Generate Magic Plan</span>
                                    <span className="group-hover:rotate-12 transition-transform">✨</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                {itinerary && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white">{itinerary.destination}</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                                    {itinerary.totalDays} Days • Estimated Budget: ₹{itinerary.estimatedTotalCost.toLocaleString()}
                                </p>
                            </div>
                            <button 
                                onClick={handleSaveAsTrip}
                                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
                            >
                                <span>Save this Trip</span>
                                <span>💾</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {itinerary.itinerary.map((day) => (
                                <div key={day.day} className="glass overflow-hidden rounded-3xl flex flex-col md:flex-row group hover:shadow-xl transition-all border border-slate-100">
                                    <div className="md:w-32 bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/50 transition-colors">
                                        <span className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-tighter">Day</span>
                                        <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{day.day}</span>
                                    </div>
                                    <div className="flex-1 p-8 space-y-6">
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{day.title}</h3>
                                        
                                        <ul className="space-y-3">
                                            {day.activities.map((act, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                                    <span className="text-emerald-500 mt-1">✓</span>
                                                    {act}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-lg">🍔</div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Eat</span>
                                                    <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">{day.foodSuggestion}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-lg">🏨</div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Stay</span>
                                                    <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">{day.staySuggestion}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AITripPlanner;
