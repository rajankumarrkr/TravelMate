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
        <div className="flex justify-center mt-20">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-6 shadow-lg rounded-lg"
            >
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange}
                />

                <button className="w-full bg-green-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;