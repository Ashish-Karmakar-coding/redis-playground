import client from './client.js'

async function init() {
    console.log("--- Strings Operations ---");
    
    // 1. SET and GET
    await client.set("user:1", "John Doe");
    const getResult = await client.get("user:1");
    console.log("GET user:1 ->", getResult);
    
    // 2. MSET and MGET (Multiple Set/Get)
    await client.mset("user:2", "Alice", "user:3", "Bob");
    const mgetResult = await client.mget("user:1", "user:2", "user:3");
    console.log("MGET user:1 user:2 user:3 ->", mgetResult);
    
    // 3. INCR, DECR (Counters)
    await client.set("page_views", 100);
    await client.incr("page_views");
    const views = await client.get("page_views");
    console.log("INCR page_views ->", views);
    
    // 4. EXPIRE and TTL (Time To Live)
    await client.set("temp_key", "I will disappear");
    await client.expire("temp_key", 10); // Expires in 10 seconds
    const ttlResult = await client.ttl("temp_key");
    console.log("TTL temp_key ->", ttlResult, "seconds");

    // Finished
    process.exit(0);
}

init()