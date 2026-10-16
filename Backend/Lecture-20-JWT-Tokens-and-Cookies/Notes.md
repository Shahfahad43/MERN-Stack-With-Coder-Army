# Lecture 20: JWT Tokens and Cookies

Backend Development · Node.js · Express.js · MongoDB · Authentication and Authorization

## 1. What will you learn in this lecture?

By the end of this lecture, you should understand:

- Why applications use tokens instead of asking users to log in with their email and password on every request.
- What JWT (JSON Web Token) is and how its three parts work.
- The difference between hashing, encryption, and digital signatures.
- What cookies are and how Express.js sends and reads them.
- How to implement JWT authentication using `jsonwebtoken` and `cookie-parser`.
- How to register users, verify login credentials, generate tokens, and identify logged-in users.
- Common JWT myths and security mistakes.

## 2. The problem: Why do we need JWT?

Imagine you log in to Instagram using your email and password. After logging in, you open your profile, view posts, check messages, and update settings.

Should you enter your password for every operation?

No. That would be inconvenient and inefficient.

### Without a token

User sends email + password

Server checks the credentials

This process may repeat for every request

### With a token

1\. User logs in once

2\. Server verifies credentials and issues a JWT

3\. Browser stores the token in a cookie

4\. Browser sends the cookie with subsequent requests

5\. Server verifies the token before granting access

The token acts as proof that the user previously authenticated. The server still needs to verify the token and check whether the user is authorized to access the requested resource.

Important distinction: Authentication answers, “Who are you?” Authorization answers, “What are you allowed to access?”

## 3. What is JWT?

JWT stands for JSON Web Token.

It is a compact, string-based format for carrying claims (information about a user or another subject) between systems.

A JWT commonly contains information such as:

- The user's ID.
- The user's email.
- The token's issue time.
- The token's expiration time.
- Other claims relevant to the application.

Example of a fictional JWT-shaped string:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJ1c2VySWQiOiJleGFtcGxlMTIzIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0
.exampleSignatureValue
```

The three segments are separated by dots (`.`).

JWT is commonly used for authentication, but it can also be used for other purposes, such as exchanging claims between services.

### Important terminology

- Stateless verification: A server can validate a self-contained JWT without looking up a server-side session for every request.
- Self-contained: The token carries its claims within itself.
- Database storage: A JWT does not inherently need to be stored in the database. However, an application may store token records, revoked-token identifiers, or refresh-token information.
- Expiration: A token can include an expiration time, but expiration is not mandatory in the JWT format. Applications should generally use a reasonable expiration period.

JWT does not automatically make an application secure. Its security depends on how the token is created, stored, verified, and used.

## 4. The three parts of a JWT

A signed JWT commonly has this structure:

1

Header

Describes the token type and signing algorithm.

2

Payload

Contains claims, such as a user ID, email, issue time, or expiration time.

3

Signature

Allows the server to verify that the signed token has not been modified and was signed using the expected key.

### Part 1: Header

A decoded header might look like this:

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: Specifies the signing algorithm. Here, it is HS256.
- `typ`: Identifies the token type as JWT.

The header is encoded as Base64URL when the token is created.

### Part 2: Payload

Example:

```
{
  "userId": "exampleUser123",
  "email": "student@example.com",
  "iat": 1792126009,
  "exp": 1792126019
}
```

- `userId`: Identifies the user.
- `email`: Identifies the user's email.
- `iat`: Issued-at timestamp, represented as Unix time in seconds.
- `exp`: Expiration timestamp, also represented as Unix time in seconds.

The values above are illustrative.

Security rule: Never place passwords, identity-card details, private keys, or other sensitive secrets in an ordinary signed JWT payload.

The payload is encoded, not encrypted. Anyone who obtains the token can usually decode and read its claims.

### Part 3: Digital signature

The signature is produced using the header, payload, and a signing key.

For the HS256 algorithm, the conceptual formula is:

\\[ \text{Signature} = \operatorname{HMAC\\!-\\!SHA256} (\text{Base64URL(Header)} \\; || \\; "." \\; || \\; \text{Base64URL(Payload)}, \text{Secret}) \\]

Here, `||` means concatenation.

The signature helps the server detect modifications. If someone changes the payload without producing a valid signature, verification should fail.

Important correction: HS256 uses a keyed message authentication code (HMAC), not a conventional public/private-key digital signature. Algorithms such as RS256 use an asymmetric digital signature.

## 5. JWT encoding, hashing, encryption, and signatures

These concepts are related, but they are not interchangeable.

### A. Encoding

Encoding changes the representation of data so it can be transmitted or stored in a particular format. It does not provide secrecy.

Example:

```
Original text: Hello
Base64:        SGVsbG8=
```

Anyone can decode this value without knowing a secret key.

The JWT header and payload use Base64URL encoding, which is a URL-friendly variation of Base64.

You can inspect a token using [jwt.io](https://jwt.io/?utm_source=chatgpt.com) or decode a Base64 value using [Base64 Decode](https://www.base64decode.org/?utm_source=chatgpt.com).

Only inspect tokens you own or are explicitly authorized to examine. Do not paste real production tokens into public websites.

### B. Hashing

Hashing transforms input data into a fixed-length digest using a hash function.

For example, SHA-256 produces a 256-bit digest, usually displayed as 64 hexadecimal characters.

```
Input:  Hello
        |
        v
     SHA-256
        |
        v
