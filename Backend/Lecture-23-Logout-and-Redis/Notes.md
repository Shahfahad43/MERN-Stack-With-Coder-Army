# Lecture 23: Logout Functionality and Redis

These notes explain how logout works in a backend application, why deleting a cookie is not always enough, how token blocklists work, what Redis is, why it is fast, and how Redis can reduce repeated database queries.

## 1. Understanding logout functionality

When a user logs in to an application, the server verifies the user's credentials and gives the client an authentication token. The client sends this token with subsequent requests to prove that the user is authenticated.

For example, consider an application built with Node.js, Express, MongoDB, Mongoose, and JWT.

1\. User logs in

The server verifies the email and password.

2\. Server issues a token

The client receives a JWT, often stored in a cookie.

3\. User requests protected data

The server checks the token before providing access.

4\. User logs out

The application must stop accepting the relevant authentication credential.

The important question is: How can the server stop accepting a token that it previously issued?

To understand this, we first need to distinguish between a cookie and a token.

### 1.1 What is a cookie?

A cookie is a small piece of data stored by the browser for a website. It can contain a session identifier or an authentication token.

Example:

```
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: "strict"
});
```

Here:

- `"token"` is the cookie's name.
- `jwtToken` is the value stored in it.
- `httpOnly: true` prevents ordinary client-side JavaScript from reading the cookie.
- `secure: true` tells the browser to send it only over HTTPS.
- `sameSite: "strict"` restricts when the browser sends the cookie with cross-site requests.

These settings are common security measures, but the appropriate cookie configuration depends on the application's deployment and authentication design.

### 1.2 What is a token?

A token is a credential that the server can use to determine whether a request is authenticated.

For example:

```
token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

A JWT is commonly signed so that the server can verify that its contents have not been altered.

A JWT's signature does not automatically make it revocable. If a valid JWT has not expired, the server can continue accepting it even after the user logs out, unless the application implements an additional mechanism to reject it.

### 1.3 The passport analogy

Imagine that a token is a passport.

- Logging in is like receiving a passport.
- Sending the token is like presenting the passport at a checkpoint.
- Logging out should prevent further use of that authentication credential.
- Expiration is like a passport's expiry date.

Suppose you lose your physical passport. Losing the passport does not automatically make the original passport number invalid. If somebody else has a copy of the passport details or a usable credential, they may still be able to misuse it.

Likewise, deleting a cookie from your browser does not invalidate a copy of the token held elsewhere.

That is the central problem logout functionality must solve.

## 2. Three approaches to logout

### Approach 1: Delete or expire the cookie

Your lecture's example is:

```
res.cookie("token", null, {
  expires: new Date(Date.now())
});

return res.send("Logged out successfully!");
```

This instructs the browser to expire the cookie immediately.

A more explicit implementation is:

```
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "strict"
});

