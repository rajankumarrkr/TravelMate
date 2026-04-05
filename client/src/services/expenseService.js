import API from './api';

export const addExpense = (data) => {
    return API.post('expenses', data);
};

export const getExpenses = (tripId) => {
    return API.get(`expenses/${tripId}`);
};