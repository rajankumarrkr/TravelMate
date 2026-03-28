import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
            <div className="glass shadow-xl rounded-2xl px-6 py-4 flex justify-between items-center transition-all duration-300">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
                    TravelMate ✈️
                </Link>

                <div className="flex items-center gap-6">
                    {token ? (
                        <>
                            <Link to="/dashboard" className="text-sm font-medium hover:text-indigo-600">Dashboard</Link>
                            <Link to="/trips" className="text-sm font-medium hover:text-indigo-600">My Trips</Link>
                            <button 
                                onClick={logout} 
                                className="px-4 py-2 bg-rose-500/10 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-sm font-medium hover:text-indigo-600 self-center">Login</Link>
                            <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all shadow-indigo-200">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;