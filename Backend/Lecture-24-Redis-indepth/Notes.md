# Lecture 24: Redis In Depth

These notes explain how to create a Redis account or access a Redis server, connect Redis to Node.js, store data as key-value pairs, implement logout using Redis, and block revoked JWTs from accessing protected routes.

The examples use Node.js, Express, JWT, cookies, and Redis, building on the previous lecture about logout functionality.

## 1. What is Redis?

Redis is an in-memory data store that is commonly used for:

- Caching frequently requested data.
- Managing login sessions.
- Blocking revoked authentication tokens.
- Storing temporary information.
- Rate limiting API requests.
- Sharing data between multiple backend servers.

Redis is designed for fast data access. Its core data model uses keys to identify values, allowing applications to retrieve or update information efficiently.

### 1.1 Why does Redis store data as key-value pairs?

Imagine a school database containing student information.

You might store a student's information like this:

Key

### student:101

Value

### Ahmed

Key

### student:102

Value

### Muhammad

Here:

- The key uniquely identifies an entry within the relevant Redis database.
- The value contains the data associated with that key.

For example, the following Redis command stores a value:

```
SET student:101 Ahmed
```

To retrieve it:

```
GET student:101
```

Output:

```
Ahmed
```

You do not need to search every student record to find Ahmed. You can request the value directly using its key.

Important: Redis is more than a simple key-value store. It also supports data structures such as hashes, lists, sets, sorted sets, and streams. However, the key-value concept is the foundation for understanding its basic operations.

### 1.2 Why is this useful for authentication?

Suppose a user logs out, and the server needs to block their JWT.

The application can store a key such as:

```
token:abc123xyz
```

with a value such as:

```
Blocked
```

The application can later check whether that key exists. If it exists, the token has been revoked.

This is a fast, direct lookup rather than a query that scans a collection of user records.

In production, it is generally better to use a hash of the token as the key rather than store the original bearer token in Redis. The lecture's original form is useful for learning the concept.

## 2. Creating a Redis account and connecting to a server

The exact steps depend on which Redis service you use. There are two common situations.

