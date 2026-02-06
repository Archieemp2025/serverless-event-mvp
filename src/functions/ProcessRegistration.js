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

/* ---------------- */
// Update 02 //

// const { app } = require('@azure/functions');
// const { CosmosClient } = require('@azure/cosmos');

// // Initialize Cosmos Client (Ensure these are in your local.settings.json)
// const client = new CosmosClient(process.env.CosmosDBConnection);
// const container = client.database("EventDB").container("Events");

// app.storageQueue('ProcessRegistration', {
//     queueName: 'registrations-queue',
//     connection: 'AzureWebJobsStorage',
//     handler: async (queueItem, context) => {
//         // --- Your Original Logs ---
//         context.log(`--- Worker Bee Active ---`);
//         context.log(`Processing registration for: ${queueItem.email}`);

//         try {
//             const eventId = queueItem.eventId;

//             // 1. Fetch the current event from the database
//             const { resource: event } = await container.item(eventId, eventId).read();

//             if (event) {
//                 // 2. Increment the count (or set to 1 if it doesn't exist yet)
//                 event.registeredCount = (event.registeredCount || 0) + 1;

//                 // 3. Save it back to the database
//                 await container.items.upsert(event);
                
//                 context.log(` Success: Event ${eventId} count is now ${event.registeredCount}`);
//             } else {
//                 context.log(` Error: Event ${eventId} not found in database.`);
//             }

//         } catch (error) {
//             context.log(` Database Update Failed: ${error.message}`);
//         }

//         // --- Your Original Completion Log ---
//         context.log(`Registration for event ${queueItem.eventId} is complete`);
//     }
// });

/* --------------- */


// Update 03 // 
// const { app } = require('@azure/functions');
// const { CosmosClient } = require('@azure/cosmos');

// app.storageQueue('ProcessRegistration', {
//     queueName: 'registrations-queue',
//     connection: 'AzureWebJobsStorage',
//     handler: async (queueItem, context) => {
//         // 1. Get connection string - MATCH THIS TO YOUR SETTINGS
//         const connectionString = process.env.CosmosDBConnection;
        
//         if (!connectionString) {
//             context.log(" Error: CosmosDbConnectionString is not defined in environment variables.");
//             return;
//         }

//         const client = new CosmosClient(connectionString);
//         const database = client.database("EventDB"); // Must match your Portal
//         const eventsContainer = database.container("Events");
//         const registrationsContainer = database.container("Registrations");

//         try {
//             // 2. Save User Details
//             const newRegistration = {
//                 id: `${queueItem.eventId}-${queueItem.email}`, 
//                 eventId: queueItem.eventId,
//                 fullName: queueItem.fullName,
//                 mobile: queueItem.mobile,
//                 email: queueItem.email,
//                 registeredAt: new Date().toISOString()
//             };
            
//             await registrationsContainer.items.upsert(newRegistration);
//             context.log(` Saved user ${queueItem.email} to Registrations.`);

//             // 3. Update Event Counter
//             const { resource: event } = await eventsContainer.item(queueItem.eventId, queueItem.eventId).read();
//             if (event) {
//                 event.registeredCount = (event.registeredCount || 0) + 1;
//                 await eventsContainer.items.upsert(event);
//                 context.log(` Event count updated to ${event.registeredCount}`);
//             }

//         } catch (error) {
//             context.log(` Processing Error: ${error.message}`);
//         }
//     }
// });


/* ----- Update 04 - with send back the tickets email to the registered person ----- */

// const { app } = require('@azure/functions');
// const { CosmosClient } = require('@azure/cosmos');
// const sgMail = require('@sendgrid/mail'); // npm install @sendgrid/mail

// app.storageQueue('ProcessRegistration', {
//     queueName: 'registrations-queue',
//     connection: 'AzureWebJobsStorage',
//     handler: async (queueItem, context) => {
//         sgMail.setApiKey(process.env.SendGridApiKey);
        
//         const connectionString = process.env.CosmosDBConnection;
//         const client = new CosmosClient(connectionString);
//         const database = client.database("EventDB");
//         const eventsContainer = database.container("Events");
//         const registrationsContainer = database.container("Registrations");

//         try {
//             // 1. Save User to "Registrations" (Same as before)
//             const newRegistration = {
//                 id: `${queueItem.eventId}-${queueItem.email}`, 
//                 eventId: queueItem.eventId,
//                 fullName: queueItem.fullName,
//                 mobile: queueItem.mobile,
//                 email: queueItem.email,
//                 registeredAt: new Date().toISOString()
//             };
//             await registrationsContainer.items.upsert(newRegistration);

//             // 2. Fetch Event Details for the Email
//             const { resource: event } = await eventsContainer.item(queueItem.eventId, queueItem.eventId).read();

//             const eventDate = new Date(event.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
            
//             if (event) {
//                 // 3. Update Count
//                 event.registeredCount = (event.registeredCount || 0) + 1;
//                 await eventsContainer.items.upsert(event);

