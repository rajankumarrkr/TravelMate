import { Link } from 'react-router-dom';

const features = [
    { title: 'Smart Itineraries', desc: 'AI-powered daily plans for every destination.', icon: '🗺️' },
    { title: 'Expense Tracking', desc: 'Keep your budget in check while roaming.', icon: '💰' },
    { title: 'Share & Explore', desc: 'Share trips with friends via a public link.', icon: '🔗' },
];

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            {/* Hero */}
            <div className="max-w-5xl mx-auto px-4 pt-28 pb-16 flex flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                    ✨ Your Ultimate Travel Companion
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
                    Plan smarter,<br />
                    travel{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        without limits.
                    </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-10 leading-relaxed">
                    Organize itineraries, track expenses, and explore the world — all in one beautifully designed app.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link
                        to="/register"
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 text-center"
                    >
                        Get Started — It's Free
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 glass text-slate-800 dark:text-white rounded-2xl font-bold text-base hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
                    >
                        Sign In →
                    </Link>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="glass p-6 rounded-3xl hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 text-left group cursor-default"
                    >
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                        <h3 className="font-black text-slate-800 dark:text-white text-lg mb-1">{f.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* Stats strip */}
            <div className="glass border-t border-b border-white/30 dark:border-slate-700/40 py-8">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
                    {[
                        { val: '10K+', label: 'Trips Planned' },
                        { val: '50+', label: 'Countries' },
                        { val: '4.9 ⭐', label: 'User Rating' },
                    ].map((s, i) => (
                        <div key={i}>
                            <p className="text-2xl sm:text-3xl font-black text-indigo-600">{s.val}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/30">
                    <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready for your next adventure?</h2>
                    <p className="text-indigo-100 mb-6 text-sm sm:text-base">Join thousands of travelers using TravelMate every day.</p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-3.5 bg-white text-indigo-700 rounded-2xl font-black text-sm hover:bg-indigo-50 hover:shadow-xl transition-all active:scale-95"
                    >
                        Start Planning Now →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;