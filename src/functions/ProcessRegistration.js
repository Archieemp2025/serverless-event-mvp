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
        
        sgMail.setApiKey(process.env.SendGridApiKey);
        
        // Use the connection string name exactly as it appears in your settings
        const connectionString = process.env.CosmosDBConnection;
        const client = new CosmosClient(connectionString);
        
        const database = client.database("EventDB"); 
        const eventsContainer = database.container("Events");
        const registrationsContainer = database.container("Registrations");

        try {
            // 1. Fetch Event Details
            const { resource: event } = await eventsContainer.item(queueItem.eventId, queueItem.eventId).read();

            if (!event) {
                context.log(` Event not found: ${queueItem.eventId}`);
                return;
            }

            // 2. Save Registration
            const newRegistration = {
                id: `${queueItem.eventId}-${queueItem.email}`, 
                eventId: queueItem.eventId,
                fullName: queueItem.fullName,
                mobile: queueItem.mobile,
                email: queueItem.email,
                registeredAt: new Date().toISOString()
            };
            await registrationsContainer.items.upsert(newRegistration);

            // 3. Update Event Count
            event.registeredCount = (event.registeredCount || 0) + 1;
            await eventsContainer.items.upsert(event);

            // // 4. DATE & TIME FIX: Trim the string to remove the hidden space
            // const rawDateString = event.date ? event.date.trim() : null;
            // const eventObj = new Date(rawDateString);

            // // Check if date is valid, otherwise use a fallback string
            // const isValidDate = !isNaN(eventObj.getTime());

            // const formattedDate = isValidDate 
            //     ? eventObj.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            //     : "Date to be announced";

            // const formattedTime = isValidDate 
            //     ? eventObj.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true })
            //     : "Time to be announced";
            // 4. Trim and create the date object
            const rawDateString = event.date ? event.date.trim() : null;
            const eventObj = new Date(rawDateString);

            const isValidDate = !isNaN(eventObj.getTime());

            //  Format Date in UTC (Prevents the day from shifting)
            const formattedDate = isValidDate 
                ? eventObj.toLocaleDateString('en-AU', { 
                     weekday: 'long', 
                     year: 'numeric', 
                     month: 'long', 
                     day: 'numeric',
                     timeZone: 'UTC' // <--- FORCES UTC DATA
                  })
                : "Date to be announced";

            //  Format Time in UTC (Will show exactly 9:00 am)
            const formattedTime = isValidDate 
                ? eventObj.toLocaleTimeString('en-AU', { 
                     hour: 'numeric', 
                     minute: '2-digit', 
                     hour12: true,
                     timeZone: 'UTC' // <--- FORCES UTC DATA
                  })
                : "Time to be announced"; 
            
            // This creates a safe URL for Google Maps by replacing spaces with '+'
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

            // 5. Send the Email
            const msg = {
                to: queueItem.email,
                from: {
                    email: 'anatempl2025@gmail.com',
                    name: 'Evently Ticket Confirmation'
                },
                subject: ` Ticket Confirmed: ${event.title}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <div style="background-color: #0078d4; padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px;">Event Ticket</h1>
                        </div>
                        <div style="padding: 30px; line-height: 1.6; color: #333;">
                            <p style="font-size: 18px;">Hi <strong>${queueItem.fullName}</strong>,</p>
                            <p>You're officially registered! Please keep this email as your ticket for entry.</p>
                            
                            <div style="background-color: #f3f2f1; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #0078d4;">
                                <h2 style="margin-top: 0; color: #0078d4; font-size: 22px;">${event.title}</h2>
                                <p style="margin: 10px 0;"> 
                                    <strong>Location:</strong> ${event.location} 
                                    <br />
                                    <a href="${mapsUrl}" style="color: #0078d4; text-decoration: none; font-size: 12px;"> Get Directions</a>
                                </p>
                                <p style="margin: 10px 0;"> <strong>Date:</strong> ${formattedDate}</p>
                                <p style="margin: 10px 0;"> <strong>Time:</strong> ${formattedTime}</p>
                            </div>

                            <p style="font-size: 13px; color: #666; word-break: break-all;"><strong>Ticket ID:</strong> ${newRegistration.id}</p>
                        </div>
                        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
                            © 2026 Microsoft Student Accelerator. All rights reserved.
                        </div>
                    </div>
                `,
            };

            await sgMail.send(msg);
            context.log(` Success: Ticket sent to ${queueItem.email}`);

        } catch (error) {
            context.log(` Error: ${error.message}`);
        }
    }
});