return res.send("Logged out successfully!");
```

The options should match those used when the cookie was created, including its path and domain if specified.

What happens?

1. The user clicks Logout.
2. The server sends a response telling the browser to clear the cookie.
3. The browser removes the cookie.
4. Future requests from that browser no longer automatically include that cookie.

However, this approach has an important limitation.

Cookie deleted

The browser no longer sends the original cookie automatically.

Copied token still valid

Someone who copied the token before logout may still use it until it expires, if the server does not check revocation.

For example, if someone copies a valid token and stores it elsewhere, deleting the original browser cookie does not erase that copy.

### Approach 2: Make the token expire

JWTs can be created with an expiration time:

```
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);
```

The token expires after 15 minutes.

This limits how long a stolen token can be used, but it does not necessarily log the user out immediately.

For example, if a user logs out two minutes after receiving a token, the copied token may remain valid for another 13 minutes unless another revocation mechanism exists.

### Approach 3: Revoke the token immediately

The server can maintain a blocklist, also called a denylist, of revoked tokens.

When a request arrives, the server checks:

1. Is the token valid and correctly signed?
2. Has the token expired?
3. Is the token present in the blocklist?

If the token is in the blocklist, the server rejects it even if its signature is valid and its expiration time has not passed.

This is where Redis becomes useful.

## 3. Why not store every blocked token permanently in MongoDB?

A blocklist solves the copied-token problem, but it introduces a storage-management problem.

Suppose an application has one million users, and many users log in and out every day. If every revoked token is stored indefinitely, the blocklist will continue growing.

Consider these example tokens:

| Token   | Expiration | Revoked? |
| ------- | ---------- | -------- |
| Token A | 10:15 AM   | Yes      |
| Token B | 10:30 AM   | Yes      |
| Token C | 11:00 AM   | No       |
| Token D | 11:30 AM   | Yes      |

Once Token A expires at 10:15 AM, there is no need to keep its revocation entry if the server already rejects expired tokens. Its entry can be removed.

The same applies to Tokens B and D after their expiration times.

### 3.1 Store each revoked token only until its expiry

The principle is:

> A revoked token needs to remain on the blocklist only while it could otherwise be accepted.

If a JWT expires at 10:30 AM and is revoked at 10:20 AM, its blocklist entry only needs to exist for approximately 10 more minutes.

This leads to two requirements:

- Store the revoked token or an identifier for it.
- Automatically remove the entry when the token expires.

MongoDB can support expiration-based cleanup through TTL indexes, although MongoDB's TTL deletion is asynchronous rather than an exact real-time guarantee.

Redis offers a convenient alternative because each key can have its own expiration time.

## 4. What is Redis?

[Using Redis and Redis Stack with .NET — A Practical, Production‑Ready Guide | by Kerim Kara | Dec, 2025 | Medium](https://images.openai.com/static-rsc-4/hi3iigJUf8iMDhp4CxC3TFbCr2xA_TmRTLesvsnbzRLBzJKtK4vmq-9CHn_b5lo-V42JDqQVGB9E6UsDfTpTh-kgAZuIEKsOGYQsSfMdEEcCLiENVjIX1soxOykED-bB4CxJIny7IDxQM8Ruu-YsnX0qy9R805ASv-3QQA9-2l4?purpose=inline)

Redis is an in-memory data store commonly used as a database, cache, message broker, and temporary state store.

It is especially useful when an application needs to read or update small pieces of data very quickly.

Redis originally stood for Remote Dictionary Server. It stores data using keys and values, with support for different data structures such as strings, hashes, lists, sets, and sorted sets.

For example:

```
Key:    user:123
Value:  Ahmed
```

Or for a revoked token:

```
Key:    revoked:abc123
Value:  1
```

The key identifies the data, and the value indicates that the token has been revoked.

Redis can also assign an expiration time to a key, so it is removed automatically after a specified duration.

### 4.1 MongoDB vs Redis

| Feature                  | MongoDB                                                    | Redis                                                  |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------ |
| Primary storage approach | Document-oriented database; commonly persists data on disk | Primarily operates in memory                           |
| Typical use              | Persistent application data                                | Caching, short-lived state, sessions, token revocation |
| Data model               | BSON documents and collections                             | Key-value and other data structures                    |
| Persistence              | Designed for persistent data                               | Optional persistence and recovery mechanisms           |
| Expiration               | TTL indexes are available                                  | Per-key expiration is built in                         |
| Typical access speed     | Depends on queries, indexes, storage, and workload         | Often very low latency for simple operations           |
| Best role in our example | Users, products, orders                                    | Revoked tokens and cached results                      |

Important: Redis is not fast simply because MongoDB uses an SSD. MongoDB also uses memory for caching, and Redis can persist data to disk. The main advantage is that Redis is designed around fast in-memory data structures and simple access patterns. Actual performance depends on the workload and configuration.

### 4.2 Why is Redis so fast?

The main reason is that Redis primarily works with data in RAM.

RAM provides very fast access to data, while disk storage is designed for persistent storage and can involve additional I/O.

However, speed is not determined by RAM alone. Redis also benefits from:

- Efficient data structures.
- Low overhead for common operations.
- Direct key-based lookups.
- Avoiding repeated execution of expensive database queries when caching is used.

### 4.3 What is RAM, and why does it matter?

RAM means Random Access Memory. It is the working memory used by a computer while programs are running.

RAM is generally volatile: when power is lost, its contents are not retained unless another mechanism has preserved them.

That makes RAM suitable for many kinds of temporary data, but it does not mean all Redis data must be temporary.

Redis supports persistence options that can save data to disk, including snapshots and append-only logging. These options can help recover data after a restart, depending on the configuration.

For example:

- A cached product listing can usually be rebuilt from MongoDB.
- A short-lived token-revocation entry can be given an expiration time.
- An order record should generally remain in a durable database.
- A session or revocation record may need persistence depending on the application's security requirements.

Design principle: Keep permanent business records in a durable database, and use Redis for data that benefits from fast access, expiration, caching, or temporary coordination. Redis can also store durable data when explicitly configured for that purpose.

## 5. Using Redis as a token blocklist

Let's connect Redis to the logout problem.

Assume a user receives a JWT that expires in 15 minutes. Five minutes later, the user logs out.

The server can add the token to Redis with a time-to-live (TTL) of the remaining 10 minutes.

User logs out

JWT has 10 minutes remaining before expiration.

Redis stores the revocation entry

The entry receives a TTL of approximately 600 seconds.

A request presents the same JWT

The server checks the token's validity and the Redis blocklist.

Request rejected

The token is revoked, even though it has not yet expired.

After the remaining 10 minutes, Redis automatically removes the entry. At that point, the JWT is expired, so it should still be rejected by the JWT verification step.

### 5.1 What is TTL?

TTL means Time To Live. It is the amount of time a key is allowed to exist before it expires.

Example:

```
Key: revoked:abc123
Value: 1
TTL: 600 seconds
```

This means the revocation entry should expire after approximately 10 minutes.

In Redis, the command to set a key with an expiration is:

```
SET revoked:abc123 1 EX 600
```

- `SET` creates or updates the key.
- `revoked:abc123` is the key.
- `1` is the value.
- `EX 600` sets its expiration to 600 seconds.

After the TTL expires, Redis automatically removes the key. You do not need a separate cleanup loop for every revoked token.

### 5.2 Why use the remaining lifetime instead of a fixed TTL?

Suppose two tokens are revoked:

- Token A expires in 2 minutes.
- Token B expires in 14 minutes.

If both receive a fixed 15-minute TTL, Token A's blocklist entry will remain longer than necessary.

A better approach calculates the remaining token lifetime and uses that as the TTL.

For a JWT with an `exp` claim:

```
const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);
```

If `remainingSeconds` is positive, the server can use it as the TTL. If the token has already expired, there is no need to add a blocklist entry for it.

The server must still verify the token properly and reject expired tokens; this calculation does not replace verification.

### 5.3 Should the entire JWT be stored in Redis?

It is possible, but a token's full value can be unnecessarily large and sensitive.

A common alternative is to use a cryptographic hash of the token as the Redis key:

```
revoked:<SHA-256 hash of token>
```

During a request, the server hashes the presented token and checks for the corresponding key.

This avoids storing the original bearer token directly in the blocklist. The server must use the same hashing procedure consistently.

## 6. Redis vs an array or Set stored in application RAM

Your lecture mentions storing revoked tokens in an array or Set in RAM to avoid database queries.

This is a reasonable idea for understanding the problem, but it has limitations.

### 6.1 The local `Set` approach

For example:

```
const revokedTokens = new Set();