//                 // 4. SEND THE EMAIL TICKET 
//                 const msg = {
//                     to: queueItem.email,
//                     from: 'anatempl2025@gmail.com', // Your verified SendGrid sender
//                     subject: ` Your Ticket for ${event.title}`,
//                     html: `
//                         <div style="font-family: sans-serif; border: 2px solid #4f46e5; padding: 20px; border-radius: 15px;">
//                             <h2 style="color: #4f46e5;">Your Event Ticket</h2>
//                             <p>Hi <strong>${queueItem.fullName}</strong>,</p>
//                             <p>You're all set! Here are your event details:</p>
//                             <hr />
//                             <h3>${event.title}</h3>
//                             <p> <strong>Location:</strong> ${event.location}</p>
//                             <p> <strong>Date:</strong> ${eventDate}</p>
//                             <p> <strong>Time:</strong> ${event.time || "09:00 AM"}</p>
//                             <hr />
//                             <p style="font-size: 12px; color: gray;">Ticket ID: ${newRegistration.id}</p>
//                         </div>
//                     `,
//                 };

//                 await sgMail.send(msg);
//                 context.log(` Ticket sent to ${queueItem.email}`);
//             }
//         } catch (error) {
//             context.log(` Error: ${error.message}`);
//         }
//     }
// });


/* ----- Update 05 - email with polished and neat exact information ----- */
const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
const sgMail = require('@sendgrid/mail');

app.storageQueue('ProcessRegistration', {
    queueName: 'registrations-queue',
    connection: 'AzureWebJobsStorage',
    handler: async (queueItem, context) => {
        context.log('Processing registration for:', queueItem.email);
        
        // 1. Setup SendGrid & Cosmos
        sgMail.setApiKey(process.env.SendGridApiKey);
        
        // Match the connection string name in your local.settings.json / Azure Portal
        const connectionString = process.env.CosmosDBConnection;
        const client = new CosmosClient(connectionString);
        
        const database = client.database("EventDB"); // Ensure this matches your DB name
        const eventsContainer = database.container("Events");
        const registrationsContainer = database.container("Registrations");

        try {
            // 2. Fetch Event Details first to ensure the event exists
            const { resource: event } = await eventsContainer.item(queueItem.eventId, queueItem.eventId).read();

            if (!event) {
                context.log(` Event not found for ID: ${queueItem.eventId}`);
                return;
            }

            // 3. Save User to "Registrations" Container
            const newRegistration = {
                id: `${queueItem.eventId}-${queueItem.email}`, 
                eventId: queueItem.eventId,
                fullName: queueItem.fullName,
                mobile: queueItem.mobile,
                email: queueItem.email,
                registeredAt: new Date().toISOString()
            };
            await registrationsContainer.items.upsert(newRegistration);
            context.log(` Registration record created for ${queueItem.fullName}`);

            // 4. Update the Event's Registered Count
            event.registeredCount = (event.registeredCount || 0) + 1;
            await eventsContainer.items.upsert(event);
            context.log(` Incrementing count for event: ${event.title}`);

            // 5. Format Date and Time from the single "date" field in Cosmos
            const eventObj = new Date(event.date);
            
            const formattedDate = eventObj.toLocaleDateString('en-AU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const formattedTime = eventObj.toLocaleTimeString('en-AU', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            // 6. Send the Email Ticket
            const msg = {
                to: queueItem.email,
                from: {
                    email: 'anatempl2025@gmail.com',
                    name: 'Evently Confirmation' // Professional sender name
                },
                subject: ` Ticket Confirmed: ${event.title}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
                        <div style="background-color: #0078d4; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Event Ticket</h1>
                        </div>
                        <div style="padding: 30px; line-height: 1.6; color: #333;">
                            <p>Hi <strong>${queueItem.fullName}</strong>,</p>
                            <p>You're officially registered! Please keep this email as your ticket for entry.</p>
                            
                            <div style="background-color: #f3f2f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h2 style="margin-top: 0; color: #0078d4;">${event.title}</h2>
                                <p style="margin: 5px 0;"> <strong>Location:</strong> ${event.location}</p>
                                <p style="margin: 5px 0;"> <strong>Date:</strong> ${formattedDate}</p>
                                <p style="margin: 5px 0;"> <strong>Time:</strong> ${formattedTime}</p>
                            </div>

                            <p style="font-size: 14px; color: #666;"><strong>Ticket ID:</strong> ${newRegistration.id}</p>
                        </div>
                        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                            © 2026 Microsoft Student Accelerator. All rights reserved.
                        </div>
                    </div>
                `,
            };

            await sgMail.send(msg);
            context.log(` Success: Ticket sent to ${queueItem.email}`);

        } catch (error) {
            context.log(` Processing Error: ${error.message}`);
            // Note: In a production app, you might want to re-throw the error
            // to keep the message in the queue for a retry.
        }
    }
});