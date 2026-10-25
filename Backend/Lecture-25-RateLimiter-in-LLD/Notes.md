Make comprehensive notes using the below hints:

Lecture 25 RateLimiter in LLD

What is Rate Limiter and what is the need of using Rate Limiter?
=> It is limiting the user to request the server - to protect the server getting down.
=> We have to keep our APIs secured.

1. Token Bucket Algorithm - Let's say the bucket consists of 5 tokens. Each time the user requests to the server so he has to get a token from the bucket. After five requests, the bucket is empty and hence the user will be unable to request to the server. => What are the problems with this Algorithm and why did it fail?
   => If a user gets all the tokens to the server so the other users will be unable to request to the server and hence other users will not be able because of this one user. simply a hacker can get all the buckets.

2. So we can set a limit for individual user by keeping his record. But here is the problem that how can we make sure that the same user is requesting? We can track and store his IP Address which is unique and hence limit him from making requests greater than the set ones. => Fixed Window Algorithm - but there is a also a problem with this Algorithm -> If a user has let's say 60 requests and at 12 pm he makes a request and then make 59 requests at 12:59 and when it is 1 AM so now he has another 60 requests and in the first minute, he makes 60 requests so total in 2 minutes he made 119 requests which is not healthy for the server. So now this problem is solved by the "Sliding Window Algorithm"

3. Sliding Window Algorithm - the window having requests slides along the time.

# Lecture 25: Rate Limiter in Low-Level Design (LLD)

## 1. What is a Rate Limiter?

A Rate Limiter is a mechanism that controls how many requests a user, client, or application can make to a server within a specified period.

For example, an API might allow a user to make only 60 requests per minute.

- Requests 1–60 are allowed.
- Request 61 is rejected or delayed until the user is allowed to make more requests.
- The limit resets or replenishes according to the algorithm being used.

A rate limiter is an important part of backend system design because APIs must handle incoming requests without allowing one client to consume all the available resources.

### 1.1 Real-life example

Imagine a ticket counter that can serve only a limited number of people per minute.

If one person repeatedly joins the counter and consumes all its capacity, other people cannot get served. The counter needs a rule that limits how frequently each person can use the service.

An API rate limiter applies a similar rule to requests.

Incoming API requests

Users, mobile apps, websites, bots

Rate Limiter

Checks the client's request allowance

Allowed

Request continues to the API.

Rate limited

Request is rejected or delayed.

### 1.2 Why do we need a Rate Limiter?

Rate limiting helps solve several real-world backend problems.

1\. Protect the server from overload

Every request consumes resources, such as CPU time, memory, database connections, and network bandwidth. Too many requests can overwhelm the application.

2\. Reduce abuse and automated attacks

A bot may repeatedly call a login endpoint, search endpoint, or expensive API. Rate limiting can restrict how quickly these requests are made.

3\. Improve fairness

A single user should not be able to consume all the capacity available to other users.

4\. Control API costs

Some API operations trigger paid third-party services, AI model calls, SMS messages, or other expensive operations. Limiting requests helps control usage.

5\. Protect sensitive endpoints

Login, password reset, OTP verification, and account creation endpoints are common candidates for rate limiting.

6\. Improve service stability

By controlling incoming traffic, the application can maintain more predictable performance during sudden spikes.

A rate limiter does not guarantee that a server can never go down. It is one layer of protection alongside monitoring, caching, capacity planning, queues, and other defensive measures.

## 2. Important terms before studying the algorithms

| Term                     | Meaning                                                 | Example                                    |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------ |
| Request                  | An operation sent to an API                             | `GET /products`                            |
| Client                   | The application or entity sending requests              | Browser or mobile app                      |
| Rate limit               | Maximum permitted request rate                          | 60 requests per minute                     |
| Time window              | Period over which requests are counted or controlled    | 1 minute                                   |
| Request quota            | The available number of requests                        | 60 requests                                |
| Rejected request         | A request that exceeds the permitted limit              | HTTP `429`                                 |
| Client identifier        | Value used to distinguish clients                       | User ID or IP address                      |
| Burst                    | A short period of unusually high traffic                | 20 requests arriving almost simultaneously |
| Distributed rate limiter | A limiter whose state is shared across multiple servers | Several Node.js instances using Redis      |

