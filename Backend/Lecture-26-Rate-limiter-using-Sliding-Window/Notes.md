# Lecture 26: Rate Limiter Using Sliding Window

Backend Development · Low-Level Design (LLD) · Redis · Node.js

## 1. Understanding the Problem Before Starting

### 1.1 What is a Rate Limiter?

A Rate Limiter is a mechanism that controls how many requests a user or client can send to a server within a specified period.

Its primary purpose is to prevent excessive requests from overwhelming the server and to protect APIs from abuse.

Example: Suppose an API allows a user to make five requests per minute.

- The first five requests are allowed.
- The sixth request is rejected if it arrives before any earlier request expires from the limit's time window.
- Requests become eligible again as the time window moves forward.

### Why do we need it?

- Server protection: Prevents excessive traffic from consuming server resources.
- API security: Reduces certain forms of automated abuse.
- Fair usage: Prevents one user from consuming all available resources.
- Cost control: Helps control usage of expensive operations, such as AI API calls.

### 1.2 The Main Problem: Why Not Use a Normal Rate-Limiting Algorithm?

Before understanding Sliding Window, we need to understand the limitation of the Fixed Window algorithm, a common rate-limiting approach.

Suppose the limit is five requests per minute, and the fixed windows are:

- 10:00:00–10:00:59
- 10:01:00–10:01:59

Imagine a user sends five requests just before the first window ends and another five immediately after the next window begins.

### The boundary problem

First fixed window

10:00:50–10:00:59

1

2

3

4

5

Five requests in the final seconds of the minute.

Second fixed window

10:01:00–10:01:09

1

2

3

4

5

Five more requests immediately after the minute changes.

Result: 10 requests can be accepted within roughly 10–20 seconds, even though the intended limit is five requests per minute.

The fixed-window algorithm has not technically violated its own rule: it accepted five requests in each separate minute. However, it fails to enforce a strict limit over every rolling 60-second period.

The key problem: A fixed window resets its counter at a predetermined boundary, regardless of how recently the requests occurred.

Other rate-limiting algorithms have different trade-offs. For example, a Token Bucket can allow bursts by design, while a Sliding Window can enforce a rolling request limit more precisely.

## 2. How Does the Sliding Window Solve This Problem?

The Sliding Window Log algorithm tracks the timestamps of individual requests rather than relying only on a counter that resets at a fixed boundary.

For every incoming request, the system:

1. Gets the current timestamp.
2. Removes request records older than the permitted time window.
3. Counts the requests remaining in the window.
4. Rejects the request if the limit has already been reached.
5. Otherwise, records the new request and allows it.

Instead of dividing time into fixed minutes, the algorithm considers the most recent 60 seconds relative to the current request.

### Rolling 60-second window

Example: Limit = 5 requests per 60 seconds

Older than 60 seconds

Expired

Removed from the request log

Current rolling window

Counted

1

2

3

4

5

All five requests still fall inside the last 60 seconds. A sixth request is rejected.

### Step-by-step example

Assume the limit is three requests per 10 seconds.

| Time     | Action    | Requests in the last 10 seconds | Decision |
| -------- | --------- | ------------------------------- | -------- |
| 10:00:01 | Request A | 1                               | Allow    |
| 10:00:03 | Request B | 2                               | Allow    |
| 10:00:05 | Request C | 3                               | Allow    |
| 10:00:07 | Request D | 3 existing                      | Reject   |
| 10:00:12 | Request E | A has expired                   | Allow    |

The exact treatment of a request at the window boundary depends on whether the implementation uses an inclusive or exclusive cutoff. A common definition counts requests with timestamps greater than `now - windowSize`.

Important distinction: Sliding Window Log is accurate for a rolling limit but stores individual request records. This creates additional memory and processing costs compared with a simple fixed-window counter.

## 3. Implementing Sliding Window Using Redis Sorted Sets

### 3.1 Why do we use Redis?

Redis is an in-memory data store that supports data structures such as strings, lists, hashes, and sorted sets.

