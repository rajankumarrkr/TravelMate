import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { addExpense, getExpenses } from '../services/expenseService';

function TripDetails() {
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);

    const [form, setForm] = useState({
        category: 'food',
        amount: '',
        note: '',
    });

    // Fetch trip
    const fetchTrip = async () => {
        const res = await getTripById(id);
        setTrip(res.data.data);
    };

    // Fetch expenses
    const fetchExpenses = async () => {
        const res = await getExpenses(id);
        setExpenses(res.data.data.expenses);
        setTotal(res.data.data.total);
    };

    useEffect(() => {
        fetchTrip();
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        await addExpense({
            ...form,
            tripId: id,
            amount: Number(form.amount),
        });

        setForm({ category: 'food', amount: '', note: '' });
        fetchExpenses();
    };

    if (!trip) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 space-y-10">

            {/* Trip Info */}
            <div>
                <h1 className="text-3xl font-bold">{trip.destination}</h1>
                <p>
                    {new Date(trip.startDate).toDateString()} -{' '}
                    {new Date(trip.endDate).toDateString()}
                </p>
            </div>

            {/* Itinerary */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
                <div className="space-y-3">
                    {trip.itinerary.map((item) => (
                        <div key={item.day} className="p-3 bg-white shadow rounded">
                            <strong>Day {item.day}:</strong> {item.plan}
                        </div>
                    ))}
                </div>
            </div>

            {/* Expenses */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">
                    Expenses (₹{total})
                </h2>

                {/* Add Expense */}
                <form onSubmit={handleAddExpense} className="space-y-2 mb-4">
                    <select
                        name="category"
                        onChange={handleChange}
                        className="border p-2 w-full"
                    >
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="hotel">Hotel</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        className="border p-2 w-full"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="note"
                        placeholder="Note"
                        className="border p-2 w-full"
                        onChange={handleChange}
                    />

                    <button className="bg-green-500 text-white p-2 rounded">
                        Add Expense
                    </button>
                </form>

                {/* Expense List */}
                <div className="space-y-2">
                    {expenses.map((exp) => (
                        <div key={exp._id} className="p-2 bg-white shadow rounded">
                            ₹{exp.amount} - {exp.category} ({exp.note})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TripDetails;