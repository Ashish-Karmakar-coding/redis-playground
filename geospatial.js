import client from "./client.js";

async function init() {
    console.log("--- Geospatial Operations ---");
    // Clear geospatial index first if it exists
    await client.del("stores:locations");

    // 1. GEOADD (Add members with longitude and latitude)
    // NOTE: Longitude comes first, then Latitude
    await client.geoadd(
        "stores:locations",
        13.361389, 38.115556, "Palermo",   // Longitude, Latitude, Name
        15.087269, 37.502669, "Catania",
        12.496365, 41.902783, "Rome"
    );
    console.log("GEOADD -> Added Palermo, Catania, and Rome");

    // 2. GEOPOS (Get the coordinates of specific members)
    const positions = await client.geopos("stores:locations", "Palermo", "Rome");
    console.log("GEOPOS Palermo and Rome ->", positions);

    // 3. GEODIST (Get the distance between two members)
    // You can specify unit: "m" (meters), "km" (kilometers), "mi" (miles), "ft" (feet)
    const distanceKm = await client.geodist("stores:locations", "Palermo", "Catania", "km");
    const distanceMiles = await client.geodist("stores:locations", "Palermo", "Rome", "mi");
    console.log(`GEODIST -> Palermo to Catania is ${distanceKm} km`);
    console.log(`GEODIST -> Palermo to Rome is ${distanceMiles} miles`);

    // 4. GEORADIUS (Search for members within a specific radius based on a center coordinate)
    // NOTE: In newer Redis versions (6.2+), GEOSEARCH is preferred, but GEORADIUS is widely supported.
    // Here we search for any stores within 200 kilometers of coordinates [15.0, 37.0]
    // WITHDIST returns the distance. ASC sorts them closer distances first.
    const radiusResult = await client.georadius(
        "stores:locations",
        15, 37,                  // Starting center point (Longitude, Latitude)
        200, "km",               // Search radius and unit
        "WITHDIST",              // Include distance
        "ASC"                    // Sort ascending by distance
    );
    console.log("GEORADIUS within 200km of [15.0, 37.0] ->", radiusResult);

    // Finished
    process.exit(0);
}

init();
