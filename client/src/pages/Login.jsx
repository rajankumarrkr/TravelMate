import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(form);
            localStorage.setItem('token', res.data.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">TravelMate ✈️</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium">Sign in to continue your journey</p>
                </div>

                <div className="glass rounded-3xl p-7 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/40 dark:border-slate-700/50">
                    <h2 className="text-2xl font-black dark:text-white mb-1">Welcome back 👋</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mb-7">Ready for your next adventure?</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Email</label>
                            <input
                                type="email" name="email" placeholder="you@example.com"
                                onChange={handleChange} required
                                className="w-full p-4 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
                            <input
                                type="password" name="password" placeholder="••••••••"
                                onChange={handleChange} required
                                className="w-full p-4 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In →'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-slate-400 dark:text-slate-500">
                        New to TravelMate?{' '}
                        <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;