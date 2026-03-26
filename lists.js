import client from "./client.js";

async function init() {
    console.log("--- Lists Operations ---");
    // Clear list first if it exists
    await client.del("messages");

    // 1. LPUSH and RPUSH (Push to start or end of list)
    await client.lpush("messages", "msg2"); // Left push
    await client.lpush("messages", "msg1"); 
    await client.rpush("messages", "msg3"); // Right push
    
    // 2. LRANGE (Read a range of elements)
    const allMessages = await client.lrange("messages", 0, -1);
    console.log("LRANGE messages 0 -1 ->", allMessages);
    
    // 3. LLEN (Length of the list)
    const len = await client.llen("messages");
    console.log("LLEN messages ->", len);
    
    // 4. LPOP and RPOP (Remove and return from start or end)
    const firstMsg = await client.lpop("messages");
    const lastMsg = await client.rpop("messages");
    console.log(`LPOP -> ${firstMsg}, RPOP -> ${lastMsg}`);
    
    // Verify list after pops
    const remaining = await client.lrange("messages", 0, -1);
    console.log("Remaining List ->", remaining);

    // Finished
    process.exit(0);
}

init()