# Lecture 21: Refresh Tokens with Middleware

Backend Development · Node.js · Express.js · JWT · Authentication · Security

## 1. What will you learn in this lecture?

By the end of this lecture, you should understand:

- Why access tokens need an expiration time.
- Why a short-lived access token can create a poor user experience.
- What refresh tokens are and how they work.
- The difference between access tokens and refresh tokens.
- What happens when an access token or refresh token expires.
- How token theft can compromise an account.
- Why changing a password should affect existing login sessions.
- How middleware avoids repeating authentication code in every route.
- How to implement a refresh-token flow in an Express application.
- Common misconceptions about refresh tokens and real-world authentication systems.

## 2. The problem: Why do we need refresh tokens?

Imagine you log in to a website, and the server issues an access token that expires after 30 minutes.

You continue reading, studying, or working. After 30 minutes, you try to open your profile, but the token has expired.

The server rejects the request. You must log in again using your email and password.

This creates a problem: security and user experience must be balanced.

- A very long-lived access token makes stolen tokens useful for longer.
- A very short-lived access token may force users to log in too frequently.

Refresh tokens help solve this problem.

### Without refresh tokens

User logs in

Server issues an access token valid for 30 minutes

Access token expires

User must log in again

### With refresh tokens

User logs in

Server issues a short-lived access token and a longer-lived refresh token

Access token expires

Client presents the refresh token to a dedicated endpoint

Server validates the refresh token and issues a new access token

The user can continue using the application without entering their password every 30 minutes.

Important: Refresh tokens are one common solution, not a requirement for every website. Applications may instead use server-side sessions, reauthentication, or other authentication designs.

## 3. What is an access token?

An access token is a credential that a client presents to access protected resources.

In the JWT-based system from Lecture 20, the access token is a signed JWT.

Example:

```
const accessToken = jwt.sign(
  {
    userId: user._id,
    email: user.email
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: "15m"
  }
);
```

Here:

- `userId` identifies the user.
- `email` is a claim about the user.
- `ACCESS_TOKEN_SECRET` is the secret used to sign the token in this example.
- `expiresIn: "15m"` sets the token's lifetime to 15 minutes.

### Why should an access token expire?

Suppose someone steals your access token while it is still valid.

If the server accepts that token, the attacker may be able to use it to access protected resources as you, subject to the token's permissions and the application's security checks.

If the token has a short expiration time, the period during which it can be abused is limited.

However, expiration does not automatically stop a stolen token from being used before it expires. Nor does expiration alone guarantee immediate revocation when you change your password.

That is why access-token expiration and server-side security controls are both important.

## 4. What is a refresh token?

A refresh token is a credential used to obtain a new access token after the current access token expires.

Think of the two tokens as having different jobs:

## Access token

Short-lived credential

Used to access protected API endpoints, such as your profile or course dashboard.

## Refresh token

Longer-lived credential

Used to request a replacement access token when the current one expires.

A refresh token does not normally grant access directly to every protected API. It is sent to a dedicated refresh endpoint, where the server checks whether it is valid and permitted to renew the session.

### Does a refresh token have to be a JWT?

No.

A refresh token can be:

- An opaque, randomly generated string with no readable claims.
- A signed JWT, depending on the system's design.

A common design uses a random refresh token whose hash is stored in a database. This makes it possible to look up, revoke, rotate, and manage refresh-token sessions.

For the approach taught in this lecture, we will use:

- Access token: Signed JWT.
- Refresh token: Cryptographically random string, with its hash stored in MongoDB.

## 5. Why not make the access token last forever?

Suppose a website creates an access token with no expiration.

```
const token = jwt.sign(
  { userId: user._id },
  process.env.ACCESS_TOKEN_SECRET
);
```

Notice that there is no `expiresIn` option.

The `jsonwebtoken` library does not automatically add an expiration claim when you omit one.

If the server verifies the token normally and does not check another revocation mechanism, the token may remain valid indefinitely.

### The danger

Imagine the following situation:

1. You log in to an application.
2. The application creates a JWT without an expiration.
3. Malware, a browser extension, or another attack exposes your token.
4. An attacker copies the token.
5. The attacker sends it to the application from another device.
6. The server continues accepting the token because it is still valid.