For a rate limiter, Redis is useful because:

- It provides fast read and write operations.
- Multiple backend server instances can share the same request history.
- It supports automatic key expiration.
- Its sorted sets allow us to organize request records by timestamp.

### 3.2 What is a Redis Sorted Set?

A Sorted Set (ZSET) stores unique members, each associated with a numerical score. Redis automatically orders the members by their scores.

For a Sliding Window Rate Limiter:

- Score: The timestamp when the request occurred.
- Member: A unique identifier for that request.

Example:

| Member  | Score (timestamp in ms) |
| ------- | ----------------------- |
| `req-A` | 1793220001000           |
| `req-B` | 1793220003000           |
| `req-C` | 1793220005000           |

The score allows us to remove old requests efficiently using their timestamps.

### 3.3 Important: Why Must Each Request Have a Unique Member?

Redis sorted sets enforce uniqueness on the member, not the score.

This distinction is important:

- Two members can have the same score.
- Two requests cannot coexist as separate entries if they use the same member.
- Adding an existing member with `ZADD` updates that member's score instead of creating another entry.

Consider this example:

```
ZADD requests 1000 request-1
ZADD requests 2000 request-1
```

The second command updates `request-1` to score `2000`. The sorted set contains only one member, so two requests are not counted.

This causes a serious rate-limiting bug: if multiple requests use the same member, the request count becomes inaccurate.

Solution: Generate a unique member for every request.

### 3.4 Using `currentTime + Math.random()`

One possible approach is to combine the current timestamp with a random value.

```
const currentTime = Date.now();

const uniqueMember = `${currentTime}-${Math.random()}`;
```

Example members:

```
1793220001000-0.123456
1793220001000-0.765432
1793220001001-0.456789
```

Even if two requests arrive during the same millisecond, their random suffixes will usually differ.

However, `Math.random()` does not guarantee uniqueness. It can theoretically generate the same value twice, so it is not the strongest choice for generating unique request identifiers.

### 3.5 Using Node.js `crypto` for Unique Request IDs

Node.js provides a built-in `crypto` module that offers cryptographically strong random values.

A simple approach is `crypto.randomUUID()`.

```
const { randomUUID } = require("node:crypto");

const currentTime = Date.now();

const uniqueMember = `${currentTime}-${randomUUID()}`;

console.log(uniqueMember);
```

Possible output:

```
1793220001000-550e8400-e29b-41d4-a716-446655440000
```

The UUID makes accidental member collisions extraordinarily unlikely.

Why prefer `crypto.randomUUID()`?

- It produces a UUID using cryptographically strong randomness.
- It is suitable for generating request identifiers.
- It avoids relying on `Math.random()` for uniqueness.
- It does not require installing an external npm package.

Note that cryptographic randomness is not a mathematical guarantee of uniqueness; it makes collisions extremely unlikely.

Real-life analogy: Imagine a library recording book returns. If every return is recorded under the same receipt number, a new return might overwrite the previous record. Each return needs its own receipt number, even when several returns occur at the same time.

## 4. The Complete Sliding Window Algorithm

Suppose our API allows five requests per minute.

Let:

- `limit = 5`
- `windowMs = 60,000`
- `now = Date.now()`
- `cutoff = now - windowMs`

For each incoming request, Redis performs these operations:

1\. Receive request

Generate the current timestamp and unique ID.

2\. Remove expired requests

Use `ZREMRANGEBYSCORE` to delete records at or before the cutoff.

3\. Count remaining requests

Use `ZCARD` to count the sorted-set members.

4\. Is the count below five?

Yes: Allow

Add the request.

No: Reject

Return HTTP 429.

### Redis commands used

| Command            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `ZADD`             | Adds a request with its timestamp as the score.     |
| `ZREMRANGEBYSCORE` | Removes requests outside the current window.        |
| `ZCARD`            | Counts the remaining request records.               |
| `PEXPIRE`          | Automatically expires the Redis key after a period. |

### 4.1 Understanding the Redis Commands

Remove old requests:

