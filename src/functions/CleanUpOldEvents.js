const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");

// Initialize Cosmos Client using your existing connection string
const client = new CosmosClient(process.env.CosmosDBConnection);
const database = client.database("EventDB"); 
const container = database.container("Events"); 

app.timer('CleanUpOldEvents', {
    // Run every 5 minutes for testing: '0 */5 * * * *'
    // Run at 2 AM daily for production: '0 0 2 * * *'
    schedule: '0 */5 * * * *',
    handler: async (myTimer, context) => {
        context.log('--- Starting Database CleanUp ---');

        const now = new Date();
        const isoNow = now.toISOString();

        // 1. Query for events where the date is in the past
       // Note: Ensure your event objects have an 'eventDate' field in ISO format
       const querySpec = {
           query: "SELECT * FROM c WHERE c.date < @now",
           parameters: [{name: "@now", value: isoNow}]
       };

       try {
         const { resources: oldEvents } = await container.items.query(querySpec).fetchAll();
         context.log(`Found ${oldEvents.length} expired events to delete.`);

         // 2. Loop through and delete them
         for (const event of oldEvents) {
             await container.item(event.id, event.id).delete();
             context.log(`Deleted Event ID: ${event.id}`);
         }

         context.log('CleanUp task completed successfully.')
       } catch (error) {
           context.error('Error during cleanup:', error.message);
       }
    }
});
