import client from "./client";
async function main() {
const response = await client.get("name")
console.log(response);
}

main();