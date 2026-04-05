import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/trips', icon: '🗺️', label: 'Trips' },
    { path: '/ai-planner', icon: '✨', label: 'AI Plan' },
];

function BottomNav() {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) return null;

    // Don't show on auth pages
    const hideOn = ['/', '/login', '/register'];
    if (hideOn.includes(location.pathname) || location.pathname.startsWith('/shared')) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Blur backdrop */}
            <div className="glass border-t border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/10">
                <div className="flex items-center justify-around px-2 py-2 pb-safe">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-indigo-600 text-white scale-105 shadow-lg shadow-indigo-200'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600'
                                }`}
                            >
                                <span className="text-xl leading-none">{item.icon}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

export default BottomNav;
