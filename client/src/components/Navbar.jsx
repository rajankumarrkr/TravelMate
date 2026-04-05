import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
            <div className="glass shadow-xl shadow-black/5 dark:shadow-slate-900/50 rounded-2xl px-4 md:px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform shrink-0">
                    TravelMate ✈️
                </Link>

                {/* Center nav links — desktop only */}
                {token && (
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            to="/dashboard"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/dashboard') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >{t('navbar.dashboard')}</Link>
                        <Link
                            to="/trips"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/trips') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >{t('navbar.trips')}</Link>
                        <Link
                            to="/ai-planner"
                            className="px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white transition-all"
                        >✨ {t('navbar.magic_ai')}</Link>
                    </div>
                )}

                {/* Right controls */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-base"
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {/* Language toggle — hidden on smallest screens */}
                    <button
                        onClick={toggleLanguage}
                        className="hidden sm:flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        🌐 {i18n.language === 'en' ? 'HI' : 'EN'}
                    </button>

                    {token ? (
                        <button
                            onClick={logout}
                            className="hidden md:flex px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all border border-rose-100 dark:border-rose-900"
                        >
                            {t('navbar.logout')}
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                                {t('navbar.login')}
                            </Link>
                            <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                                {t('navbar.signup')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;