```
ZREMRANGEBYSCORE requests -inf 1793219940000
```

This removes members whose scores are less than or equal to the specified cutoff.

Count active requests:

```
ZCARD requests
```

If the result is `5`, the limit has already been reached.

Add a new request:

```
ZADD requests 1793220001000 request-550e8400
```

The timestamp is the score; the request ID is the member.

Set an expiration:

```
PEXPIRE requests 60000
```

This sets the key's expiration to 60 seconds from the time the command runs. In a production implementation, refresh the expiration when adding an allowed request so that stale keys are eventually cleaned up.

## 5. Practical Node.js and Redis Implementation

The following example demonstrates a Sliding Window Rate Limiter using Node.js, Express, and the Redis client.

Install the dependencies:

```
npm install express redis
```

### 5.1 Why use a Redis Lua script?

A naive implementation executes the Redis commands separately:

1. Remove expired records.
2. Count requests.
3. Check the limit.
4. Add the new request.

Suppose two requests arrive simultaneously when the count is four out of five. Both may read the count as four and both may be allowed, producing six requests.

This is a race condition.

Redis Lua scripts solve this problem by executing the operations atomically: another Redis command cannot interleave with the script while it runs.

### 5.2 Complete example

```
const express = require("express");
const { createClient } = require("redis");
const { randomUUID } = require("node:crypto");

const app = express();

const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

const WINDOW_MS = 60_000;
const LIMIT = 5;

const slidingWindowScript = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local windowMs = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local requestId = ARGV[4]

  local cutoff = now - windowMs

  redis.call(
    "ZREMRANGEBYSCORE",
    key,
    "-inf",
    cutoff
  )

  local count = redis.call("ZCARD", key)

  if count >= limit then
    return 0
  end

  redis.call("ZADD", key, now, requestId)
  redis.call("PEXPIRE", key, windowMs)

  return 1
`;

