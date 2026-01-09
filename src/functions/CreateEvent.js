const { app, output } = require('@azure/functions');

// 1. Define the Cosmos DB Output Binding
const cosmosOutput = output.cosmosDB({
    // IMPORTANT: These Names must exactly match your resources
    databaseName: 'EventDB',
    containerName: 'Events',
    // This references the connection string setting in local.settings.json
    connection: 'CosmosDBConnection'
});

app.http('CreateEvent', {
    methods: ['POST'], // This function only accepts POST requests
    authLevel: 'anonymous',
    extraOutputs: [cosmosOutput], //Register the Cosmos DB Binding

    // 2. Define the main function handler
    handler: async (request, context) => {
        try {
            // Read the JSON body from the incoming HTTP Request
            const eventData = await request.json();

            // 1. Check if title exists AND if it's not just empty spaces after trimming
            if (!eventData.title || eventData.title.trim().length === 0) {
                return {
                    status: 400,
                    jsonBody: { error: "Title is required and cannot be empty or just spaces." }
                };
            }

            // 2. Do the same for date (optional but recommended)
            if (!eventData.date || eventData.date.trim().length === 0) {
                return {
                    status: 400,
                    jsonBody: { error: "Date is required." }
                };
            }

            // 3. Update the data to use the trimmed version so you don't save accidental spaces to the database
            //const finalTitle = eventData.title.trim();

            // ---Validation Logic ---
            if (!eventData || !eventData.title || !eventData.date) {
                return {
                    status: 400,
                    jsonBody: { error: "Please provide 'title' and 'date' in the request body." }
                };
            }

            // --- Document Transformation ---
            const finalDocument = {
                // Generate a unique ID (required by Cosmos DB)
                id: context.invocationId,
                ...eventData,
                // Add server-side timestamp
                created: new Date().toISOString()
            };

            // 3. Send the document to the Output Binding
            // The Azure Functions runtime takes this object and writes it to Cosmos DB
            context.extraOutputs.set(cosmosOutput, finalDocument);

            // 4. Return the HTTP success response
            return {
                status: 201, // 201 Created
                jsonBody: { message: "Event created successfully!", event: finalDocument }
            }; 
        } catch (error) {
            context.log.error(`Error processing CreateEvent: ${error.message}`);
            return {
                status: 500,
                jsonBody: { error: "Internal Server Error during processing." }
            };
        }
    }
});