Output: a fixed-length hash digest
```

A cryptographic hash is designed to be computationally infeasible to reverse directly. However, an attacker may guess possible inputs and compare their hashes.

Hashing is used for:

- Checking whether data has changed.
- Building message authentication and digital-signature systems.
- Securely storing passwords when an appropriate password-hashing algorithm is used.

Password security note: SHA-256 alone is generally not appropriate for password storage. Use a password-hashing algorithm such as bcrypt, Argon2id, or scrypt, with appropriate parameters.

### C. Encryption

Encryption transforms readable plaintext into ciphertext using a key. Decryption reverses the transformation using the appropriate key.

```
Plaintext
    |
    | Encrypt with key
    v
Ciphertext
    |
    | Decrypt with key
    v
Plaintext
```

Encryption is used when confidentiality is required, such as protecting sensitive data from unauthorized readers.

### D. Comparison table

| Feature                  | Encoding                            | Hashing                       | Encryption                     |
| ------------------------ | ----------------------------------- | ----------------------------- | ------------------------------ |
| Main purpose             | Change representation               | Produce a digest              | Protect confidentiality        |
| Reversible?              | Yes, with the corresponding decoder | Not designed to be reversible | Yes, with the appropriate key  |
| Secret key required?     | No                                  | Not for ordinary SHA-256      | Yes                            |
| Example                  | Base64URL                           | SHA-256                       | AES                            |
| Hides the original data? | No                                  | Not reliably                  | Yes, when properly implemented |

### E. What is a hash collision?

A hash collision occurs when two different inputs produce the same hash digest.

For example, theoretically:

```
Input A ──SHA-256──> Digest X
Input B ──SHA-256──> Digest X
```

Even though SHA-256 has an enormous output space, collisions must exist mathematically because infinitely many possible inputs map into a finite number of outputs.

The security goal is to make finding such collisions computationally infeasible.

### F. Is the JWT signature a hash of the header and payload?

Not exactly.

With HS256, the signature is generated using HMAC-SHA-256. It is not merely a plain SHA-256 hash of the header and payload, because the secret key is involved.

This distinction matters because anyone can calculate an ordinary hash, but only someone possessing the correct secret can generate a valid HS256 signature.

## 6. JWT myths and misconceptions

Myth 1: JWT encrypts the user's information.

Correction

An ordinary signed JWT is not encrypted. Its payload can be decoded and read. Signing protects integrity, not confidentiality.

Myth 2: A JWT must be stored in the database.

Correction

A self-contained JWT can be verified without a database lookup for the token itself. The application may still query the database to retrieve user information, check account status, or enforce revocation.

Myth 3: A JWT never expires unless the user logs out.

Correction

Expiration is determined by the token's claims and the server's verification rules. A token can expire automatically, even if the user does not log out.

Myth 4: A valid JWT gives access to every API endpoint.

Correction

A valid token can establish identity, but the server must also check permissions and ownership. A normal user should not automatically gain administrator privileges.

Myth 5: JWT makes a website completely stateless and secure.

Correction

JWT can avoid server-side session storage, but applications still need to manage user accounts, permissions, token theft, expiration, logout, and possibly revocation.

## 7. What are API endpoints?

An API endpoint is a specific address and HTTP method through which a client interacts with a server.

In Express.js, an endpoint is commonly defined using a route.

| Endpoint         | Purpose                                   | Typical access |
| ---------------- | ----------------------------------------- | -------------- |
| `POST /register` | Create a new account                      | Public         |
| `POST /login`    | Verify credentials and issue a token      | Public         |
| `GET /info`      | Retrieve information                      | Authenticated  |
| `GET /user`      | Retrieve the authenticated user's profile | Authenticated  |

For example:

```
app.get("/info", (req, res) => {
  res.send("User information");
});
```

This defines a `GET` endpoint at `/info`.

A route is not automatically protected merely because it has a particular name. You must explicitly implement authentication and authorization.

### What happens when a protected endpoint is requested?

1. The browser sends an HTTP request.
2. The browser may include a cookie containing the JWT.
3. The server extracts the token.
4. The server verifies the token's signature and expiration.
5. The server checks permissions where necessary.
6. The server returns the requested data or an error.

## 8. What are cookies?

A cookie is a small piece of data that a browser stores for a website.

Cookies are frequently used for:

- Maintaining login sessions.
- Carrying session identifiers or authentication tokens.
- Storing certain preferences.
- Supporting other website functionality.

### How cookies work

Express server

Sends a `Set-Cookie` response header

HTTP response

Browser

Stores the cookie according to its attributes

Subsequent matching requests

Express server

Reads and validates the cookie

Cookies are managed by the browser, subject to their domain, path, security, and expiration settings. JavaScript can also create some cookies, but cookies marked `HttpOnly` cannot be read through ordinary client-side JavaScript.

### Cookie versus JWT

| Cookie                                                      | JWT                                                |
| ----------------------------------------------------------- | -------------------------------------------------- |
| A browser storage and transmission mechanism                | A token format                                     |
| Can contain a JWT, session ID, or other value               | Can be sent in a cookie or an authorization header |
| Has attributes such as `HttpOnly`, `Secure`, and `SameSite` | Has claims and, for a signed JWT, a signature      |
| Does not automatically authenticate a user                  | Does not automatically protect a token from theft  |

Key concept: A cookie and a JWT are not alternatives to one another. In this lecture, the cookie is the container used to send the JWT between the browser and server.

## 9. Cookie Editor and accessing cookies

The lecture introduces the Chrome extension Cookie Editor for inspecting and managing cookies during development.

Typical learning workflow:

1. Install the extension from a trusted source.
2. Open a website you are authorized to test.
3. Inspect the cookies associated with that website.
4. Observe the cookie names, values, and attributes.
5. Test how your own application behaves when a valid or invalid authentication cookie is present.

### Security warning about exporting cookies

Exported cookies may contain active session credentials or bearer tokens. Whoever possesses a valid authentication cookie may be able to access the associated account without knowing its password.

Do not copy another person's cookies, import someone else's paid-course session, or use their account access without explicit authorization. A browser's cookie editor is a development and debugging tool, not a legitimate way to bypass course access controls.

For practice, use your own test account and a local Express application.

## 10. Installing the required npm packages

In your Node.js project directory, run:

```
npm install jsonwebtoken cookie-parser bcrypt
```

These packages serve different purposes:

| Package         | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `jsonwebtoken`  | Creates and verifies JWTs                       |
| `cookie-parser` | Parses incoming cookies into `req.cookies`      |
| `bcrypt`        | Hashes passwords and compares password attempts |

Your project also uses Express and Mongoose, so those dependencies must already be installed.

### What does `cookie-parser` do?

When the browser sends a cookie, the raw cookie data arrives in an HTTP request header named `Cookie`.

Express does not automatically provide the parsed cookie values through `req.cookies`. The `cookie-parser` middleware makes them available.

```
const cookieParser = require("cookie-parser");

