import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default marker icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom vibrant red marker icon
const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function TripMap({ destination }) {
    const [coords, setCoords] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!destination) return;

        const geocode = async () => {
            setLoading(true);
            setError(false);
            try {
                // Use free Nominatim (OpenStreetMap) geocoding API
                const encoded = encodeURIComponent(destination);
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
                    {
                        headers: {
                            // Required by Nominatim usage policy
                            'Accept-Language': 'en',
                        }
                    }
                );
                const data = await res.json();

                if (data && data.length > 0) {
                    setCoords({
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon),
                        displayName: data[0].display_name,
                    });
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Geocoding failed:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        geocode();
    }, [destination]);

    if (loading) {
        return (
            <div className="w-full h-96 rounded-[2rem] overflow-hidden glass flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 dark:text-slate-500 font-semibold text-sm">Locating {destination} on the map…</p>
                </div>
            </div>
        );
    }

    if (error || !coords) {
        return (
            <div className="w-full h-48 rounded-[2rem] glass flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-slate-400 dark:text-slate-500 font-semibold text-sm">
                        Could not locate "{destination}" on the map.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-96 rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/50 dark:shadow-slate-900/50 border border-white/30 dark:border-slate-700/50 relative z-0">
            <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
                <Marker position={[coords.lat, coords.lng]} icon={customIcon}>
                    <Popup className="font-bold">
                        <div className="text-center p-1">
                            <div className="text-lg mb-1">📍</div>
                            <h3 className="font-black text-slate-800 dark:text-white text-sm">{destination}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-[160px]">{coords.displayName?.split(',').slice(0, 3).join(',')}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default TripMap;
