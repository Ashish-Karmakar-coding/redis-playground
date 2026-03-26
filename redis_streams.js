import client from "./client.js";

/*
A Redis stream is a data structure that acts like an append-only log but also implements several operations  
to overcome some of the limits of a typical append-only log. These include random access in O(1) time and complex consumption 
strategies, such as consumer groups. You can use streams to record and simultaneously syndicate events in real time.

it is basically store very fast data like the kafka and later save the compute data to the main database
*/

async function init() {
    console.log("--- Streams Operations ---");
    // Clear stream first if it exists
    await client.del("mystream");

    // 1. XADD (Append/Add an entry to the stream)
    // The '*' means Redis will auto-generate the unique ID (timestamp-based)
    const id1 = await client.xadd("mystream", "*", "sensor", "temp", "value", "18.5");
    const id2 = await client.xadd("mystream", "*", "sensor", "humid", "value", "60");
    console.log("XADD -> Inserted entries with IDs:", id1, id2);

    // 2. XLEN (Get the length of the stream)
    const len = await client.xlen("mystream");
    console.log("XLEN mystream ->", len);

    // 3. XRANGE (Get an inclusive range of entries)
    // '-' means the minimum ID, '+' means the maximum ID (basically get all)
    const range = await client.xrange("mystream", "-", "+");
    console.log("XRANGE all entries ->", JSON.stringify(range, null, 2));

    // 4. XREVRANGE (Get a range of entries in reverse order)
    // 'COUNT 1' gets just the most recent entry
    const revRange = await client.xrevrange("mystream", "+", "-", "COUNT", 1);
    console.log("XREVRANGE (last entry) ->", revRange);

    // 5. XREAD (Read data from one or multiple streams starting from a specific ID)
    // '0-0' starts from the very beginning of the stream
    const readResult = await client.xread("STREAMS", "mystream", "0-0");
    console.log("XREAD mystream -> The stream contents starting from 0-0");

    // =============================================
    // Advanced: Consumer Groups
    // =============================================

    // Create a consumer group named 'mygroup' that reads from the beginning ('0')
    // We wrap this in a try-catch because Redis throws an error if the group already exists
    try {
        await client.xgroup("CREATE", "mystream", "mygroup", "0", "MKSTREAM");
        console.log("XGROUP CREATE -> Group 'mygroup' created successfully.");
    } catch (e) {
        if (e.message.includes('BUSYGROUP')) {
            console.log("XGROUP CREATE -> Group 'mygroup' already exists.");
        } else {
            throw e;
        }
    }

    // 6. XREADGROUP (Read new messages for a consumer within a group)
    // '>' means retrieve messages that have NEVER been delivered to other consumers in this group
    const readGroupResult = await client.xreadgroup("GROUP", "mygroup", "consumer_A", "COUNT", 1, "STREAMS", "mystream", ">");
    console.log("XREADGROUP consumer_A ->", readGroupResult);

    // 7. XACK (Acknowledge that a message was successfully processed)
    // Only acknowledged messages are considered "done" by the group
    if (readGroupResult && readGroupResult[0] && readGroupResult[0][1] && readGroupResult[0][1].length > 0) {
        const msgIdToAck = readGroupResult[0][1][0][0]; // Extract the ID of the fetched message
        const ackedCount = await client.xack("mystream", "mygroup", msgIdToAck);
        console.log(`XACK message ${msgIdToAck} -> Acknowledged flag: ${ackedCount}`);
    }

    // Finished
    process.exit(0);
}

init();