import { Redis } from "ioredis";

/*
Redis Pub/Sub (Publisher/Subscriber) allows for real-time messaging between different parts of an application.
- A Subscriber "listens" to a specific channel.
- A Publisher "sends" a message to that channel.
- All subscribers currently listening to that channel receive the message.
Note: Pub/Sub is "fire and forget"—if a subscriber isn't online when a message is sent, they will NOT receive it later (unlike Streams).
*/

async function init() {
    // We need two separate clients because once a client is in 'subscriber' mode, 
    // it cannot perform other commands like SET or PUBLISH.
    const subClient = new Redis();
    const pubClient = new Redis();

    console.log("--- Pub/Sub Operations ---");

    // 1. SUBSCRIBE to a channel
    subClient.subscribe("news-channel", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(`Subscribed successfully! This client is now listening to ${count} channel(s).`);
        }
    });

    // 2. LISTEN for messages
    // The 'message' event is triggered whenever a message arrives on a subscribed channel.
    subClient.on("message", (channel, message) => {
        console.log(`[RECEIVED] Message from ${channel}: ${message}`);
        
        // Demonstration complete, cleaning up after receiving one message
        if (message === "exit") {
            console.log("Exiting Pub/Sub demo...");
            subClient.quit();
            pubClient.quit();
            process.exit(0);
        }
    });

    // 3. PUBLISH messages using the publisher client
    // We wait a second to ensure the subscriber is ready
    setTimeout(async () => {
        console.log("[SENDING] Publishing message to 'news-channel'...");
        await pubClient.publish("news-channel", "Hello, Redis Pub/Sub!");
        
        await pubClient.publish("news-channel", "This is a real-time message.");
        
        // Sending a termination message for our demo script
        await pubClient.publish("news-channel", "exit");
    }, 1000);
}

init();
