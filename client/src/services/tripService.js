import API from './api';

export const getTripById = (id) => {
    return API.get(`trips/${id}`);
};

export const createTrip = (data) => {
    return API.post('trips', data);
};

export const getTrips = () => {
    return API.get('trips');
};

export const deleteTrip = (id) => {
    return API.delete(`trips/${id}`);
};