revokedTokens.add("abc123");

console.log(revokedTokens.has("abc123")); // true
```

A `Set` allows the application to check whether a token exists in the collection.

However, consider these problems:

1. Application restart: The `Set` is lost when the process restarts.
2. Multiple servers: Each server has its own separate `Set`.
3. Memory growth: Entries must be cleaned up when their tokens expire.
4. Synchronization: Every server must receive the same revocation updates.

If a load balancer sends a request to a different server, that server might not know that the token was revoked on the first server.

### 6.2 Redis solves the shared-state problem

Instead of each server maintaining its own blocklist, all servers connect to the same logical Redis deployment.

Shared Redis blocklist

Server A

Checks Redis

Server B

Checks Redis

Server C

Checks Redis

Server D

Checks Redis

All application servers use the shared revocation data instead of relying on separate local collections.

This makes it easier to keep revocation data consistent across application instances. Redis itself still needs appropriate deployment, availability, access control, and recovery configuration.

Key distinction: Redis does not automatically solve every replication problem. It provides shared data storage and features that make this design easier; the application's architecture and Redis deployment determine the actual behavior.

## 7. Redis as a cache: avoiding repeated MongoDB queries

Redis has another important use: caching.

Imagine that an application displays the same product list whenever users open its homepage.

If 10,000 users request that list, does the application need to query MongoDB 10,000 times?

Not necessarily. If the result is suitable for caching, Redis can store a copy and return it for subsequent requests.

### 7.1 What is caching?

A cache is a place where frequently used data is stored temporarily so it can be accessed more quickly.

Think of a library:

- MongoDB is the main library where all the books are stored.
- Redis is like keeping frequently requested books on your desk.
- When someone requests a book that is already on your desk, you do not need to visit the library again.

The data in Redis is often called a cached copy. MongoDB remains the source of truth for the example below.

### 7.2 Cache miss and cache hit

Two important terms are:

- Cache miss: The requested data is not in Redis, so the application must retrieve it from MongoDB or another source.
- Cache hit: The requested data is already in Redis, so the application can return it without querying MongoDB for that result.

Client requests product list

Application checks Redis

Cache hit

Data exists

Return cached data

No MongoDB query for this result

Cache miss

Data absent

Query MongoDB, cache result, return data

### 7.3 Example without Redis

Suppose we have a Mongoose model named `Product`:

```
app.get("/products", async (req, res) => {
  const products = await Product.find();

  return res.json(products);
});
```

Every successful request executes `Product.find()`.

If 100 requests arrive, the application may execute this query 100 times. The exact workload can differ if there are errors, caching elsewhere, or other optimizations.

### 7.4 Example with Redis caching

First, install the Redis client for Node.js:

```
npm install redis
```

Then create a Redis connection:

```
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connectRedis() {
  await redisClient.connect();
}