app.use(cookieParser());
```

After this middleware runs, you can access a cookie like this:

```
console.log(req.cookies);
console.log(req.cookies.token);
```

Without the middleware, `req.cookies` may be `undefined`.

Middleware must be registered before the routes that depend on it.

## 11. Creating and verifying a JWT in Express

### Step 1: Import the package

```
const jwt = require("jsonwebtoken");
```

### Step 2: Create a token using `jwt.sign()`

The general syntax is:

```
jwt.sign(payload, secretOrPrivateKey, options);
```

Example:

```
const token = jwt.sign(
  {
    userId: user._id,
    email: user.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m"
  }
);
```

Understanding each argument:

- `payload`: The claims you want to put inside the token.
- `process.env.JWT_SECRET`: A secret key used to sign an HS256 token.
- `expiresIn`: Determines when the token expires.

The `jsonwebtoken` library creates the header, encodes the payload, and generates the signature.

Why use `process.env.JWT_SECRET`?

A real secret should not be written directly in your source code. Store it in an environment variable and exclude the `.env` file from Git.

Example `.env` file:

```
JWT_SECRET=replace_with_a_long_random_secret
```

This is a placeholder, not a usable production secret.

### Step 3: Send the token in a cookie

```
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
  path: "/"
});
```

Explanation:

- `token`: Cookie name.
- `token` as the second argument: The JWT value.
- `httpOnly: true`: Prevents normal client-side JavaScript from reading the cookie.
- `secure: true` in production: Sends the cookie only over HTTPS.
- `sameSite: "lax"`: Provides some protection against cross-site request forgery (CSRF).
- `maxAge`: Sets the cookie lifetime in milliseconds.
- `path: "/"`: Makes the cookie available across paths on the website.

The cookie lifetime and JWT expiration are separate settings. For example, the browser might keep a cookie whose JWT has already expired. The server must still reject the expired JWT.

For cross-site frontend/backend deployments, cookie and CSRF settings may need additional configuration.

### Step 4: Verify the token using `jwt.verify()`

```
const payload = jwt.verify(
  req.cookies.token,
  process.env.JWT_SECRET
);

