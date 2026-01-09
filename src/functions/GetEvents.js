const { app, input } = require('@azure/functions');

// 1. Define the Cosmos DB Input Binding
// This tells Azure to go get all items from the 'Events' Container before the function even starts!
const cosmosInput = input.cosmosDB({
    databaseName: 'EventDB',
    containerName: 'Events',
    connection: 'CosmosDBConnection', //Uses the same key in local.settings.json
    sqlQuery: 'SELECT * FROM c' // Standard SQL to get everything
});

app.http('GetEvents', {
    methods: ['GET'],  // Only allows GET Requests
    authLevel: 'anonymous',
    extraInputs: [cosmosInput], // Register the input binding
    handler: async (request, context) => {
        context.log(`Processing GET request for all events.`);
        
        // 2. Retrieve the data from the input binding
        // All events are automatically gathered into this variable
        const events = context.extraInputs.get(cosmosInput);

        // 3. Return the data to the user
        return {
            status: 200,
            jsonBody: events
        };
    }
});
