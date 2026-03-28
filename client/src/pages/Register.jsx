import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [form, setForm] = useState({
        name: '',
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
            await registerUser(form);
            alert('Registration successful');
            navigate('/login');
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
                <h2 className="text-2xl font-bold mb-4">Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange}
                />

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

                <button className="w-full bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;