module.exports = { redisClient, connectRedis };
```

Connect to Redis before starting to accept requests:

```
const express = require("express");
const { connectRedis } = require("./redisClient");

const app = express();

async function startServer() {
  await connectRedis();

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
  });
}

startServer().catch(console.error);
```

Now, use Redis in the product route:

```
const express = require("express");
const Product = require("./models/Product");
const { redisClient } = require("./redisClient");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const cacheKey = "products:all";

    // 1. Check Redis first
    const cachedProducts = await redisClient.get(cacheKey);

    if (cachedProducts !== null) {
      return res.json(JSON.parse(cachedProducts));
    }

    // 2. If not cached, query MongoDB
    const products = await Product.find().lean();

    // 3. Store the result in Redis for 60 seconds
    await redisClient.set(cacheKey, JSON.stringify(products), {
      EX: 60
    });

    // 4. Return the result
    return res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

This example assumes the Redis connection has been established and that the route's error-handling middleware is configured.

`lean()` tells Mongoose to return plain JavaScript objects rather than full Mongoose documents. That is useful here because the cached data is being serialized as JSON and does not need document methods.

### 7.5 How the example behaves

Assume the product cache initially does not exist.

| Request          | Redis result           | MongoDB queried?            | What happens                    |
| ---------------- | ---------------------- | --------------------------- | ------------------------------- |
| 1                | Cache miss             | Yes                         | Products are fetched and cached |
| 2                | Cache hit              | No                          | Cached products are returned    |
| 3                | Cache hit              | No                          | Cached products are returned    |
| 4                | Cache hit              | No                          | Cached products are returned    |
| After 60 seconds | Entry may have expired | Depends on the next request | A new miss can refill the cache |

If 100 requests arrive while the cache is valid, many of them can be served from Redis instead of executing the same MongoDB query. This reduces repeated database work.

### 7.6 What if a product changes in MongoDB?

Suppose an administrator changes a product's price. The cached product list may still contain the old price.

This is called stale cache data.

One solution is to delete the cached entry after updating the database:

```
await Product.findByIdAndUpdate(productId, {
  price: newPrice
});

await redisClient.del("products:all");
```

The next request will miss the cache, retrieve the latest products from MongoDB, and populate Redis again.

This pattern is called cache invalidation.

Other approaches include short TTLs, updating the cache after a database write, or using more advanced cache-invalidation strategies.