async function rateLimiter(req, res, next) {
  try {
    const now = Date.now();

    // Use an authenticated user ID in real applications.
    // IP is a fallback for this demonstration.
    const clientId = req.ip;

    const key = `rate-limit:${clientId}`;

    const requestId = `${now}-${randomUUID()}`;

    const allowed = await redis.eval(slidingWindowScript, {
      keys: [key],
      arguments: [
        String(now),
        String(WINDOW_MS),
        String(LIMIT),
        requestId,
      ],
    });

    if (allowed === 0) {
      return res.status(429).json({
        message: "Too many requests. Try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);

    // Example policy: fail closed when Redis is unavailable.
    return res.status(503).json({
      message: "Service temporarily unavailable.",
    });
  }
}

app.get("/api/data", rateLimiter, (req, res) => {
  res.json({
    message: "Request allowed",
    data: "Your API response",
  });
});

async function startServer() {
  await redis.connect();

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer().catch(console.error);
```

Assumption: Redis is running locally on port 6379. Configure the connection and the trusted client-IP strategy for your actual deployment.

### 5.3 Understanding the implementation

- `Date.now()` provides the current time in milliseconds.
- `randomUUID()` gives every request a distinct member.
- `ZREMRANGEBYSCORE` removes expired request records.
- `ZCARD` counts requests still inside the window.
- `ZADD` records the allowed request.
- `PEXPIRE` cleans up the Redis key after inactivity.
- `redis.eval()` executes the complete check-and-update process atomically.
- HTTP `429 Too Many Requests` communicates that the client has exceeded the limit.

The code intentionally uses `req.ip` for demonstration. In a real deployment, configure Express proxy trust carefully; otherwise, client IPs may be misidentified or spoofed. Authenticated user IDs are often preferable for per-user limits.

The example also uses a fail-closed policy: if Redis fails, the request is rejected with HTTP 503. Production systems must choose their Redis-failure policy according to the security and availability requirements of the API.

## 6. Important Technical Details and Common Mistakes

### Mistake 1: Assuming sorted-set scores must be unique

Incorrect understanding: Redis cannot store two entries with the same score.

Correct understanding: Scores may be identical; members must be unique.

For example, these two records can coexist:

```
ZADD requests 1000 request-A
ZADD requests 1000 request-B
```

Both requests are counted.

### Mistake 2: Using `Math.random()` as a guaranteed unique ID

`Math.random()` generates pseudorandom numbers but does not guarantee that a number will never repeat.

Prefer `crypto.randomUUID()` for request identifiers.

### Mistake 3: Checking the limit without atomicity

Separate count and insertion commands can allow simultaneous requests to exceed the configured limit.

Use a Lua script or another suitable atomic Redis mechanism.

### Mistake 4: Forgetting to remove expired requests

If old timestamps are never removed, `ZCARD` will count historical requests that should no longer affect the current window.

### Mistake 5: Confusing the score with the member

In this design:

```
Score  = Request timestamp
Member = Unique request identifier
```

The score enables time-based cleanup; the member distinguishes one request from another.

### Mistake 6: Assuming Redis expiration alone implements Sliding Window

`PEXPIRE` expires the entire key. It does not remove individual outdated requests as the window moves.

The sliding-window behavior comes from removing outdated members using `ZREMRANGEBYSCORE`.

## 7. Complexity Analysis

Let \\(n\\) be the number of requests currently stored for a client within the window.

| Operation                         | Typical complexity                                       |
| --------------------------------- | -------------------------------------------------------- |
| Remove expired sorted-set members | \\(O(\log n + m)\\), where \\(m\\) is the number removed |
| Count members using `ZCARD`       | \\(O(1)\\)                                               |
| Add a request using `ZADD`        | \\(O(\log n)\\)                                          |
| Store request history             | \\(O(n)\\) per client                                    |

Trade-off: Sliding Window Log provides accurate rolling-window enforcement, but its memory usage grows with the number of requests in the window. For very high traffic, a Sliding Window Counter can reduce memory usage by approximating the rolling count using adjacent fixed windows.

## 8. Interview Questions and Answers

Q1. What problem does Sliding Window solve?

It avoids the boundary burst problem of Fixed Window by tracking requests within a rolling time period.

Q2. Why use Redis Sorted Sets?

They associate each request with a timestamp, allowing expired records to be removed efficiently.

Q3. Can Redis Sorted Sets contain duplicate scores?

Yes. Multiple unique members can have the same score.

Q4. What happens if the same member is added twice?

The existing member is updated rather than duplicated.

Q5. Why use `crypto.randomUUID()`?

It generates a unique-looking request identifier using cryptographically strong randomness, making accidental collisions extraordinarily unlikely.

Q6. Why is `ZREMRANGEBYSCORE` needed?

It removes requests that have fallen outside the current rolling time window.

Q7. Why use a Lua script?

It makes the check-and-update sequence atomic, preventing concurrent requests from bypassing the limit through a race condition.

Q8. What HTTP status code should be returned when the rate limit is exceeded?

HTTP `429 Too Many Requests`.

Q9. What is the main disadvantage of Sliding Window Log?

It stores individual request records, increasing memory usage and processing overhead at high traffic volumes.

Q10. Does the timestamp need to be the sorted-set member?

No. The timestamp is the score, while the member should identify the request uniquely.

## 9. Revision Summary

- Problem: Fixed Window can allow bursts across adjacent window boundaries.
- Solution: Sliding Window Log considers requests in a rolling time period.
- Redis structure: Sorted Set (`ZSET`).
- Score: Current timestamp in milliseconds.
- Member: Unique request identifier.
- Unique ID: Prefer `crypto.randomUUID()` over `Math.random()` when generating identifiers.
- Cleanup: `ZREMRANGEBYSCORE`.
- Counting: `ZCARD`.
- Insertion: `ZADD`.
- Expiration: `PEXPIRE`.
- Concurrency protection: Atomic Lua script.
- Rejection status: HTTP 429.

Core concept to remember: A Sliding Window Rate Limiter does not merely count requests in a calendar minute. It tracks requests within a moving time window, removes expired records, and decides whether the next request is allowed.
