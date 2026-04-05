import API from './api';

export const getTripById = (id) => {
    return API.get(`trips/${id}`);
};

export const updateTrip = async (id, data) => {
    return await API.put(`/trips/${id}`, data);
};

export const uploadTripPhoto = async (id, formData) => {
    return await API.post(`/trips/${id}/photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
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

export const generateShareToken = async (id) => {
    return await API.post(`/trips/${id}/share`);
};

export const getSharedTrip = async (token) => {
    return await API.get(`/trips/shared/${token}`);
};