import client from './client.js';

async function init() {
    console.log("--- Hashes Operations ---");
    // Clear hash first if it exists
    await client.del("bike:1");

    // 1. HSET (Set one or multiple fields)
    await client.hset("bike:1", {
        model: "Deimos",
        brand: "Ergonom",
        price: 4972,
        type: "Mountain Bike"
    });
    // Or set individually: await client.hset("bike:1", "color", "red");
    await client.hset("bike:1", "color", "red");

    // 2. HGET (Get the value of a single field)
    const model = await client.hget("bike:1", "model");
    console.log("HGET model ->", model);

    // 3. HMGET (Get the values of multiple fields)
    const someFields = await client.hmget("bike:1", "model", "price", "color");
    console.log("HMGET model, price, color ->", someFields);

    // 4. HGETALL (Get all fields and values in a hash)
    const allBikeData = await client.hgetall("bike:1");
    console.log("HGETALL bike:1 ->", allBikeData);

    // 5. HDEL (Delete one or more fields)
    await client.hdel("bike:1", "type");
    console.log("After HDEL type ->", await client.hgetall("bike:1"));

    // 6. HEXISTS (Check if a field exists inside the hash)
    const hasPrice = await client.hexists("bike:1", "price");
    const hasType = await client.hexists("bike:1", "type");
    console.log("HEXISTS price (1=true, 0=false)? ->", hasPrice);
    console.log("HEXISTS type? ->", hasType);

    // 7. HLEN (Get the number of fields in the hash)
    const numFields = await client.hlen("bike:1");
    console.log("HLEN bike:1 ->", numFields);

    // 8. HKEYS and HVALS (Get only the keys or only the values)
    const keys = await client.hkeys("bike:1");
    const values = await client.hvals("bike:1");
    console.log("HKEYS ->", keys);
    console.log("HVALS ->", values);

    // 9. HINCRBY (Increment a numeric field)
    await client.hincrby("bike:1", "price", 100);
    console.log("After HINCRBY price (+100) ->", await client.hget("bike:1", "price"));

    // Finished
    process.exit(0);
}

init();
