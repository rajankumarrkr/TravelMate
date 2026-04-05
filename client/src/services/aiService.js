import API from './api';

export const generateMagicPlan = (prompt) => {
    return API.post('ai/plan-magic', { prompt });
};