[From Cloud to Code: Redis Integration and Visualization](https://images.openai.com/static-rsc-4/RbcXFUiWGCCGEShNdPXhKP5sExuQafKsAtsf-8YYmDjDvKjVMxAtOiyq8_T3JuFV-FTztv2ZPHlpTROF5PQ28VYwtQDYMPH45mJWU5HlFoGch1VLxVMHInSQjVjyubyEa1JXlMD7YQJi5_os5u2xKYK1KCo96k2jagAeturRFaM?purpose=inline)

Option A: Redis Cloud

Redis Cloud is a hosted service. You create an account, create a database, and connect your application using the connection details provided by the service.

1. Open the [Redis Cloud website](https://redis.io/cloud/?utm_source=chatgpt.com).
2. Sign up or sign in.
3. Create a database using the available free or paid options.
4. Open the database's connection information.
5. Obtain its endpoint, port, username if required, and password.
6. Use those details in your Node.js application's environment variables.

The precise dashboard labels and available plans can change.

[手把手帶你在 MacOS 安裝 Redis ＆Another Redis Desktop Manager - Dean Lin - Medium](https://images.openai.com/static-rsc-4/7_F-XgAB2GxmK9gsa3U38LxD0f_mAaz4KbXQnCvJOSLz4ZteOnEBHqm3XxX0aW8u9RzHwEDD9YKtQOKcbtmzolMzRpemVJenJtlYWll0uSYYxg0_EK_RJPGZjmEz6dYHGBmViXKQa-ICPu1ZEKhLYvWxUPBDVmxLRRdAFZqXOCg?purpose=inline)

Option B: Local Redis-compatible server

You can use a local Redis server or a compatible implementation such as Memurai on Windows, or run Redis through Docker or WSL 2.

For example, if a local Redis server is already running on the default port:

```
Host: localhost
Port: 6379
```

You can connect your Node.js application without creating a hosted Redis Cloud account.

### 2.1 What connection information do you need?

A Redis connection typically requires:

| Setting          | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| Host or endpoint | Identifies the Redis server                    |
| Port             | Identifies the network port                    |
| Username         | Identifies the Redis user, if configured       |
| Password         | Authenticates the connection, if required      |
| TLS settings     | Protects traffic for services that require TLS |

A hosted Redis service may provide a connection URL instead of requiring you to enter every setting individually.

For example, a local connection URL might be:

```
redis://localhost:6379
```

A hosted service may supply a URL containing credentials or require TLS. Use the exact connection method specified by your provider.

Security note: Never publish a real Redis password or credential-bearing connection URL in source code, screenshots, or a public GitHub repository.

## 3. Installing the Redis client in Node.js

Redis is the data store; your Node.js application needs a client library to communicate with it.

The commonly used official Node.js client is the `redis` npm package.

Open your project's terminal or PowerShell and run:

```
npm install redis
```

If you are also using Express, JWT, and cookie-based authentication, you may need these packages:

```
npm install express jsonwebtoken cookie-parser dotenv
```

Install only packages your project actually uses.

### 3.1 Create environment variables

Create a `.env` file in the root of your project.

For a local Redis server:

```
PORT=3000
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace_with_a_long_random_secret
```

For a hosted Redis database, use the connection URL and credentials supplied by your provider instead of the local URL.

Load the environment variables early in your application's entry point:

```
require("dotenv").config();
```

The `.env` file should be included in `.gitignore` so credentials are not accidentally committed to GitHub.

### 3.2 Connect Node.js to Redis

Create a file called `redisClient.js`:

```
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  console.log("Connected to Redis");
}

module.exports = {
  redisClient,
  connectRedis
};
```

Then, in your main application file:

```
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { connectRedis } = require("./redisClient");

const app = express();

app.use(express.json());
app.use(cookieParser());

async function startServer() {
  await connectRedis();

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
  });
}

startServer().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});
```

This example connects to Redis before accepting HTTP requests. It avoids starting the application in a partially initialized state when Redis is essential to authentication.

### 3.3 Test the connection

You can test Redis by writing a value and reading it back:

```
const { redisClient } = require("./redisClient");

async function testRedis() {
  await redisClient.set("message", "Hello from Node.js");

  const value = await redisClient.get("message");

  console.log(value);
}

testRedis();
```

Expected output:

```
Hello from Node.js
```

The operations are:

- `set()` — store a value.
- `get()` — retrieve a value.
- `exists()` — check whether a key exists.
- `del()` — delete a key.
- `expire()` — set a key's lifetime in seconds.
- `expireAt()` — set a key's expiration using a Unix timestamp in seconds.

## 4. Understanding Redis commands in detail

### 4.1 `SET`: storing data

```
await redisClient.set("name", "Ahmed");
```

This creates or replaces the value associated with the key `name`.

Equivalent Redis command:

```
SET name Ahmed
```

If you set the same key again:

```
await redisClient.set("name", "Ali");
```

The value becomes `Ali`. A normal `SET` operation replaces the previous value associated with that key.

### 4.2 `GET`: retrieving data

```
const name = await redisClient.get("name");

console.log(name);
```

Output:

```
Ali
```

If the key does not exist, `GET` returns `null`.

### 4.3 `EXISTS`: checking whether a key exists

```
const result = await redisClient.exists("name");

console.log(result);
```

The result is `1` if the key exists and `0` if it does not.

This command is particularly useful for checking whether a token has been revoked.

```
const isBlocked = await redisClient.exists(`token:${token}`);

if (isBlocked) {
  throw new Error("Token has been revoked");
}
```

Notice that `exists()` returns a number, not a Boolean. In JavaScript, `0` is falsy and `1` is truthy, so this conditional works.

### 4.4 `EXPIRE`: setting a lifetime in seconds

```
await redisClient.set("temporary", "Hello");
await redisClient.expire("temporary", 60);
```

The key should expire after 60 seconds.

This is useful for temporary information such as:

- Verification codes.
- Short-lived sessions.
- Cache entries.
- Revoked tokens that are already scheduled to expire.

### 4.5 `EXPIREAT`: setting a specific expiration time

Unlike `EXPIRE`, which takes a duration, `EXPIREAT` takes an absolute Unix timestamp.

For example:

```
const expirationTimestamp = 1792872000;

await redisClient.set("temporary", "Hello");
await redisClient.expireAt(
  "temporary",
  expirationTimestamp
);
```

The timestamp represents a specific moment in time, expressed as seconds since January 1, 1970 UTC.

This distinction matters for JWTs because a JWT's `exp` claim is also expressed as a Unix timestamp in seconds.

### 4.6 Setting the value and expiry together

For token revocation, you can often use one operation:

```
await redisClient.set(
  "token:example",
  "Blocked",
  { EX: 600 }
);
```

Or, for an absolute Unix expiration timestamp:

```
await redisClient.set(
  "token:example",
  "Blocked",
  { EXAT: expirationTimestamp }
);
```

This is preferable to setting the value and then setting its expiration in a separate operation. It avoids a gap in which the key exists without its intended expiry.

## 5. Understanding the logout code from Lecture 24

Your lecture uses this pattern:

```
// logout
router.post("/logout", userAuth, async (req, res) => {
  try {
    const { token } = req.cookies;

    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");

    await redisClient.expireAt(
      `token:${token}`,
      payload.exp
    );

    return res.send("Logged out successfully!");
  } catch (err) {
    return res.send("Error " + err.message);
  }
});
```

Let's understand each part.

### 5.1 `router.post("/logout", userAuth, ...)`

This defines a POST endpoint for logging out.

The request flow is:

1. The client sends a POST request to `/logout`.
2. `userAuth` runs first.
3. If authentication succeeds, the logout handler runs.
4. The handler adds the token to Redis's blocklist.
5. The server responds to the client.

The middleware order matters. If `userAuth` rejects the request, the logout handler will not run.

### 5.2 `const { token } = req.cookies`

This extracts the cookie named `token`.

It is equivalent to:

```
const token = req.cookies.token;
```

For `req.cookies` to work, your Express application normally needs:

```
const cookieParser = require("cookie-parser");

app.use(cookieParser());
```

Without the cookie-parsing middleware, `req.cookies` may be unavailable.

### 5.3 `const payload = jwt.decode(token)`

This decodes the JWT payload.

A payload might contain:

```
{
  "userId": "123",
  "iat": 1792870000,
  "exp": 1792870900
}
```

- `userId` identifies the user.
- `iat` is the issued-at timestamp.
- `exp` is the expiration timestamp.

Important security distinction: `jwt.decode()` does not verify the token's signature. It only decodes its contents.

If the application uses `userAuth` to verify the token before the logout handler runs, that may establish the required authentication check. However, the handler should not independently trust an unverified `decode()` result.

In security-sensitive code, use a verified payload or verify the token with `jwt.verify()` before trusting its expiration claim.

### 5.4 `redisClient.set(...)`

```
await redisClient.set(`token:${token}`, "Blocked");
```

This stores an entry in Redis.

For a token such as `abc123`, the key becomes:

```
token:abc123
```

Its value is:

```
Blocked
```

The `token:` prefix is a naming convention that helps distinguish token-related keys from other Redis keys.

### 5.5 `redisClient.expireAt(...)`

```
await redisClient.expireAt(
  `token:${token}`,
  payload.exp
);
```

This sets the key's expiration to the token's expiration time.

For example, if the JWT expires at 11:00 AM, Redis should remove the blocklist entry at approximately that time.

The reason is simple: after 11:00 AM, the JWT should no longer be accepted by a correctly configured authentication system.

Do not confuse these two values:

```
// Relative duration: seconds from now
await redisClient.expire(key, 600);

// Absolute time: Unix timestamp in seconds
await redisClient.expireAt(key, payload.exp);
```

Using a JWT's `exp` with `expireAt()` is appropriate because `exp` is an absolute Unix timestamp in seconds.

### 5.6 Why does the code need `await`?

Redis operations are asynchronous in Node.js.

```
await redisClient.set(key, "Blocked");
```

The `await` tells JavaScript to wait for the operation to finish before continuing inside the async function.

Without it, the server could respond before the Redis operation has completed, depending on the rest of the code. For a security-critical logout operation, the application should not report successful revocation until the revocation entry has been written successfully.

## 6. Checking whether a user is blocked

Storing a token in Redis is only half of the solution. The authentication middleware must check Redis whenever the token is used to access a protected endpoint.

Your lecture gives this logic:

```
const isBlocked = await redisClient.exists(`token:${token}`);

if (isBlocked) {
  throw new Error("User is blocked!");
}

req.result = result;
```

Let's examine it.

### 6.1 What does `isBlocked` mean?

```
const isBlocked = await redisClient.exists(`token:${token}`);
```

This asks Redis whether a key exists for the presented token.

- If Redis returns `1`, the key exists, meaning the token has been revoked.
- If Redis returns `0`, the key does not exist, meaning it is not on this blocklist.

A missing key does not prove that a token is valid. The application must also verify the JWT's signature, expiration, and other relevant claims.

### 6.2 What happens if the token is blocked?

```
if (isBlocked) {
  throw new Error("User is blocked!");
}
```

The middleware rejects the request instead of allowing it to access protected data.

Throwing an error is one possible approach, provided the application's error-handling middleware correctly converts it into an HTTP error response. Another clear approach is to return a `401 Unauthorized` response directly.

### 6.3 What is `req.result = result`?

Express provides a request object, `req`, that middleware and route handlers can use to pass data to later stages of the request.

For example:

```
req.result = result;
```

This assigns a property named `result` to the request object.

However, in an authentication middleware, a more conventional property is:

```
req.user = decoded;
```

This makes the authenticated user's information available to later handlers:

```
router.get("/profile", userAuth, (req, res) => {
  res.json({
    user: req.user
  });
});
```

Use `req.result` if your application has a specific reason for that property; otherwise, use a name that describes the data being stored.

## 7. Complete authentication middleware example

The following example combines JWT verification, Redis blocklist checking, and attaching the authenticated user's payload to the request.

It assumes the application uses a cookie named `token` and has already connected to Redis.

```
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("./redisClient");

async function userAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please log in"
      });
    }

    // 1. Verify the token's signature and expiry.
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 2. Hash the token to derive its Redis blocklist key.
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const blocklistKey = `token:${tokenHash}`;

    // 3. Check whether the token has been revoked.
    const isBlocked = await redisClient.exists(blocklistKey);

    if (isBlocked) {
      return res.status(401).json({
        message: "Token revoked. Please log in again."
      });
    }

    // 4. Make the verified payload available to later handlers.
    req.user = payload;

    // 5. Continue to the protected route.
    next();
  } catch (err) {
    if (
      err.name === "TokenExpiredError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }

    // Other errors may include Redis connection failures.
    // Let centralized error handling handle them.
    next(err);
  }
}

module.exports = userAuth;
```

Notice that this example uses a hash of the token as the Redis key. This is safer than using the raw bearer token as a key, because it avoids storing the original credential directly in Redis.

If Redis is unavailable, the middleware passes the error to Express's error handler rather than allowing the request to continue without the required blocklist check. Configure the error handler to return a failure response in this situation.

## 8. Improved logout route

Here is a revised version of the lecture's logout handler. It clears the browser cookie, verifies the JWT, and stores a hash of the token in Redis with an absolute expiration time.

```
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("./redisClient");
const userAuth = require("./middleware/userAuth");

const router = express.Router();

router.post("/logout", userAuth, async (req, res, next) => {
  const token = req.cookies?.token;

  // Match the cookie options used when setting the cookie.
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });

  try {
    if (token) {
      // userAuth has already verified the token.
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const blocklistKey = `token:${tokenHash}`;

      const now = Math.floor(Date.now() / 1000);
      const remainingSeconds = payload.exp - now;

      if (remainingSeconds > 0) {
        await redisClient.set(
          blocklistKey,
          "Blocked",
          { EXAT: payload.exp }
        );
      }
    }

    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (err) {
    // Do not claim that revocation succeeded if Redis failed.
    next(err);
  }
});

module.exports = router;
```

This example assumes the cookie is configured with the same path and other attributes when it is initially created. If you used a custom domain or path, match those options when clearing it.

There is also an architectural detail to consider: because this route uses `userAuth`, a missing or expired token may be rejected before the logout handler executes. That is acceptable for some applications, but a user-friendly logout endpoint may instead allow a request without a valid token to clear the cookie and return a success response. If you choose that design, ensure it still never reports that a token was revoked unless Redis confirms the write.

### 8.1 Request flow after the changes

Protected API request

Verify JWT

Signature and expiration

Check Redis blocklist

Key exists

Return 401; reject request.

Key absent

Continue to the protected route, assuming all other checks pass.

The essential point is that JWT verification and Redis blocklist checking are separate checks. Neither replaces the other.

## 9. Important security considerations

### 9.1 Why is `jwt.decode()` not enough?

Compare the two methods:

| Method                      | Purpose                                    | Verifies signature? |
| --------------------------- | ------------------------------------------ | ------------------- |
| `jwt.decode(token)`         | Reads the token's payload                  | No                  |
| `jwt.verify(token, secret)` | Verifies the token and checks its validity | Yes                 |

A decoded payload can be modified or fabricated by an attacker. Never use `jwt.decode()` alone to decide whether a user is authenticated or to trust security-sensitive claims.

### 9.2 Why should Redis errors not be ignored?

Suppose the server cannot connect to Redis. If the application assumes that every token is unblocked whenever Redis is unavailable, a revoked token might be accepted.

For protected endpoints that require a revocation check, use a fail-closed approach: reject or temporarily fail the request if the check cannot be completed.

### 9.3 Does logout invalidate all tokens for the user?

Not necessarily.

The example revokes one particular token. If the user has logged in on a laptop, a phone, and a tablet, those devices may have different tokens.

To log out all sessions, an application needs a broader session-revocation strategy, such as maintaining server-side session records, tracking token identifiers, or using a user-level token version checked during authentication.

### 9.4 Why use a token hash for the Redis key?

Using the raw JWT as a key can expose the bearer credential to anyone who can inspect Redis keys or logs.

A SHA-256 hash provides a deterministic identifier for the token without storing the original token in the blocklist:

```
const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
```

The authentication middleware and logout handler must calculate the hash in exactly the same way.

## 10. Common mistakes and their corrections

| Mistake                                           | Correct approach                                                              |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| Using `jwt.decode()` as authentication            | Use `jwt.verify()` with the correct secret or public key                      |
| Storing a blocked token without expiration        | Set an expiry based on the token's remaining lifetime                         |
| Confusing `EXPIRE` with `EXPIREAT`                | `EXPIRE` uses a duration; `EXPIREAT` uses an absolute Unix timestamp          |
| Forgetting `cookie-parser`                        | Add `app.use(cookieParser())` before routes that read cookies                 |
| Forgetting the Redis blocklist check              | Check Redis in authentication middleware                                      |
| Clearing a cookie but not revoking a copied token | Clear the cookie and revoke the token server-side                             |
| Ignoring Redis errors                             | Fail safely when the revocation check is required                             |
| Using the raw token as a Redis key                | Consider hashing the token before constructing the key                        |
| Assuming one token represents every login         | Design explicit session or token revocation if all devices must be logged out |

## 11. Interview questions

1\. Why does Redis use keys and values?

Keys provide direct identifiers for retrieving and modifying associated data efficiently. This is one reason Redis is well suited to fast lookups.

2\. What is the purpose of `redisClient.set()`?

It stores a value associated with a key. For example, `SET token:abc Blocked` records that a token has been revoked.

3\. What does `redisClient.exists()` return?

It returns a number indicating whether the key exists: `1` if it exists and `0` if it does not.

4\. What is the difference between `EXPIRE` and `EXPIREAT`?

`EXPIRE` specifies how many seconds a key should remain available. `EXPIREAT` specifies an absolute Unix timestamp in seconds.

5\. Why use `jwt.verify()` instead of `jwt.decode()`?

`jwt.verify()` checks the token's signature and validity, while `jwt.decode()` merely reads its contents.

6\. Why must middleware check the Redis blocklist?

Because storing a revoked token in Redis does not automatically invalidate it. Middleware must check the blocklist before allowing protected requests.

7\. Why should a revoked-token entry expire at the JWT's expiration time?

After the JWT expires, a properly configured server rejects it anyway. Expiring the Redis entry avoids retaining unnecessary data.

8\. What is the purpose of `req.user = payload`?

It makes the verified JWT payload available to later middleware and route handlers during the same request.

## 12. Final revision summary

- Redis stores data using keys and values, which enables efficient retrieval.
- Node.js can communicate with Redis using the `redis` npm package.
- `SET` stores data, `GET` retrieves data, `EXISTS` checks for a key, and `EXPIRE` or `EXPIREAT` controls its lifetime.
- During logout, the server can add the current token to a Redis blocklist and clear the browser cookie.
- Authentication middleware must verify the JWT and check the blocklist before granting access.
- A JWT's `exp` claim uses Unix time in seconds, which is suitable for Redis `EXPIREAT` or `EXAT`.
- `jwt.decode()` does not verify the signature; use `jwt.verify()` for authentication.
- Redis errors must be handled safely when access control depends on the blocklist.

The core idea of Lecture 24: Redis provides a fast, shared mechanism for recording that a token has been revoked. The logout route writes the revocation entry, and the authentication middleware checks that entry before granting access.
