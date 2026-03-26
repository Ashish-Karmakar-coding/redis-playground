import client from './client.js';

async function init() {
    console.log("--- Sets Operations ---");
    // Clear sets first if they exist
    await client.del("users:active");
    await client.del("users:premium");

    // 1. SADD (Add items to a set - automatically ensures uniqueness)
    await client.sadd("users:active", "john", "alice", "bob");
    await client.sadd("users:active", "john"); // Trying to add duplicate handles gracefully

    // 2. SMEMBERS (Get all items in a set)
    const activeUsers = await client.smembers("users:active");
    console.log("SMEMBERS users:active ->", activeUsers);

    // 3. SISMEMBER (Check if item exists in set)
    const isJohnActive = await client.sismember("users:active", "john");
    const isMikeActive = await client.sismember("users:active", "mike");
    console.log("SISMEMBER is John active? ->", isJohnActive);
    console.log("SISMEMBER is Mike active? ->", isMikeActive);

    // 4. SCARD (Get the number of members in a set)
    const count = await client.scard("users:active");
    console.log("SCARD elements in users:active ->", count);
    
    // 5. SREM (Remove element from set)
    await client.srem("users:active", "bob");
    console.log("After SREM bob ->", await client.smembers("users:active"));

    // 6. SINTER (Intersection of multiple sets)
    await client.sadd("users:premium", "alice", "mike");
    const premiumActive = await client.sinter("users:active", "users:premium");
    console.log("SINTER common users in both sets ->", premiumActive);

    // Finished
    process.exit(0);
}

init();