### 2.1 What happens when the limit is exceeded?

A common response is:

```
HTTP/1.1 429 Too Many Requests
```

The response may include a message and a `Retry-After` header indicating when the client can try again.

For example:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 10
Content-Type: application/json
```

```
{
  "message": "Too many requests. Please try again later."
}
```

The `Retry-After` value is illustrative; a real application should calculate it based on the limiter's state.

# 3. Token Bucket Algorithm

The Token Bucket algorithm controls request rates using a bucket that contains tokens.

A request must obtain a token before it can proceed. If a token is available, the request is allowed and one token is consumed. If the bucket is empty, the request is rejected or delayed.

## 3.1 How does Token Bucket work?

Suppose the bucket has a capacity of five tokens.

- Initially, the bucket contains five tokens.
- Every accepted request consumes one token.
- After five requests, the bucket becomes empty.
- Further requests cannot proceed until tokens become available again.

Token Bucket simulation

Available tokens

## 5 / 5

Available

Available

Available

Available

Available

Send requestReset bucket

Allowed requests

## 0

Rejected attempts

## 0

This simplified demonstration does not refill tokens automatically. Real Token Bucket implementations replenish tokens over time.

## 3.2 How does the bucket refill?

A real Token Bucket algorithm usually replenishes tokens at a configured rate.

For example:

- Maximum bucket capacity: 5 tokens.
- Refill rate: 1 token every 10 seconds.
- Each request consumes 1 token.

If the user empties the bucket, they can gradually make additional requests as tokens are replenished.

The bucket's capacity controls the maximum burst size, while the refill rate controls the long-term average request rate.

This is an important distinction: Token Bucket does not necessarily mean that the user can make only five requests forever. It means that requests are governed by available tokens and the refill policy.

## 3.3 Advantages of Token Bucket

- Allows controlled bursts of traffic.
- Limits the long-term request rate.
- Is efficient to implement.
- Works well for APIs where occasional bursts are acceptable.
- Can be applied to individual users, API keys, IP addresses, or other client identifiers.

## 3.4 What is the problem with Token Bucket?

Your lecture raises an important fairness concern: if the bucket is shared by every user, one user may consume all five tokens.

For example:

| Request | User   | Shared tokens before request | Result   |
| ------- | ------ | ---------------------------- | -------- |
| 1       | User A | 5                            | Allowed  |
| 2       | User A | 4                            | Allowed  |
| 3       | User A | 3                            | Allowed  |
| 4       | User A | 2                            | Allowed  |
| 5       | User A | 1                            | Allowed  |
| 6       | User B | 0                            | Rejected |

User A consumed all the available capacity, leaving User B unable to make a request.

This can cause unfairness if the application has one global bucket and no other controls.

### Does Token Bucket itself fail?

No. The algorithm is not inherently flawed. The issue is how the bucket is assigned and shared.

A common solution is to maintain a separate bucket for each client:

```
user:101 → bucket with its own tokens
user:102 → bucket with its own tokens
user:103 → bucket with its own tokens
```

Now, one user cannot consume another user's entire allowance.

However, per-user buckets alone do not prevent all attacks. A malicious client may create many accounts or send requests from many IP addresses. Applications may therefore need multiple limits, such as per-user limits, per-IP limits, and a global service limit.

## 3.5 When should you use Token Bucket?

Token Bucket is useful when an API should allow short bursts while keeping the average request rate under control.

Examples include:

- General API requests.
- Upload endpoints with reasonable burst allowances.
- Services where users may make several requests quickly and then remain idle.
- Distributed systems that need efficient request-rate control.

# 4. Identifying the user making requests

Before exploring the Fixed Window and Sliding Window algorithms, we need to answer an important question:

How does the server know which client is making a request?

A rate limiter needs a way to group requests so it can count them for the correct client.

## 4.1 Using an IP address

An IP address identifies a network endpoint from which the server receives a request.

For example:

```
192.168.1.10 → 20 requests
192.168.1.11 → 45 requests
192.168.1.12 → 8 requests
```

If the limit is 60 requests per minute, the server can track the number of requests associated with each IP address.

However, an IP address is not a perfect identifier for a person or user.

- Several users may share one public IP address, such as users in a university or office.
- A user may have different IP addresses when switching networks.
- Attackers may distribute requests across multiple IP addresses.
- Reverse proxies may cause the application to see the proxy's address instead of the original client's address.

Therefore, IP-based rate limiting is useful, but applications should not assume that one IP address always represents one individual.

## 4.2 Using a user ID

If a user has authenticated, the application can apply limits based on their verified user ID.

For example:

```
user:101 → 60 requests per minute
user:102 → 60 requests per minute
user:103 → 60 requests per minute
```

This is usually more suitable for enforcing a per-account quota.

However, a user ID is not available before authentication unless the application has another trustworthy identifier. Login and registration endpoints often need IP-based or other pre-authentication limits.

## 4.3 Using an API key

For developer-facing APIs, the application can identify clients through API keys.

For example:

```
api-key:company-A → 10,000 requests per day
api-key:company-B → 50,000 requests per day
```

The server should validate the API key before applying the corresponding quota.

## 4.4 Which identifier should you use?

| Endpoint                       | Possible identifier                                  |
| ------------------------------ | ---------------------------------------------------- |
| Public search endpoint         | IP address, possibly combined with other signals     |
| Authenticated profile endpoint | User ID                                              |
| Developer API                  | API key or client ID                                 |
| Login endpoint                 | IP address plus account-oriented controls            |
| Expensive AI endpoint          | User ID, API key, and possibly a global budget limit |

A robust application may enforce several limits simultaneously. For example, an authenticated request might need to pass both the user's rate limit and a global service limit.

# 5. Fixed Window Algorithm

The Fixed Window algorithm counts requests during predefined time intervals.

For example, a limit might be 60 requests per minute.

The time is divided into fixed intervals:

- 12:00:00–12:00:59
- 12:01:00–12:01:59
- 12:02:00–12:02:59

Each client gets a request counter for each interval. When the interval changes, the counter for the new interval starts at zero.

## 5.1 How does Fixed Window work?

Suppose the limit is 5 requests per minute.

| Time     | Request count in current window | Result   |
| -------- | ------------------------------- | -------- |
| 12:00:05 | 1                               | Allowed  |
| 12:00:10 | 2                               | Allowed  |
| 12:00:15 | 3                               | Allowed  |
| 12:00:20 | 4                               | Allowed  |
| 12:00:25 | 5                               | Allowed  |
| 12:00:30 | 6                               | Rejected |
| 12:01:00 | 1                               | Allowed  |

At 12:01:00, a new fixed window begins, so the new counter starts at one when the next request arrives.

## 5.2 Why does the Fixed Window algorithm have a problem?

The main weakness is the boundary burst problem.

Suppose the limit is 60 requests per minute.

The application uses these fixed windows:

- 12:00:00–12:00:59
- 12:01:00–12:01:59

A user can send 60 requests near the end of the first window, then another 60 requests immediately after the second window starts.

Boundary burst example

First window

### 60 requests

12:00:59 — near the end of the minute

Second window

### 60 requests

12:01:00 — immediately after the window resets

Total in roughly 2 seconds

# 120 requests

The application allowed 60 requests in each valid window, so it followed the configured rule. Nevertheless, the server may receive 120 requests within a very short interval.

This is not a coding error. It is a limitation of fixed time boundaries.

Also, the example in the original lecture mentions 59 requests at 12:59 and another 60 at 1:00. The key principle is the same: requests near opposite sides of a window boundary can happen very close together. The actual number of requests depends on the exact limit and the window's boundaries.

## 5.3 How is Fixed Window implemented?

A simple implementation maintains a counter for each client and each time window.

Conceptually:

```
Key: rate-limit:user:101:12:00
Value: 5
```

If the request limit is 5:

1. Read or increment the counter for the current window.
2. Allow the request if the count is within the limit.
3. Reject the request if the count exceeds the limit.
4. Expire the counter when the window ends.

Redis is useful for this because it supports counters and automatic key expiration.

### Advantages of Fixed Window

- Simple to understand.
- Easy to implement.
- Low storage requirements.
- Efficient for large numbers of clients.
- Suitable when occasional bursts near window boundaries are acceptable.

### Disadvantages of Fixed Window

- Allows boundary bursts.
- Does not precisely limit requests over every possible rolling interval.
- Counter updates must be coordinated correctly in distributed systems.

### When should you use Fixed Window?

Use it when simplicity and low overhead are important and a burst at the boundary is acceptable.

Examples include basic usage quotas, some daily request limits, and simple internal API controls.

# 6. Sliding Window Algorithm

The Sliding Window algorithm addresses the boundary burst problem by considering a moving time interval rather than resetting all requests at a fixed clock boundary.

For example, suppose an API allows 60 requests in any 60-second period.

Instead of asking only how many requests happened during the current calendar minute, the application asks:

> How many requests has this client made during the last 60 seconds?

This window moves forward as time passes.

## 6.1 How does the window slide?

Suppose the current time is 12:01:00 and the window size is 60 seconds.

The application considers requests made from approximately 12:00:00 through 12:01:00.

At 12:01:10, the window moves forward. It now considers approximately 12:00:10 through 12:01:10.

Older requests gradually fall outside the window, allowing new requests as capacity becomes available.

Sliding Window timeline

Illustrative 60-second window

At 12:01:00

12:00:00–12:01:00

At 12:01:10

12:00:10–12:01:10

Teal blocks represent portions of the request history included in the example window; grey blocks represent time outside that window. This is a conceptual illustration, not a request counter.

Unlike Fixed Window, the algorithm does not grant a completely fresh quota just because the clock reaches a new minute.

## 6.2 Sliding Window Log

One implementation stores the timestamps of individual requests.

Suppose the limit is five requests per 60 seconds.

The application stores the request timestamps:

```
12:00:10
12:00:15
12:00:20
12:00:25
12:00:30
```

When a new request arrives at 12:00:35, the application:

1. Removes timestamps older than the last 60 seconds.
2. Counts the remaining timestamps.
3. Rejects the request if the count has reached five.
4. Otherwise, records the new timestamp and allows the request.

This accurately enforces a limit of five requests within a rolling 60-second interval, assuming the check-and-record operation is performed atomically.

### Example

| Current time | Requests in previous 60 seconds | Result                 |
| ------------ | ------------------------------- | ---------------------- |
| 12:00:10     | 0                               | Allowed                |
| 12:00:15     | 1                               | Allowed                |
| 12:00:20     | 2                               | Allowed                |
| 12:00:25     | 3                               | Allowed                |
| 12:00:30     | 4                               | Allowed                |
| 12:00:35     | 5                               | Rejected               |
| 12:01:11     | 0 or fewer than 5               | Allowed if under limit |

At 12:01:11, the earlier requests are outside the previous 60-second period, so the application may accept a new request.

The exact boundary rule—whether a request exactly 60 seconds old is counted—must be defined consistently.

### Advantages of Sliding Window Log

- Provides accurate rolling-window enforcement.
- Prevents the fixed-window boundary burst problem.
- Works well when precise request limits are required.

### Disadvantages

- Must track individual request timestamps.
- Uses more storage than a single counter.
- Requires removing old timestamps.
- Needs atomic processing when multiple requests arrive simultaneously.

This algorithm is accurate, but it can become expensive if millions of clients make requests frequently.

## 7. Sliding Window Counter

Another approach is the Sliding Window Counter, which approximates the rolling request count using two fixed-window counters.

It tracks:

- The request count in the current window.
- The request count in the previous window.
- The proportion of the previous window that overlaps the rolling interval.

This uses less storage than keeping every individual timestamp.

### 7.1 Example

Suppose the limit is 100 requests per minute.

At the current moment:

- Previous window count: 80 requests.
- Current window count: 20 requests.
- 25% of the previous window remains relevant to the rolling interval.

The estimated request count is:

\\[ \text{Estimated count} = \text{Current count} + (\text{Previous count}\times\text{Overlap fraction}) \\]

Substituting the example:

\\[ 20+(80\times0.25)=40 \\]

The estimated count is 40 requests.

Because the estimate is below the limit of 100, the limiter may allow the next request.

This algorithm is efficient, but it is an approximation: it does not know the exact timestamp of every previous request.

### Advantages

- Uses less memory than Sliding Window Log.
- Reduces boundary burst problems.
- Works well for high-volume APIs.
- Can be implemented with counters and atomic updates in Redis.

### Disadvantages

- The count is estimated, not exact.
- Its accuracy depends on the traffic distribution and window configuration.
- It requires careful handling of concurrent requests.

## 8. Comparing the three algorithms

| Feature                   | Token Bucket                      | Fixed Window                              | Sliding Window                                        |
| ------------------------- | --------------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| Main mechanism            | Consume replenished tokens        | Count requests in fixed intervals         | Track or estimate requests in a moving interval       |
| Allows bursts?            | Yes, up to bucket capacity        | Yes, especially at boundaries             | Depends on variant and configuration                  |
| Boundary burst problem    | Not in the same fixed-window form | Yes                                       | Greatly reduced or eliminated by appropriate variants |
| Storage                   | Small amount of state per bucket  | Usually one counter per client per window | More state for log; modest state for counter          |
| Accuracy                  | Enforces token and refill rules   | Accurate within each fixed window         | Exact with log; approximate with counter              |
| Implementation complexity | Moderate                          | Low                                       | Moderate to high                                      |
| Best suited for           | Controlled bursts                 | Simple quotas                             | Rolling-window limits                                 |

### Which algorithm is best?

There is no universally best algorithm. The correct choice depends on the application's requirements.

- Choose Token Bucket when you want to allow bursts while controlling the long-term rate.
- Choose Fixed Window when simplicity and low storage overhead are priorities.
- Choose Sliding Window Log when accurate rolling-window enforcement is important.
- Choose Sliding Window Counter when you want a more efficient approximation of a rolling-window limit.

A production application may use different algorithms for different endpoints.

# 9. Implementing a Rate Limiter in Node.js and Express

Let's connect the algorithms to a real backend project.

Suppose you have an Express API with this endpoint:

```
app.get("/products", async (req, res) => {
  const products = await Product.find();

  res.json(products);
});
```

Without a rate limiter, a client may repeatedly call this endpoint and cause unnecessary database queries.

We can place a rate limiter before the route's handler so the application checks the request allowance before executing the database query.

## 9.1 Where does the Rate Limiter fit?

Incoming request

Rate-limiting middleware

Identify client and check the request quota

Under limit

Continue to route handler

Over limit

Return HTTP 429

The benefit is that requests rejected by the limiter do not execute the expensive work in the protected route.

## 9.2 Simple Fixed Window implementation with Redis

Redis can store a counter for each client and time window.

For example:

```
rate:192.0.2.10:window-12345 → 12
```

Here:

- `rate:` identifies the rate-limiting data.
- `192.0.2.10` represents the client identifier in this illustrative example.
- `window-12345` represents the current time window.
- `12` is the number of requests counted for that client in that window.

For a real application, you should use a trusted client identifier. Do not assume that an IP address obtained from arbitrary forwarded headers is trustworthy.

### Example implementation

```
const express = require("express");
const { redisClient } = require("./redisClient");

