const { app } = require('@azure/functions');

app.http('GetPublicEvents', {
    methods: ['GET'], // We only need GET to fetch events
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Fetching public events from PredictHQ...`);

        const token = process.env.PREDICTHQ_TOKEN;

        // 1. Safety Check: Ensure the token exists in Azure Environment Variables
        if (!token) {
            return { 
                status: 500, 
                body: JSON.stringify({ error: 'PREDICTHQ_TOKEN is not configured.' }) 
            };
        }

        try {
            // 2. Call PredictHQ API
            const response = await fetch('https://api.predicthq.com/v1/events/?limit=10&category=concerts,festivals,sports', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`PredictHQ responded with status: ${response.status}`);
            }

            const data = await response.json();

            // 3. Return the results to your Vite frontend
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.results)
            };

        } catch (error) {
            context.log(`Error: ${error.message}`);
            return { 
                status: 500, 
                body: JSON.stringify({ error: 'Failed to fetch events' }) 
            };
        }
    }
});