Important: Redis caching is not appropriate for every endpoint. Personal, permission-sensitive, rapidly changing, or financial data may require careful cache keys and invalidation rules. Never let one user's private response be served to another user through a shared cache.

## 8. Implementing logout using Redis and Express

Let's now put the ideas together.

This example assumes:

- Your application issues JWT access tokens.
- The token is stored in a cookie named `token`.
- The JWT contains an `exp` claim.
- `JWT_SECRET` is configured in the environment.
- A Redis connection is already available.
- `cookie-parser` is configured in Express.

Install the required packages if they are not already installed:

```
npm install redis jsonwebtoken cookie-parser
```

### 8.1 Logout route

```
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("./redisClient");

const router = express.Router();

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // Clear the browser's cookie even if no token is present.
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });

    if (!token) {
      return res.status(200).json({
        message: "Logged out successfully"
      });
    }

    // Verify the token before trusting its expiration claim.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const remainingSeconds =
      decoded.exp - Math.floor(Date.now() / 1000);

    if (remainingSeconds > 0) {
      // Store a hash instead of the original token.
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await redisClient.set(
        `revoked:${tokenHash}`,
        "1",
        { EX: remainingSeconds }
      );
    }

    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(200).json({
        message: "Logged out successfully"
      });
    }

    next(error);
  }
});

module.exports = router;
```

This is an instructional example, not a complete production authentication system. In particular, if Redis is unavailable, a security-sensitive application should not silently treat the token as successfully revoked. The error-handling policy should ensure protected endpoints do not accept tokens when their required revocation check cannot be performed.

### 8.2 Why clear the cookie and block the token?

They solve two different problems.

| Action                 | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| Clear the cookie       | Removes the browser's stored credential                              |
| Add the token to Redis | Prevents the server from accepting the revoked credential            |
| Set a TTL              | Automatically removes the blocklist entry when the token expires     |
| Verify the JWT         | Checks signature, expiration, and other configured token constraints |

Clearing the cookie alone is not sufficient when the token may have been copied. Blocking the token alone may prevent its use, but clearing the cookie still gives the user a clean browser-side logout experience.

### 8.3 Authentication middleware must check Redis

Adding a token to Redis does not automatically block it. Every protected request must perform the blocklist check.

For example:

```
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("./redisClient");

async function authenticateUser(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please log in"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const isRevoked = await redisClient.exists(
      `revoked:${tokenHash}`
    );

    if (isRevoked) {
      return res.status(401).json({
        message: "Token has been revoked. Please log in again."
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }

    // Do not accidentally treat a Redis outage as authentication success.
    next(error);
  }
}

module.exports = authenticateUser;
```

For this to work, the application needs centralized error handling that returns an appropriate failure response if Redis is unavailable. The protected route must not proceed without the required revocation check.

Also, if your application accepts tokens through the `Authorization` header instead of cookies, the middleware must extract the token from that header.

### 8.4 Protected route example

```
const express = require("express");
const authenticateUser = require("./middleware/authenticateUser");

const router = express.Router();

router.get("/profile", authenticateUser, (req, res) => {
  return res.json({
    message: "Protected profile data",
    user: req.user
  });
});

module.exports = router;
```

The request flow is now:

1. The user logs in and receives a token.
2. The user accesses the protected profile.
3. The middleware verifies the JWT and checks Redis.
4. If the token is valid and not revoked, the request proceeds.
5. The user logs out.
6. The server clears the cookie and adds the token's hash to Redis.
7. A copied version of the same token is rejected by the middleware.

One important limitation: Revoking an access token does not automatically revoke a separate refresh token or other active sessions. If the application uses refresh tokens, those need their own revocation or rotation strategy.

## 9. Installing Redis on Windows 11

There are three practical options for running Redis-compatible services on Windows. The best choice depends on whether you want a simple local development setup or the official Redis server in a Linux environment.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://redis.io&sz=32)

Docs

+2