console.log(payload);
```

If verification succeeds, the function returns the decoded claims.

If the token is expired, incorrectly signed, or otherwise invalid, verification throws an error.

For example, a verified payload might contain:

```
{
  userId: "exampleUser123",
  email: "student@example.com",
  iat: 1792126009,
  exp: 1792126909
}
```

These are illustrative values. The library adds `iat` by default unless configured otherwise, and adds `exp` when an expiration is specified.

Never use `jwt.decode()` as proof of authentication. Decoding reads claims but does not validate the signature. Use `jwt.verify()` to authenticate a signed token.

## 12. Understanding your lecture's login flow

Your supplied code performs these operations inside `POST /login`.

1\. Receive credentials

Read `email` and `password` from `req.body`.

2\. Find the user

`User.findOne({ email })` searches MongoDB.

3\. Compare passwords

`bcrypt.compare(password, user.password)` checks the submitted password against the stored hash.

4\. Sign the JWT

`jwt.sign()` creates a token containing the user's ID and email.

5\. Set the cookie

`res.cookie()` instructs the browser to store the token.

6\. Return a response

The server confirms that login succeeded.

### Important lines from your code

Finding the user

```
const user = await User.findOne({ email });
```

This retrieves the account matching the email address.

Checking the password

```
const isAllowed = await bcrypt.compare(
  password,
  user.password
);
```

The submitted password is not encrypted and compared directly with the database value. Instead, bcrypt checks whether the password matches the stored password hash.

Creating the token

```
const token = jwt.sign(
  {
    email: user.email,
    userId: user._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m"
  }
);
```

The token carries the user's ID and email, not their password.

Setting the cookie

```
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
  path: "/"
});
```

The browser receives the cookie through the response and can include it in later matching requests.

## 13. Accessing the logged-in user

Your original `/user` route uses this approach:

```
const payload = jwt.verify(
  req.cookies.token,
  process.env.JWT_SECRET
);

