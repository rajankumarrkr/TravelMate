import { useEffect, useState } from 'react';
import { createTrip, getTrips, deleteTrip } from '../services/tripService';
import { useNavigate } from 'react-router-dom';

function Trips() {
    const [form, setForm] = useState({
        destination: '',
        startDate: '',
        endDate: '',
    });

    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();

    // Fetch trips
    const fetchTrips = async () => {
        try {
            const res = await getTrips();
            setTrips(res.data.data);
        } catch (error) {
            console.error(error);
            alert('Failed to load trips');
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Create trip
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createTrip(form);
            alert('Trip created successfully');

            // Reset form
            setForm({
                destination: '',
                startDate: '',
                endDate: '',
            });

            fetchTrips();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating trip');
        }
    };

    // Delete trip
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // prevent click navigation

        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await deleteTrip(id);
            fetchTrips();
        } catch (error) {
            console.error(error);
            alert('Failed to delete trip');
        }
    };

    return (
        <div className="p-10 min-h-screen bg-gray-100">

            {/* Header */}
            <h1 className="text-3xl font-bold mb-6">Your Trips ✈️</h1>

            {/* Create Trip Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow mb-10 space-y-4"
            >
                <h2 className="text-xl font-semibold">Create New Trip</h2>

                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                />

                <div className="flex gap-4">
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />

                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>

                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Create Trip
                </button>
            </form>

            {/* Trip List */}
            <div className="space-y-4">
                {trips.length === 0 ? (
                    <p className="text-gray-500">No trips found. Create one!</p>
                ) : (
                    trips.map((trip) => (
                        <div
                            key={trip._id}
                            onClick={() => navigate(`/trips/${trip._id}`)}
                            className="p-4 shadow rounded bg-white cursor-pointer hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {trip.destination}
                                    </h2>

                                    <p className="text-gray-600">
                                        {new Date(trip.startDate).toDateString()} —{' '}
                                        {new Date(trip.endDate).toDateString()}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => handleDelete(trip._id, e)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Trips;