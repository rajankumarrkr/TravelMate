const generateItinerary = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end - start;
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const itinerary = [];

    for (let i = 1; i <= totalDays; i++) {
        let plan = '';

        if (i === 1) {
            plan = 'Arrival + Local exploration';
        } else if (i === totalDays) {
            plan = 'Checkout + Relax';
        } else {
            plan = 'Visit top attractions & activities';
        }

        itinerary.push({
            day: i,
            plan,
        });
    }

    return itinerary;
};

module.exports = { generateItinerary };