const user = await User.findById(payload.userId);
```

Let's understand the logic.

1. `req.cookies.token` retrieves the token from the request cookie.
2. `jwt.verify()` validates the token and returns its claims.
3. `payload.userId` retrieves the ID that was included when the token was signed.
4. `User.findById()` uses that ID to retrieve the corresponding database record.

The important relationship is:

```
Browser cookie
     |
     v
JWT token
     |
     v
jwt.verify()
     |
     v
Verified payload.userId
     |
     v
MongoDB User.findById()
     |
     v
User document
```

### Why use the ID from the verified token?

The server can identify the authenticated user without asking the client to provide a user ID in the URL.

For example, consider:

```
GET /user/anotherUsersId
```

If the server trusts the URL's ID without checking ownership, a user may attempt to access another account's information.

A safer self-profile endpoint derives the user ID from the verified token:

```
const user = await User.findById(payload.userId);
```

This is a useful design for a route such as `GET /me`. However, it does not replace authorization checks for administrative functions or resources belonging to other users.

## 14. A safer authentication middleware

Instead of repeating `jwt.verify()` in every protected route, create middleware that performs authentication once per request.

Example `middleware/auth.js`:

```
const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"]
      }
    );

    req.user = {
      userId: payload.userId,
      email: payload.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = authenticateUser;
```

Here, `algorithms: ["HS256"]` restricts verification to the algorithm expected by this example.

Now use it in a route:

```
const authenticateUser =
  require("./middleware/auth");

app.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});
```

### What does `next()` do?

In Express middleware, `next()` passes control to the next middleware or route handler.

In this example:

- If the token is missing or invalid, the request stops with an error response.
- If the token is valid, the decoded identity is attached to `req.user`.
- `next()` allows the protected route to execute.

This pattern makes authentication logic reusable and easier to maintain.

## 15. Important problems in the original lecture code

Your original code is useful for learning, but several parts should be corrected before using it in a real application.

### Problem 1: `/info` returns every user

Your code contains:

```
const result = await User.find({});
res.send(result);
```

`User.find({})` retrieves all user documents. This could expose private information about every registered user, including password hashes if they are included in the returned documents.

Correction: Retrieve only the authenticated user's record and exclude sensitive fields.

```
const user = await User.findById(
  req.user.userId
).select("-password");

