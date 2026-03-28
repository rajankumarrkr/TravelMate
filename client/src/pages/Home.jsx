import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen hero-gradient pt-32 px-6 flex flex-col items-center text-center">
            {/* Hero Section */}
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase">
                    Your Ultimate Travel Companion
                </span>
                
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
                    Plan smarter, travel <br />
                    <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        without boundaries.
                    </span>
                </h1>
                
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Organize your itineraries, track travel expenses, and discover new horizons with 
                    TravelMate. The all-in-one platform for modern adventurers.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link 
                        to="/register" 
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all scale-100 hover:scale-105 active:scale-95"
                    >
                        Get Started for Free
                    </Link>
                    <Link 
                        to="/login" 
                        className="px-8 py-4 glass text-slate-900 rounded-2xl font-bold hover:bg-white/50 transition-all"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Visual Asset Section */}
            <div className="mt-16 w-full max-w-5xl relative group">
                <div className="absolute inset-0 bg-indigo-400/20 blur-3xl rounded-full scale-90 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img 
                    src="/travel_hero_illustration_1774728345179.png" 
                    alt="Travel Illustration" 
                    className="relative rounded-3xl shadow-2xl border border-white/20 transform group-hover:-translate-y-2 transition-transform duration-500"
                />
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-20 max-w-6xl w-full">
                {[
                    { title: "Smart Itineraries", desc: "Plan every day with precision and ease.", icon: "🗺️" },
                    { title: "Expense Tracking", desc: "Keep your budget in check while roaming.", icon: "💰" },
                    { title: "Global Sync", desc: "Access your plans from any device, anywhere.", icon: "🌍" }
                ].map((feature, idx) => (
                    <div key={idx} className="glass p-8 rounded-3xl text-left hover:border-indigo-200 transition-colors group">
                        <div className="text-4xl mb-4 group-hover:scale-125 transition-transform inline-block">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;