const { app, output } = require('@azure/functions');

// Define the Queue Output
const queueOutput = output.storageQueue({
    queueName: 'registrations-queue',
    connection: 'AzureWebJobsStorage', // Matches the local.settings.json
});

// app.http('RegisterUser', {
//     methods: ['POST'],
//     authLevel: 'anonymous',
//     extraOutputs: [queueOutput], // This tells Azure to send data to the queue
//     handler: async (request, context) => {
//         const data = await request.json();

//         // 1. Basic Validation (Trimming included!)
//         if (!data.email || !data.email.trim() || !data.eventId) {
//             return { status: 400, jsonBody: {error: "Email and EventID are required."} };
//         }

//         // 2. Prepare the message for the queue
//         const registrationMessage = {
//             email: data.email.trim(),
//             eventId: data.eventId,
//             registeredAt: new Date().toISOString()
//         };

//         // 3. Push to Queue
//         context.extraOutputs.set(queueOutput, registrationMessage);

//         // 4. Return 202 Accepted
//         return{
//             status: 202,
//             jsonBody: { message: "Registration received! We are processing your confirmation." }
//         };       
//     }
// });

app.http('RegisterUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [queueOutput],
    handler: async (request, context) => {
        const data = await request.json();

        // 1. Enhanced Validation for New Fields
        if (!data.email || !data.fullName || !data.mobile || !data.eventId) {
            return { 
                status: 400, 
                jsonBody: { error: "Name, Mobile, Email, and EventID are all required." } 
            };
        }

        // 2. Prepare message with all details
        const registrationMessage = {
            fullName: data.fullName.trim(),
            mobile: data.mobile.trim(),
            email: data.email.trim(),
            eventId: data.eventId,
            registeredAt: new Date().toISOString()
        };

        context.extraOutputs.set(queueOutput, registrationMessage);

        return {
            status: 202,
            jsonBody: { message: "Registration processing!" }
        };       
    }
});
