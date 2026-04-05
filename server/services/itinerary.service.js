const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `
You are an expert travel planner who creates smart, realistic, and budget-friendly travel itineraries.

Your task is to generate a complete trip plan in STRICT JSON format.

IMPORTANT RULES:
- Output ONLY valid JSON (no extra text, no explanation, no markdown)
- Response must be directly parsable using JSON.parse()
- Keep plans realistic and practical
- Optimize for budget and time
- Include travel, food, sightseeing, and rest

JSON FORMAT:
{
  "destination": "string",
  "totalDays": number,
  "estimatedTotalCost": number,
  "itinerary": [
    {
      "day": number,
      "title": "short title",
      "activities": [
        "activity 1",
        "activity 2",
        "activity 3"
      ],
      "foodSuggestion": "string",
      "staySuggestion": "string",
      "estimatedCost": number
    }
  ]
}

GUIDELINES:
- Day 1 should include arrival + light activities
- Last day should include checkout + wrap-up
- Middle days should include main attractions
- Suggest popular places based on destination
- Keep activities logical (location-wise)
- Keep cost realistic (INR)

Make the plan clean, practical, and useful for real travelers.
`;

const generateAIItinerary = async (destination, totalDays, budget = 10000) => {
    try {
        const userPrompt = `Create a ${totalDays}-day travel plan for ${destination} with a budget of ${budget} INR.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' },
        });

        const responseContent = JSON.parse(chatCompletion.choices[0].message.content);
        return responseContent;
    } catch (error) {
        console.error('Error generating itinerary:', error);
        // Fallback structure if AI fails
        const fallback = [];
        for (let i = 1; i <= totalDays; i++) {
            fallback.push({
                day: i,
                title: 'Plan your day',
                activities: ['Explore local area'],
                foodSuggestion: 'Local cuisine',
                staySuggestion: 'Nearby hotel',
                estimatedCost: Math.round(budget / totalDays),
            });
        }
        return {
            destination,
            totalDays,
            estimatedTotalCost: budget,
            itinerary: fallback,
        };
    }
};

const extractTripDetails = async (prompt) => {
    try {
        const extractionPrompt = `
        You are a travel data extractor. Extract the following information from the user's trip request:
        1. Destination (city or country)
        2. Duration (number of days, default to 3 if not mentioned)
        3. Budget (INR, default to 15000 if not mentioned)

        Input: "${prompt}"

        Output JSON:
        {
          "destination": "string",
          "totalDays": number,
          "budget": number
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You output ONLY valid JSON.',
                },
                {
                    role: 'user',
                    content: extractionPrompt,
                },
            ],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error('Extraction error:', error);
        return {
            destination: 'Unknown',
            totalDays: 3,
            budget: 15000,
        };
    }
};

module.exports = { generateAIItinerary, extractTripDetails };