return res.json(user);
```

This assumes the authentication middleware has already verified the JWT.

### Problem 2: The JWT secret is hardcoded

Your lecture code uses:

```
"Shah@123"
```

A hardcoded secret can be exposed through source code, commits, screenshots, or repository history.

Use:

```
process.env.JWT_SECRET
```

Then configure the environment variable locally and in your deployment platform. If a real secret has already been pushed to GitHub, rotate it; deleting the line alone does not invalidate the leaked secret or erase it from Git history.

### Problem 3: The token expires after only 10 seconds

Your code uses:

```
expiresIn: 10
```

The number represents 10 seconds, not 10 minutes.

Use a clearer setting:

```
expiresIn: "15m"
```

This example gives the access token a 15-minute lifetime. The appropriate lifetime depends on the application's security requirements.

### Problem 4: The token might be missing or invalid

This line in your original code can throw an error:

```
const payload = jwt.verify(
  req.cookies.token,
  process.env.JWT_SECRET
);
```

Potential problems include:

- No cookie exists.
- The token has expired.
- The token has been altered.
- The token was signed using another secret.
- The token is malformed.

Handle these cases through authentication middleware or a `try/catch` block. An unauthenticated request should receive an appropriate `401 Unauthorized` response, not an unhandled server error.

### Problem 5: Never return passwords to clients

Use Mongoose projection when retrieving a user:

```
const user = await User.findById(
  req.user.userId
).select("-password");
```

This excludes the password field from the result.

Even though bcrypt stores a hash rather than the original password, the hash must still remain private.

### Problem 6: Error messages should not expose internal details

Your original code includes:

```
return res.send("Error " + err.message);
```

Detailed errors can reveal internal implementation information. Return a suitable public message and log technical details securely on the server.

## 16. How can LinkedIn or Instagram keep you logged in?

This is an important question because it reveals the difference between authentication and the browser's storage of authentication credentials.

A website can keep you logged in through several mechanisms.

1\. Persistent authentication cookie

The browser stores a cookie with an expiration date or lifetime. It may survive browser restarts until it expires or is removed.

2\. Short-lived access token

An access token may expire after minutes or hours. The application then obtains a new token if its refresh mechanism allows it.

3\. Refresh token or server-side session

A longer-lived credential or session lets the application maintain the login without asking for the password each time. It can be revoked or expire according to the application's rules.

### Access token versus refresh token

| Access token                       | Refresh token                          |
| ---------------------------------- | -------------------------------------- |
| Used to access protected resources | Used to obtain new access tokens       |
| Usually short-lived                | Often longer-lived                     |
| Sent with protected requests       | Sent to a designated refresh endpoint  |
| Should have limited permissions    | Must be stored and protected carefully |

A refresh token is not necessarily a JWT; its format depends on the implementation.

A production application may also use server-side sessions instead of JWTs. You cannot determine the exact authentication mechanism used by LinkedIn or Instagram merely by observing that the user remains logged in.

Key takeaway: A user does not have to enter their password for every request because the browser can send an existing authentication credential. The server must still validate that credential and enforce the applicable expiration and authorization rules.

## 17. What happens when the JWT expires?

Suppose the server creates a token with:

```
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);
```

The token is valid for 15 minutes from issuance, subject to the verification rules.

After expiration:

1. The browser may still possess the cookie.
2. The browser may continue sending it.
3. `jwt.verify()` rejects the expired token.
4. The protected endpoint should reject the request.
5. The application can ask the user to log in again or attempt a valid refresh flow.

There are two different expirations to remember:

- JWT expiration: Determined by the token's `exp` claim and verification.
- Cookie expiration: Determines how long the browser stores the cookie.

Neither expiration setting automatically controls the other.

## 18. How do you log out when using JWT?

A JWT does not automatically disappear from existence when a user clicks Logout. A signed token can remain cryptographically valid until it expires unless the application implements revocation or another invalidation mechanism.

For a cookie-based application, the browser can be instructed to clear the cookie:

```
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
});
```

The cookie-clearing options should match the relevant cookie settings, particularly its path and domain if one was specified.

### Is clearing the cookie enough?

Not always.

Clearing the cookie removes that browser's copy, but it does not invalidate a stolen copy of the same JWT.

For stronger logout and revocation guarantees, applications may use:

- Short-lived access tokens.
- Revocable refresh tokens.
- Server-side sessions.
- A token denylist or another server-side revocation mechanism.

If the token is a self-contained JWT verified without checking any server-side state, immediate individual-token revocation requires an additional mechanism.

Cookie-based authentication also requires appropriate CSRF protection. `HttpOnly` helps prevent JavaScript from reading the cookie, but it does not by itself prevent cross-site request forgery.

## 19. Complete package and request-flow revision

Here is the recommended structure for your learning project.

Express application starts

`express.json()`

Parse incoming JSON request bodies

`cookieParser()`

Parse incoming cookie headers

`/register` and `/login`

Validate input, hash passwords, verify credentials, and issue tokens

Protected routes

Verify JWT → identify user → check authorization → return permitted data

A few details from the lecture code are worth remembering:

- `express.json()` parses JSON request bodies into `req.body`.
- `cookie-parser` parses incoming cookies into `req.cookies`.
- `bcrypt.hash()` hashes a new user's password before it is stored.
- `bcrypt.compare()` verifies a login attempt.
- `jwt.sign()` creates a signed JWT.
- `jwt.verify()` validates a JWT and returns its verified payload.
- `res.cookie()` sends a cookie to the browser.
- `res.clearCookie()` instructs the browser to remove a cookie.
- `User.findOne()` retrieves a matching user.
- `User.findById()` retrieves a user by MongoDB document ID.

## 20. Practical exercises

Use your existing Express and MongoDB project to practise the following tasks.

## JWT practice checklist

0 of 10

Install jsonwebtoken, cookie-parser, and bcrypt.

Configure cookie-parser before your routes.

Create a test account using POST /register.

Log in using POST /login and inspect the response cookies.

Decode a test JWT and identify its header, payload, and signature.

Create a protected GET /me endpoint using jwt.verify().

Test the endpoint with a missing token and an invalid token.

Test what happens after a short-lived token expires.

Implement POST /logout and verify that the cookie is cleared.

Ensure the API never returns password hashes or every user's private data.

Reset checklist

## 21. Interview questions and answers

Q1. What is JWT?

JWT is a compact token format used to transmit claims between parties. Signed JWTs allow the recipient to verify the token's integrity and authenticity.

Q2. What are the three parts of a signed JWT?

Header, payload, and signature.

Q3. Is the JWT payload encrypted?

No. An ordinary signed JWT payload is Base64URL-encoded, not encrypted.

Q4. What is the difference between `jwt.sign()` and `jwt.verify()`?

- `jwt.sign()` creates a signed token.
- `jwt.verify()` checks the token's signature and applicable claims, including expiration.

Q5. Why do we use cookies?

Cookies allow a browser to store and send small pieces of data, including authentication credentials, with matching requests.

Q6. Why do we use `cookie-parser`?

It parses incoming cookies so Express routes can access them through `req.cookies`.

Q7. Why is `bcrypt` used in registration and login?

`bcrypt.hash()` creates a password hash during registration, while `bcrypt.compare()` checks a submitted password during login.

Q8. Does JWT have to be stored in MongoDB?

No. A self-contained JWT can be verified without storing the token itself in MongoDB. Server-side storage may still be needed for revocation, refresh-token management, or other application requirements.

Q9. Can a JWT expire automatically?

Yes. When a token has an expiration claim and the verifier enforces it, the token is rejected after its expiration time.

Q10. What is the difference between authentication and authorization?

Authentication establishes identity. Authorization determines what that identity is permitted to access.

Q11. Is a JWT cookie the same as a JWT?

No. A JWT is a token format; a cookie is a browser storage and transmission mechanism. A cookie can contain a JWT.

Q12. Does logging out automatically invalidate a JWT?

No. Clearing a cookie removes that browser's copy but does not automatically revoke an already-issued token. Immediate revocation requires additional application logic.

## 22. Final revision summary

JWT: Carries claims and can be verified without storing the token itself in a database.

Header: Describes the token type and algorithm.

Payload: Contains claims; do not put secrets in an ordinary signed JWT.

Signature: Helps detect unauthorized changes to the token.

Cookie: Lets the browser store and send an authentication credential.

`jwt.sign()`: Creates a signed token.

`jwt.verify()`: Validates a token before trusting its claims.

`cookie-parser`: Makes incoming cookie values accessible through `req.cookies`.

`bcrypt`: Helps securely store passwords as hashes and verify login attempts.

The central idea of Lecture 20 is that a successful login can establish an authentication credential that the browser reuses for subsequent requests. JWT provides one way to represent that credential, cookies provide one way to transport it, and the Express server remains responsible for validating identity and enforcing access permissions.