const app = express();

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

async function fixedWindowRateLimiter(req, res, next) {
  try {
    const clientId = req.ip;
    const currentWindow = Math.floor(
      Date.now() / 1000 / WINDOW_SECONDS
    );

    const key = `rate:${clientId}:${currentWindow}`;

    // Increment the counter for this client's current window.
    const count = await redisClient.incr(key);

    // Give the counter an expiration on its first increment.
    if (count === 1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      return res.status(429).json({
        message: "Too many requests. Please try again later."
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

app.get("/products", fixedWindowRateLimiter, (req, res) => {
  res.json({
    message: "Products returned successfully"
  });
});
```

This is an educational Fixed Window example. A production implementation should consider atomic counter-and-expiry handling, distributed concurrency, client identification, and failure behavior.

### How does it work?

1. The middleware identifies the client.
2. It calculates the current fixed time window.
3. It increments the corresponding Redis counter.
4. It assigns the counter an expiration.
5. It rejects requests after the configured maximum.
6. Otherwise, it passes the request to the next middleware or route handler.

Because the key includes the time-window identifier, the next window gets a different counter key.

### Important concurrency detail

The example performs `INCR` and `EXPIRE` as separate commands. If the application crashes or the connection fails between them, a counter may be left without its intended expiry.

A stronger implementation uses a Redis Lua script or another atomic operation to increment the counter and set its expiration together. This matters particularly when the rate limiter is used across multiple application instances.

## 10. Why Redis is useful for distributed Rate Limiting

Consider a backend application with three Node.js servers behind a load balancer.

Load balancer

Distributes requests across servers

Server A

Server B

Server C

Shared Redis

Stores counters and rate-limit state

Suppose the limit is five requests per minute.

If each Node.js server keeps its own local counter, a client could make five requests to each server and potentially get 15 requests in total.

With a shared Redis counter, all three servers check the same state. The request count can be coordinated across the application.

Redis therefore helps solve the shared-state problem in distributed rate limiting.

However, correct distributed enforcement also requires atomic updates. If two requests simultaneously check a counter and then increment it using separate operations, both may incorrectly be allowed. Use atomic operations or an established rate-limiting library that handles these details.

## 11. Using a library instead of implementing everything manually

For Express applications, you can use `express-rate-limit` for straightforward rate limiting.

Install it:

```
npm install express-rate-limit
```

A simple example:

```
const express = require("express");
const { rateLimit } = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", limiter);

app.get("/api/products", (req, res) => {
  res.json({
    message: "Products returned successfully"
  });
});

app.listen(3000);
```

In this example:

- `windowMs` defines a one-minute window.
- `limit` allows five requests per window.
- `standardHeaders` enables standardized rate-limit headers supported by the library.
- `legacyHeaders: false` disables older rate-limit headers.

This basic configuration uses the library's configured store, which is normally in-memory by default. That is acceptable for some single-process development scenarios, but a shared store is generally needed when the application runs across multiple servers.

For a Redis-backed deployment, use a compatible Redis store for the library and configure it according to its documentation.

Design lesson: Understanding the algorithms helps you select and configure a library correctly. It does not mean you must manually implement a complex distributed rate limiter for every project.

# 12. Rate Limiting in Low-Level Design (LLD)

Low-Level Design focuses on how individual components, classes, algorithms, and data structures work together to implement a system.

When designing a Rate Limiter in an interview, you should be able to explain more than just the algorithm. You should explain how the system identifies users, stores counters, handles concurrency, responds to rejected requests, and scales across servers.

## 12.1 Functional requirements

A Rate Limiter should be able to:

1. Identify the client making a request.
2. Define a maximum request count or request rate.
3. Decide whether to allow or reject each request.
4. Track usage during the relevant time interval.
5. Reset or replenish the request allowance.
6. Return a suitable response when the limit is exceeded.

## 12.2 Non-functional requirements

A production Rate Limiter should also consider:

- Low latency: Checking the limit should not add excessive delay.
- Scalability: The system should support many users and requests.
- Concurrency: Simultaneous requests should not bypass the limit.
- Reliability: Failures should be handled deliberately.
- Fairness: One client should not consume all shared capacity.
- Configurability: Different endpoints and users may need different limits.

## 12.3 High-level design

A typical distributed rate-limiting design contains these components:

Client

Browser, mobile app, or API consumer

API gateway or Express middleware

Identifies the client and selects the policy

Rate-limiting algorithm

Token Bucket, Fixed Window, or Sliding Window

Redis

Shared counters, tokens, timestamps, or quotas

Allow

Forward to application

Reject

Return HTTP 429

### Example Redis key design

For a Fixed Window limiter:

```
rate:user:101:window:29881200
rate:user:102:window:29881200
rate:ip:192.0.2.10:window:29881200
```

The key structure separates the client identity and time window. A production system should also distinguish policies when different endpoints have different limits.

For a Token Bucket implementation, the stored state might include:

```
rate:user:101:tokens
rate:user:101:last_refill
```

These values represent the available token count and the last time the bucket was replenished. Their updates must be coordinated atomically.

# 13. Important HTTP behavior

When a request is rejected, a Rate Limiter should communicate the reason clearly.

A common response is:

```
HTTP/1.1 429 Too Many Requests
```

Useful headers may include:

- `Retry-After`: how long the client should wait before retrying.
- `RateLimit-Limit`: the configured request limit, where supported.
- `RateLimit-Remaining`: the remaining request allowance, where supported.
- `RateLimit-Reset`: information about when the limit resets, where supported by the implementation.

Header conventions vary by library and specification, so use the format supported by your chosen implementation.

The client should avoid repeatedly retrying immediately after receiving a `429` response. A retry policy with backoff helps prevent unnecessary additional load.

# 14. Common mistakes in Rate Limiting

| Mistake                                                    | Why it is a problem                                                  | Better approach                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Using one global bucket for all users                      | One client may consume all available capacity                        | Apply per-client limits alongside global limits                |
| Treating an IP address as a unique person                  | Many users may share an IP, and one user may have multiple IPs       | Combine trusted identifiers and appropriate policies           |
| Using only Fixed Window for strict burst control           | Requests can cluster around window boundaries                        | Use Sliding Window or Token Bucket as appropriate              |
| Keeping counters only in local server memory               | Multiple servers may enforce different limits                        | Use shared state such as Redis                                 |
| Updating counters non-atomically                           | Concurrent requests can exceed the intended quota                    | Use atomic Redis operations or a suitable library              |
| Trusting arbitrary forwarded IP headers                    | Clients may spoof those headers                                      | Configure trusted proxies correctly                            |
| Applying the same limit to every endpoint                  | Cheap and expensive operations have different resource costs         | Use endpoint-specific policies                                 |
| Returning a generic server error for every limit violation | Clients cannot distinguish throttling from other failures            | Return HTTP `429` for rate-limit rejection                     |
| Ignoring Redis failures                                    | Limits may be bypassed or legitimate requests may fail unpredictably | Define a deliberate fail-open or fail-closed policy            |
| Assuming rate limiting prevents every attack               | Distributed attacks and other abuse may still succeed                | Combine it with authentication, monitoring, and other controls |

## 15. Interview questions and answers

1\. What is a Rate Limiter?

A Rate Limiter controls how frequently a client can make requests to an API within a defined time interval or under a defined token-replenishment policy.

2\. Why do we need a Rate Limiter?

It helps protect application resources, reduce abuse, improve fairness, and control expensive API usage.

3\. What is the Token Bucket algorithm?

It maintains a bucket of tokens. Each accepted request consumes a token, and tokens replenish over time. The bucket capacity controls bursts, while the refill rate controls the long-term rate.

4\. What is the major weakness of Fixed Window?

Requests can cluster around the boundary between two windows, allowing a client to make many requests in a short period even though each individual window stays within its limit.

5\. How does Sliding Window solve the boundary problem?

It considers a moving time interval, rather than relying solely on fixed clock boundaries. The log variant tracks individual timestamps; the counter variant estimates the rolling count.

6\. What is the difference between Sliding Window Log and Sliding Window Counter?

Sliding Window Log tracks individual request timestamps for accurate rolling-window enforcement. Sliding Window Counter uses aggregated counts to reduce storage and processing costs, at the expense of exactness.

7\. Why is Redis commonly used for Rate Limiting?

Redis provides low-latency access to shared counters and data structures. It can coordinate state across multiple application instances and supports automatic key expiration.

8\. Why is a local counter insufficient for a distributed application?

Each application server may maintain its own independent count. A shared store is needed when the quota must apply across all servers.

9\. What HTTP status code should be returned when a request exceeds the limit?

HTTP `429 Too Many Requests` is the standard status code for rate limiting.

10\. Does Rate Limiting completely prevent denial-of-service attacks?

No. It is one defensive layer. Large distributed attacks may require network-level protection, infrastructure scaling, traffic filtering, and other measures.

## 16. Final revision checklist

### Self-assessment

0 of 10

Explain why an API needs rate limiting.

Explain Token Bucket, including capacity and refill rate.

Explain why a shared bucket can create unfairness.

Explain how a per-user or per-IP limit identifies a client.

Describe the Fixed Window boundary burst problem.

Compare Sliding Window Log and Sliding Window Counter.

Explain why Redis is useful for a distributed limiter.

Explain why counter updates need atomicity.

Describe an HTTP 429 response and Retry-After.

Explain how endpoint-specific limits improve protection.

Reset checklist

Main takeaway: Rate Limiting protects an API by controlling how frequently requests are accepted. Token Bucket is suitable for controlled bursts, Fixed Window is simple but permits boundary bursts, and Sliding Window provides rolling-window control. In a distributed backend, Redis can hold shared rate-limit state so that multiple servers enforce a consistent policy.