The attacker does not necessarily need your email or password. The stolen token itself may be enough to impersonate you for the operations it permits.

Important: A JWT without an expiration does not literally guarantee permanent access. A server can still reject it using a denylist, account-status check, signing-key change, or another revocation mechanism. The danger is that ordinary signature verification alone does not make the token expire.

### What is the benefit of a short-lived access token?

A short-lived access token limits the time available to abuse a stolen token, assuming the attacker cannot obtain a replacement credential.

It does not prevent token theft. It reduces the period of exposure.

## 6. The problem with a 30-minute expiration

Suppose the application sets:

```
expiresIn: "30m"
```

The user logs in at 10:00 AM. At 10:30 AM, the token expires.

Without another mechanism, the next protected request fails authentication. The user may need to log in again.

Now imagine this happens several times during a long study session. It is frustrating.

We need a system that provides both:

- Short-lived access credentials.
- A way to renew access without repeatedly asking for the password.

This is the purpose of the refresh token.

### Example timeline

### 10:00

Login

The server issues an access token and a refresh token.

### 10:30

Access token expires

The application uses the refresh flow rather than immediately demanding the password.

### 10:30

Token renewal

If the refresh token and session are still valid, the server issues a new access token.

### Later

Refresh token expires or is revoked

The application needs a new login or another permitted authentication flow.

The example uses 30 minutes for illustration. Real applications choose their own lifetimes based on risk, user experience, and security requirements.

## 7. What happens if the refresh token expires?

A refresh token does not automatically renew itself merely because its expiration is approaching.

The server must have a defined policy for what happens next.

There are three common possibilities:

| Situation                                       | Expected behavior                                                          |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| Access token expired, refresh token still valid | Issue a new access token after validating the refresh token.               |
| Refresh token expired                           | Require reauthentication, unless another valid renewal mechanism exists.   |
| Refresh token revoked                           | Reject it and require reauthentication or another permitted recovery flow. |

Some systems implement refresh-token rotation. Every successful refresh invalidates the old refresh token and issues a new one.

For example:

```
Refresh token A
      |
      v
Successful refresh
      |
      +----> New access token
      |
      +----> New refresh token B

Token A is invalidated.
```

If an attacker steals token A and attempts to reuse it after it has been rotated, the server can detect suspicious reuse and revoke the affected token family or session, depending on its design.

### What if the refresh token itself gets stolen?

A stolen refresh token can be more dangerous than a stolen access token because it may allow the attacker to obtain new access tokens repeatedly.

That is why secure refresh-token systems commonly use:

- Cryptographically random refresh tokens.
- Secure storage and transmission.
- Server-side session records.
- Token rotation.
- Revocation and reuse detection.
- Expiration and idle-time limits.
- Reauthentication for sensitive actions.

Refresh tokens are powerful credentials. They must not be treated as harmless data.

## 8. Why should changing the password affect existing tokens?

This is one of the most important security questions in the lecture.

Suppose your password is `OldPassword123`. You log in and receive an access token that expires in 15 minutes and a refresh token that lasts several days.

Later, you discover suspicious activity and change your password.

What should happen to your existing tokens?

A secure application should have a deliberate policy for handling existing sessions after a password change. It should generally revoke existing refresh-token sessions, especially when the change follows a suspected compromise.

However, changing the password does not automatically invalidate every JWT.

Why? Because a self-contained JWT can remain cryptographically valid even after the password changes. If the server only verifies the JWT's signature and expiration, it may not know that the password has changed.

### Example

Before password change

Access token A and refresh token R1 are valid.

User changes password

The server updates the password hash and revokes the existing refresh-token session.

After password change

R1 cannot obtain new access tokens. Access token A may remain valid until it expires unless the server has an additional invalidation mechanism.

### How can the application invalidate old access tokens?

There are several approaches:

1\. Short-lived access tokens

Keep the access-token lifetime short so old tokens expire relatively quickly.

2\. Token version or password-change timestamp

Store a value on the user record, such as a token version or password-change timestamp. Include a corresponding claim in the JWT and check it against the current server-side value.

For example, the token might contain:

```
{
  userId: "exampleUser123",
  tokenVersion: 3
}
```

When the password changes, the server increments the user's token version. The application rejects tokens carrying an older version when it checks the current database value.

