// const { app } = require('@azure/functions');

// app.storageQueue('ProcessRegistration', {
//     queueName: 'registrations-queue', // The name of the "mailbox" it watches
//     connection: 'AzureWebJobsStorage', // The connection string in local.settings.json
//     handler: async (queueItem, context) => {
//         // queueItem is the JSON object sent by RegisterUser
//         context.log(`--- Worker Bee Active ---`);
//         context.log(`Processing registration for: ${queueItem.email}`);

//         // Simulating work (e.g., sending an email)
//         context.log(`Registration for event ${queueItem.eventId} is complete`);
//     }
// });


const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

// Initialize Cosmos Client (Ensure these are in your local.settings.json)
const client = new CosmosClient(process.env.CosmosDbConnectionString);
const container = client.database("EventlyDB").container("Events");

app.storageQueue('ProcessRegistration', {
    queueName: 'registrations-queue',
    connection: 'AzureWebJobsStorage',
    handler: async (queueItem, context) => {
        // --- Your Original Logs ---
        context.log(`--- Worker Bee Active ---`);
        context.log(`Processing registration for: ${queueItem.email}`);

        try {
            const eventId = queueItem.eventId;

            // 1. Fetch the current event from the database
            const { resource: event } = await container.item(eventId, eventId).read();

            if (event) {
                // 2. Increment the count (or set to 1 if it doesn't exist yet)
                event.registeredCount = (event.registeredCount || 0) + 1;

                // 3. Save it back to the database
                await container.items.upsert(event);
                
                context.log(` Success: Event ${eventId} count is now ${event.registeredCount}`);
            } else {
                context.log(` Error: Event ${eventId} not found in database.`);
            }

        } catch (error) {
            context.log(` Database Update Failed: ${error.message}`);
        }

        // --- Your Original Completion Log ---
        context.log(`Registration for event ${queueItem.eventId} is complete`);
    }
});