[How to Run Redis on Windows — Every Practical Option in 2025 | by shin | Medium](https://images.openai.com/static-rsc-4/KeBDnETJgybpNTIxpyqoXLTsjZJZCItOlEQW_Q1rpJYTdXP1Z5sKrnQWmOpxKnvn2CXVHmalco3TLbNpzvVqNmnKODh1baa5T9BAZ_C07vhu2KTabawxxtWKHhXIuNmrfhhu1Gkx68K_zg_cxO8UWu43K3_QOIdRS9qNN0COheg?purpose=inline)

Option 1: Memurai — native Windows installation

Best if you want a straightforward Windows installer.

1. Open the [official Memurai download page](https://www.memurai.com/get-memurai?utm_source=chatgpt.com).
2. Download the Developer Edition for development and testing.
3. Run the installer and, if offered, configure it to run as a Windows service.
4. Open PowerShell and test the connection using the included command-line client.

```
memurai-cli.exe ping
```

The expected response is `PONG` if the client connects successfully to the running service on its default port.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://redis.io&sz=32)

Redis

+1

[Docker Desktop - Download and install on Windows | Microsoft Store](https://images.openai.com/static-rsc-4/b7gTgu5g7MNN_S0rVhTqsFBDolg55r2MIyJUcxHLmjxv7fxQYjrd6OAdH80vAOKIkdD-4U1iiHC0XBYfvXN-RJ9HvILfLay8mSvwkWjW5F6DWWVFa6Ry8PBV5YtrMvyWmivrX3-JwARHIHsNQFlhNh1PI9pBnP7Ne3zp5MH7-78?purpose=inline)

Option 2: Docker Desktop

Best if you already use Docker for backend development.

1. Install [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/?utm_source=chatgpt.com).
2. Start Docker Desktop.
3. Run the following in PowerShell:

```
docker run -d --name redis -p 6379:6379 redis
```

4\. Test Redis:

```
docker exec -it redis redis-cli ping
```

Expected response:

```
PONG
```

This runs Redis in a container and exposes port `6379` on your computer.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://redis.io&sz=32)

Docs

+1

[ClinicMaster INTERNATIONAL](https://images.openai.com/static-rsc-4/LL_uhk0iJjO3vJzlkX9BOPATizCsH_I7ipcK4Q9hlUASNvX1cbd48I__CpMr81WyGky80KcgQbY3q4zGdmg2LOqoUJLHl-5C9wLXOdnFXqMyjcljjnaOwOrqTzj69IqCFuoXYrpzCMUobZxr-uhLozDhk8Hnd9tT5c1AUBQ8rVE?purpose=inline)

Option 3: WSL 2 with Ubuntu

Best if you want to practice Linux commands alongside backend development.

1. Open PowerShell as Administrator.
2. Install WSL:

```
wsl --install
```

3. Restart if prompted and complete the Ubuntu setup.
4. In Ubuntu, follow the [official Redis WSL installation instructions](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-windows/?utm_source=chatgpt.com).
5. Start Redis and test with `redis-cli ping`.

The expected response is `PONG`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://redis.io&sz=32)

Docs

+1

For a beginner using Windows 11, Docker is a useful choice if Docker is already part of your development workflow; Memurai is simpler if you want a native Windows service.

### 9.1 Connect your Node.js application to Redis

Once a Redis-compatible server is running locally, configure your application's `.env` file:

```
REDIS_URL=redis://localhost:6379
```

Then connect using the Node.js Redis client:

```
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

async function main() {
  await redisClient.connect();

  console.log(await redisClient.ping());
}

main().catch(console.error);
```

Expected output:

```
PONG
```

Do not expose a Redis service to the public internet without appropriate authentication, network restrictions, and security configuration.

## 10. Important Redis concepts to remember

| Concept            | Meaning                                             | Example                                |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| In-memory database | Primarily works with data in RAM                    | Redis                                  |
| Key-value store    | Access data using a key                             | `user:123 → Ahmed`                     |
| Cache              | Stores a copy of frequently used data               | Cached product list                    |
| Cache hit          | Requested data exists in the cache                  | Return data from Redis                 |
| Cache miss         | Requested data is absent                            | Fetch from MongoDB                     |
| TTL                | Time until a key expires                            | 60 seconds                             |
| Blocklist          | Records credentials that must be rejected           | Revoked JWT hashes                     |
| Cache invalidation | Removes or updates stale cached data                | Delete `products:all`                  |
| Shared state       | Data accessible to multiple application instances   | Shared Redis deployment                |
| Persistence        | Preserving data beyond a process or machine restart | Redis snapshots or append-only logging |

## 11. Common mistakes

1. Thinking that clearing a cookie revokes the token. It only removes the browser's cookie; a copied token can remain usable.
2. Forgetting to check Redis in authentication middleware. Adding a token to a blocklist does nothing unless protected requests check it.
3. Keeping expired token entries forever. Use an appropriate TTL to clean up revocation entries.
4. Assuming Redis never loses data. Redis can use persistence, but durability depends on its configuration and deployment.
5. Assuming every request must query MongoDB. Suitable repeated queries can use cached results.
6. Ignoring stale cache data. Update or invalidate cache entries when the underlying data changes.
7. Proceeding when the revocation check fails. If a security-critical Redis check is unavailable, do not silently accept the token.
8. Using the same cache key for different users' private data. Include the relevant identity and permissions in the cache design, or avoid shared caching for that response.
9. Assuming logout invalidates every active session. Other access tokens, refresh tokens, and devices may need separate revocation.

## 12. Interview questions and answers

1\. Why is deleting a cookie not enough for secure logout?

Because deleting a cookie removes it from the current browser but does not invalidate copies of the token. The server must also reject revoked credentials if immediate revocation is required.

2\. What is Redis?

Redis is an in-memory data store that supports key-value operations and data structures. It is commonly used for caching, sessions, rate limiting, and token revocation.

3\. Why use Redis instead of a JavaScript array or Set for a token blocklist?

Redis provides shared state across application instances, key expiration, and persistence options. A local `Set` is isolated to one process and disappears when that process restarts.

4\. What is TTL in Redis?

TTL stands for Time To Live. It determines how long a key remains available before expiring.

5\. Why is Redis often faster for repeated lookups?

Redis is optimized for low-latency operations on in-memory data structures. It can also eliminate the need to repeat expensive queries against another database.

6\. What is a cache miss?

A cache miss occurs when the requested data is absent from the cache, so the application must fetch it from its original source or another fallback.

7\. What is a cache hit?

A cache hit occurs when the requested data is already cached and can be returned without fetching that result again from the primary database.

8\. Why should revoked JWT entries expire?

Once a JWT has expired, a correctly configured server should reject it anyway. Keeping its revocation entry beyond that point is usually unnecessary.

9\. Does Redis replace MongoDB?

Not necessarily. MongoDB can remain the durable source of truth for application data, while Redis handles caching and short-lived state. Both can be used together.

10\. What happens if Redis becomes unavailable?

Requests that depend on Redis may fail. For protected routes requiring revocation checks, the application should fail safely rather than accepting tokens without checking their revocation status.

## 13. Practice questions

Try answering these before looking back at the notes.

1\. A user deletes their login cookie, but an attacker has copied the JWT. What is the problem?

The cookie was too large

The copied JWT may still be valid

MongoDB automatically deletes the JWT

2\. Why does the Redis blocklist entry need a TTL?

To extend the JWT's lifetime

To keep all revoked tokens forever

To remove the entry after the token can no longer be accepted

3\. Redis contains a cached product list. What happens on a cache hit?

The application can return the cached list

MongoDB must always be queried first

The product list is deleted

4\. Why can a local JavaScript Set be unreliable for revocation in a multi-server app?

A Set cannot store strings

Each server has its own memory and may have different entries

A Set automatically writes every item to MongoDB

Reset practice

## Final revision summary

Remember these five ideas:

1. Cookie deletion is not token revocation. A copied JWT may still be usable.
2. Redis can maintain a token blocklist. Middleware must check the blocklist on protected requests.
3. TTL automates cleanup. A revocation entry can expire when its token's remaining lifetime ends.
4. Redis can cache repeated database results. Cache hits avoid repeating the same database query, while cache misses fetch and populate the cache.
5. MongoDB and Redis have complementary roles. MongoDB commonly stores durable application records; Redis is useful for fast lookups, caching, and temporary state.

The central lesson of Lecture 23 is that Redis is not just a fast database—it is a practical tool for managing temporary application state and reducing repeated work. Its usefulness depends on designing expiration, revocation, caching, and failure handling correctly.
