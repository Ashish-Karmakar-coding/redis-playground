# Redis Playground

This repository is a collection of Node.js scripts demonstrating the fundamental operations on various Redis data structures. It uses the `ioredis` client to interact with a local Redis instance and is intended for learning, testing, and experimenting with Redis commands.

## Useful Links & Documentation
- **Redis Data Types Docs:** [https://redis.io/docs/latest/develop/data-types/](https://redis.io/docs/latest/develop/data-types/)
- **Redis Docker Installation:** [https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-stack/docker/](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-stack/docker/)

## Included Examples

This playground provides ready-to-use scripts covering real-world operations for the core Redis data types:

- `string.js` — Demonstrates operations on Strings (`SET`, `GET`, `MSET`, `INCR`, `EXPIRE`, etc.).
- `lists.js` — Demonstrates operations on Lists (`LPUSH`, `RPUSH`, `LRANGE`, `LPOP`, `LLEN`, etc.).
- `sets.js` — Demonstrates operations on Sets (`SADD`, `SMEMBERS`, `SISMEMBER`, `SINTER`, `SREM`, etc.).
- `hashs.js` — Demonstrates operations on Hashes (`HSET`, `HGETALL`, `HDEL`, `HEXISTS`, `HINCRBY`, etc.).

## How to Run

### 1. Start a Redis Server
Make sure you have a Redis server running locally on the default port `6379`. You can quickly run it using Docker:
```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

### 2. Install Dependencies
Run the following command to install the necessary Node.js dependencies (`ioredis`):
```bash
npm install
```

### 3. Run the Playground Scripts
Execute any of the `.js` files using Node to see the operations in action:
```bash
node string.js
node lists.js
node sets.js
node hashs.js
```