This approach requires server-side validation; signature verification alone cannot enforce it.

3\. Server-side session revocation

Store refresh-token sessions in the database and revoke them after a password change. Protected endpoints can additionally check session or account state when immediate invalidation is required.

Practical rule: A password change should revoke existing refresh sessions and, when the security requirements call for immediate access-token invalidation, use an additional mechanism rather than relying on JWT expiration alone.

## 9. Can an attacker change your password using a stolen access token?

Potentially, yes. It depends on the application's authorization rules.

Imagine an attacker steals a valid access token that grants access to your account.

If the application allows password changes using only that token, without requiring any additional proof, the attacker may be able to change your password and take over the account.

That is why sensitive operations should have stronger protections.

### Recommended protection for password changes

A password-change endpoint should normally:

1. Authenticate the user.
2. Require the current password or another appropriate reauthentication factor.
3. Validate the new password.
4. Update the stored password hash.
5. Revoke existing refresh-token sessions according to policy.
6. Apply the application's access-token invalidation strategy.
7. Notify the user of the change where appropriate.

For particularly sensitive operations, multi-factor authentication or step-up authentication may be required.

Important distinction: Requiring the old password protects against an attacker who has only stolen a session credential, but it is not a complete defense in every situation. If the attacker also knows the password or controls another authentication factor, additional protections are necessary.

## 10. What is middleware in Express.js?

Middleware is a function that runs during the request-response cycle.

It can inspect a request, modify request or response objects, end the request with a response, or pass control to the next middleware.

The basic syntax is:

```
function myMiddleware(req, res, next) {
  // Perform an operation.

  next();
}
```

### Why do we need middleware for authentication?

Imagine you have 20 protected API endpoints.

Without middleware, you might repeat this logic in every endpoint:

```
const token = req.cookies.token;
const payload = jwt.verify(
  token,
  process.env.ACCESS_TOKEN_SECRET
);
```

Repeating the same authentication code creates several problems:

- More duplicated code.
- More opportunities for inconsistent checks.
- Harder maintenance.
- Greater risk of forgetting to handle invalid or missing tokens.

Middleware allows you to write the authentication logic once and reuse it.

### How middleware works

Incoming request

Authentication middleware

Extract and verify the access token

Invalid token

Return 401

Valid token

Call `next()`

Protected route handler

### Example: Reusable authentication middleware

```
const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Please log in"
      });
    }

    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      { algorithms: ["HS256"] }
    );

    req.user = {
      userId: payload.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token"
    });
  }
}

module.exports = authenticateUser;
```

Notice that this middleware verifies the access token. It does not refresh an expired token by itself.

The refresh process belongs in a separate endpoint or a carefully designed authentication flow.

### Using middleware on multiple endpoints

```
app.get("/me", authenticateUser, getMyProfile);

app.get("/dashboard", authenticateUser, getDashboard);

app.get("/my-courses", authenticateUser, getMyCourses);
```

Each route reuses the same authentication function.

The handler functions above are illustrative names; define them in your application.

Remember: Authentication middleware establishes the user's identity. You may need separate authorization middleware to check roles, permissions, or resource ownership.

## 11. Implementing refresh tokens in a Node.js project

Let's design a practical version using the same technologies as Lecture 20.

### Step 1: Generate a refresh token

Use Node.js's built-in `crypto` module to generate a cryptographically random token.

```
const crypto = require("crypto");

const refreshToken = crypto
  .randomBytes(64)
  .toString("hex");
```

This produces a random string.

Unlike a JWT, the string does not inherently contain a header, payload, or claims that you can decode. The server identifies the associated session using its stored record.

### Step 2: Hash the refresh token before storing it

```
const refreshTokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");
```

Store `refreshTokenHash` in the database rather than the original refresh token.

Why?

If the database is exposed, an attacker cannot immediately use the stored hash as the original refresh token. The server hashes the token presented by the client and compares the result with the stored hash.

Because the refresh token is generated randomly with high entropy, this design is appropriate for a token credential. This is different from password storage, where a dedicated password-hashing algorithm such as bcrypt or Argon2id is preferable.

### Step 3: Store a refresh-token session

A conceptual MongoDB session record might look like this:

```
{
  userId: ObjectId("example"),
  tokenHash: "example_sha256_hash",
  expiresAt: Date,
  revokedAt: null
}
```

This is illustrative data, not a complete Mongoose schema.

The database record lets the application determine whether the refresh token:

- Belongs to a known session.
- Has expired.
- Has been revoked.
- Has already been used, if rotation and reuse detection are implemented.

A user may have multiple sessions, such as a laptop and a mobile phone. Storing refresh tokens as separate session records allows an application to revoke one session or all sessions.

### Step 4: Set the refresh token in a cookie

```
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
});
```

This example sets a seven-day browser-cookie lifetime. Your server must separately enforce the refresh-token session's expiration.

For a production design, consider restricting the refresh cookie's path to the refresh and logout endpoints, where appropriate. The exact cookie policy depends on your deployment architecture.

### Step 5: Create the refresh endpoint

The following is the conceptual flow of `POST /refresh`, not a complete production-ready implementation.

```
app.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token required"
    });
  }

  // 1. Hash the presented refresh token.
  // 2. Find its session record in the database.
  // 3. Reject missing, expired, or revoked sessions.
  // 4. Verify that the user and session are still eligible.
  // 5. Rotate the refresh token if using rotation.
  // 6. Issue a new short-lived access token.
  // 7. Return the new access token and update cookies
  //    as required by the application's design.
});
```

The omitted database and rotation logic is important. Merely checking that a refresh token exists is not enough.

A real implementation must validate the session, prevent concurrent refreshes from incorrectly reusing a token, and handle rotation and revocation consistently.

### Step 6: Issue a new access token

After the server validates the refresh session, it can create a new access token:

```
const accessToken = jwt.sign(
  {
    userId: user._id
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: "15m"
  }
);
```

The server can then send the new access token using the application's chosen transport, such as an `HttpOnly` cookie or a response body.

If the access token is also stored in a cookie, the cookie attributes must be configured appropriately. If the frontend and API are on different origins, cross-origin credentials and CSRF protection must also be handled.

### The entire refresh flow

Access token expires

Client sends refresh token to `POST /refresh`

Server hashes the presented token and checks its database session

Invalid session

Reject the request and require reauthentication.

Valid session

Issue a new access token and rotate the refresh token if required.

## 12. Does every website use refresh tokens?

No. Refresh tokens are one authentication design among several.

| System                              | Possible approach                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| Traditional server-rendered website | Server-side sessions and cookies                                                       |
| Single-page web application         | Access tokens with refresh tokens, or another session design                           |
| Mobile application                  | Access tokens and securely stored refresh tokens                                       |
| Banking application                 | Server-side sessions or token-based authentication, with additional risk controls      |
| Public API                          | API keys, OAuth access tokens, or another credential system, depending on the use case |

Do not assume that every banking website uses exactly the same session duration or authentication technology. Financial services commonly apply risk-based controls, session limits, step-up authentication, and other protections.

A server-side session can be easier to revoke centrally because the server can check session state on each request. But session-based authentication also requires secure cookie handling, session management, and appropriate expiration rules.

JWT is not automatically better than sessions. The right choice depends on the system's requirements.

## 13. Important security rules to remember

1\. Keep access tokens short-lived

Use an appropriate expiration time so a stolen token cannot remain usable indefinitely under ordinary verification.

2\. Protect refresh tokens carefully

Refresh tokens can provide continued access. Store them securely, transmit them over HTTPS, and implement expiration and revocation.

3\. Rotate refresh tokens when appropriate

In a rotation-based system, each successful refresh invalidates the old token and issues a new one. Detecting reuse of an invalidated token can help identify theft.

4\. Revoke sessions after sensitive account changes

Password changes and suspected compromises should trigger a defined session-revocation policy. JWT expiration alone does not guarantee immediate invalidation.

5\. Use secure cookie settings

Prefer `HttpOnly`, `Secure` over HTTPS, and an appropriate `SameSite` policy. Assess CSRF risk and apply additional protection when necessary.

6\. Do not expose secrets

Keep signing keys in environment variables or a proper secrets manager. Never commit real secrets or active authentication tokens to GitHub.

## 14. Common interview questions and answers

Q1. Why do we need refresh tokens?

