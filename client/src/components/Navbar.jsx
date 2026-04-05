import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
            <div className="glass shadow-xl rounded-2xl px-6 py-4 flex justify-between items-center transition-all duration-300 dark:shadow-slate-900/50">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
                    TravelMate ✈️
                </Link>

                <div className="flex items-center gap-3">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="text-lg w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="text-sm font-bold bg-slate-100 dark:bg-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors hidden sm:block"
                    >
                        🌐 {i18n.language === 'en' ? 'HI' : 'EN'}
                    </button>
                    {token ? (
                        <>
                            <Link to="/ai-planner" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100/50 hover:bg-indigo-600 hover:text-white transition-all group">
                                <span className="mr-1 group-hover:animate-bounce inline-block">✨</span> {t('navbar.magic_ai')}
                            </Link>
                            <Link to="/dashboard" className="text-sm font-medium hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400">{t('navbar.dashboard')}</Link>
                            <Link to="/trips" className="text-sm font-medium hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400">{t('navbar.trips')}</Link>
                            <button 
                                onClick={logout} 
                                className="px-4 py-2 bg-rose-500/10 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            >
                                {t('navbar.logout')}
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-sm font-medium hover:text-indigo-600 dark:text-slate-200 self-center">{t('navbar.login')}</Link>
                            <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all shadow-indigo-200">
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