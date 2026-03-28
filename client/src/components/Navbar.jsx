import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                TravelMate ✈️
            </Link>

            {token && (
                <div className="flex gap-4">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/trips">Trips</Link>
                    <button onClick={logout} className="text-red-500">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Navbar;