To obtain new access tokens without repeatedly asking the user to enter their credentials, while keeping access tokens relatively short-lived.

Q2. Is an access token always a JWT?

No. JWT is a common access-token format, but access tokens can also be opaque strings.

Q3. Is a refresh token always a JWT?

No. A refresh token can be a random, opaque string or a JWT. Random tokens with server-side session records are a common design.

Q4. Why should access tokens expire?

Expiration limits how long a stolen token remains usable under normal verification rules.

Q5. What happens when an access token expires?

Protected requests using that token should be rejected. The client may request a new token using a valid refresh token or ask the user to authenticate again.

Q6. What happens when a refresh token expires?

The server rejects it. The user normally needs to authenticate again unless another valid renewal mechanism is available.

Q7. Does changing a password invalidate existing JWTs?

Not automatically. The application must implement token invalidation or session-revocation logic. Short-lived access tokens reduce exposure but do not guarantee immediate invalidation.

Q8. What is refresh-token rotation?

The server replaces a refresh token with a new one during a successful refresh and invalidates the previous token.

Q9. What happens if a refresh token is stolen?

An attacker may be able to obtain new access tokens. Secure storage, rotation, revocation, expiration, and reuse detection help mitigate the risk.

Q10. What is middleware?

Middleware is a function that runs during the Express request-response cycle. It can perform shared operations such as authentication, validation, and logging.

Q11. Why use authentication middleware?

It prevents repeating the same authentication logic across protected routes and helps keep checks consistent.

Q12. What is the difference between `next()` and `res.json()`?

- `next()` passes control to the next middleware or route handler.
- `res.json()` sends a JSON response to the client and ends the response.

Q13. Does middleware automatically refresh an expired JWT?

No. Authentication middleware typically verifies the access token. Refreshing a token requires a separate refresh flow or another explicitly implemented mechanism.

Q14. Why might a bank log a user out after inactivity?

To reduce the risk of unauthorized access, particularly when a device is unattended or a session has been compromised. Exact policies vary by institution and application.

## 15. Final revision: Lecture 20 versus Lecture 21

| Concept              | Lecture 20                      | Lecture 21                                                        |
| -------------------- | ------------------------------- | ----------------------------------------------------------------- |
| Main focus           | JWTs and cookies                | Refresh tokens and middleware                                     |
| Access credential    | Signed JWT                      | Usually a short-lived access token                                |
| Refresh credential   | Not covered in depth            | Used to obtain replacement access tokens                          |
| Storage              | JWT may be held in a cookie     | Refresh sessions may be stored in a database                      |
| Authentication logic | Token creation and verification | Reusable middleware and token renewal                             |
| Security concern     | Token exposure and expiration   | Token theft, rotation, revocation, and session lifetime           |
| Password changes     | Existing JWTs may remain valid  | Existing sessions and tokens need an explicit invalidation policy |

The central lesson is that access tokens, refresh tokens, cookies, and middleware solve different problems:

- Access tokens provide credentials for protected requests.
- Refresh tokens allow eligible sessions to obtain new access tokens.
- Cookies provide a mechanism for storing and transmitting credentials in the browser.
- Middleware centralizes reusable request processing, including authentication.

Together, these mechanisms can provide a secure and convenient authentication system when expiration, storage, authorization, rotation, and revocation are implemented correctly.

## 16. Practice questions

Try answering these without looking at the notes.

1\. A JWT has no expiration claim. Does jwt.verify() automatically reject it after 30 minutes?

Yes, JWTs always expire after 30 minutes

No, not unless another verification or revocation rule rejects it

Yes, when the browser closes

2\. The access token has expired, but the refresh token is valid. What should the client do?

Send the expired access token again indefinitely

Send the refresh token to the refresh endpoint

Send the user's password in every API request

3\. Why store a hash of a random refresh token in the database?

To make the original token readable

To reduce the risk of database exposure immediately revealing usable refresh tokens

To turn the refresh token into a JWT

4\. What does Express middleware help you avoid?

All database queries

Repeating authentication logic in every protected route

The need to verify tokens

5\. Does changing a password automatically invalidate every self-contained JWT?

Yes, always

No, the application needs an explicit invalidation strategy

Only if the JWT is stored in a cookie

Check answers
