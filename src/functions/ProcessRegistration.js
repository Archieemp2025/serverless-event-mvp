const { app } = require('@azure/functions');

app.storageQueue('ProcessRegistration', {
    queueName: 'registrations-queue', // The name of the "mailbox" it watches
    connection: 'AzureWebJobsStorage', // The connection string in local.settings.json
    handler: async (queueItem, context) => {
        // queueItem is the JSON object sent by RegisterUser
        context.log(`--- Worker Bee Active ---`);
        context.log(`Processing registration for: ${queueItem.email}`);

        // Simulating work (e.g., sending an email)
        context.log(`Registration for event ${queueItem.eventId} is complete`);
    }
});
