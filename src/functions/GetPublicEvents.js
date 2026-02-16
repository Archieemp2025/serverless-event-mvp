// const { app } = require('@azure/functions');

// app.http('GetPublicEvents', {
//     methods: ['GET'], // We only need GET to fetch events
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
//         context.log(`Fetching public events from PredictHQ...`);

//         const token = process.env.PREDICTHQ_TOKEN;

//         // 1. Safety Check: Ensure the token exists in Azure Environment Variables
//         if (!token) {
//             return { 
//                 status: 500, 
//                 body: JSON.stringify({ error: 'PREDICTHQ_TOKEN is not configured.' }) 
//             };
//         }

//         try {
//             // 2. Call PredictHQ API
//             const response = await fetch('https://api.predicthq.com/v1/events/?limit=10&category=concerts,festivals,sports', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Accept': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`PredictHQ responded with status: ${response.status}`);
//             }

//             const data = await response.json();

//             // 3. Return the results to your Vite frontend
//             return {
//                 status: 200,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data.results)
//             };

//         } catch (error) {
//             context.log(`Error: ${error.message}`);
//             return { 
//                 status: 500, 
//                 body: JSON.stringify({ error: 'Failed to fetch events' }) 
//             };
//         }
//     }
// });


const { app } = require('@azure/functions');

app.http('GetPublicEvents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Fetching Melbourne events from PredictHQ...`);

        const token = process.env.PREDICTHQ_TOKEN;

        if (!token) {
            return { 
                status: 500, 
                body: JSON.stringify({ error: 'PREDICTHQ_TOKEN is not configured.' }) 
            };
        }

        try {
            // 1. Melbourne, Australia Place ID
            const melbournePlaceId = '2158177';
            
            // 2. Build the URL with filters:
            // - place.exact: Just Melbourne
            // - category: Variety of event types
            // - limit: Top 10 results
            // - active.gte: Events happening from today onwards
            const today = new Date().toISOString().split('T')[0];
            const apiUrl = `https://api.predicthq.com/v1/events/?place.exact=${melbournePlaceId}&category=concerts,festivals,sports,performing-arts&limit=10&active.gte=${today}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`PredictHQ error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // 3. Return only the 'results' array to the frontend
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                jsonBody: data.results 
            };

        } catch (error) {
            context.log(`Error: ${error.message}`);
            return { 
                status: 500, 
                body: JSON.stringify({ error: 'Failed to fetch Melbourne events' }) 
            };
        }
    }
});