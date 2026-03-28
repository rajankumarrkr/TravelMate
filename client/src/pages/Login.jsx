import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser(form);

            // Save token
            localStorage.setItem('token', res.data.data.token);

            alert('Login successful');
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Error');
        }
    };

    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
            <div className="glass w-full max-w-md p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 text-sm mb-8">Ready for your next adventure?</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="traveler@example.com"
                            className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 mt-4">
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-500">
                    New to TravelMate? <a href="/register" className="text-indigo-600 font-bold hover:underline">Create an account</a>
                </p>
            </div>
        </div>
    );
}

export default Login;