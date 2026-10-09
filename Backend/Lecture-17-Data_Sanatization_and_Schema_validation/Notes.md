# Lecture 17 — Data Sanitization and Schema Validation

## 1. What is data sanitization?

**Data sanitization** means cleaning or normalizing input data so that it follows the expected format before your application processes or stores it.

Examples:

| Input received        | Sanitized result      |
| --------------------- | --------------------- |
| `"  Fahad  "`         | `"Fahad"`             |
| `"FAHAD@EXAMPLE.COM"` | `"fahad@example.com"` |
| `"  Hello  "`         | `"Hello"`             |

In Mongoose, you can perform some basic sanitization directly through schema options:

```js
email: {
  type: String,
  trim: true,
  lowercase: true
}
```

- `trim: true` removes whitespace from the beginning and end.
- `lowercase: true` converts a string to lowercase.

**Important:** Sanitization and validation are different. Sanitization changes or normalizes data; validation checks whether it is acceptable.

Also, trimming or lowercasing does not protect an application from every type of attack. Security requires context-specific handling of input and output.

## 2. Why do we need sanitization and validation?

Suppose someone submits this registration request:

```json
{
  "firstName": "",
  "age": 200,
  "gender": "SuperAdmin",
  "email": "NOT-AN-EMAIL"
}
```

Your application should not accept this data blindly.

The main reasons for sanitization and validation are:

1. **Data integrity:** Store data that follows the rules of your application.
2. **Security:** Prevent unauthorized fields and invalid values from being accepted.
3. **Consistency:** Store email addresses in a consistent format.
4. **Better user experience:** Return clear errors before users wait for unnecessary database operations.
5. **Reduced unnecessary database work:** Reject obviously invalid requests before querying or writing to MongoDB.

One distinction matters: validation is not a replacement for authentication, authorization, or secure password handling.

## 3. API-level validation vs schema validation

These work together, but they serve different purposes.

| API-level validation                                       | Mongoose schema validation                                |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| Runs in your API/request-handling layer                    | Runs through the Mongoose model                           |
| Checks whether the request is acceptable                   | Checks document fields against schema rules               |
| Can reject malformed IDs and invalid request formats early | Checks rules such as `required`, `min`, `max`, and `enum` |
| Can validate business rules and allowed request fields     | Helps enforce consistent document structure               |

Example:

```text
Client sends request
        ↓
API-level validation
        ↓
Request acceptable?
   ┌────┴────┐
  No        Yes
   ↓          ↓
Return 400   Mongoose validation
                  ↓
             MongoDB operation
```

**Why API-level validation?** It can reject invalid requests before they trigger unnecessary database work. However, some checks—such as whether an email is already registered—require a database query.

---

## 4. The most important Mongoose schema validators

Your schema contains several useful validation and sanitization options.

### A. `required`

Makes a field mandatory.

```js
firstName: {
  type: String,
  required: true
}
```

If the field is missing, Mongoose validation fails when it validates the document.

You can also customize the error message:

```js
firstName: {
  type: String,
  required: [true, "First name is required"]
}
```

Remember: `required: true` does not mean every possible string is meaningful. For example, you may also want to reject empty or whitespace-only strings at the API layer.

### B. `min` and `max`

These apply to numeric values.

```js
age: {
  type: Number,
  min: 15,
  max: 70
}
```

This means:

```text
age >= 15
age <= 70
```

Examples:

- `age: 25` — valid.
- `age: 10` — invalid.
- `age: 80` — invalid.

These are validators, not automatic checks of a person's real-world age.

### C. `enum`

Restricts a field to a list of permitted values.

Your lecture's gender field should use `enum` rather than the incorrect custom validator shown in the original code.

```js
gender: {
  type: String,
  enum: ["Male", "Female", "Other"]
}
```

If the client sends:

```json
{
  "gender": "SuperAdmin"
}
```

Mongoose rejects the value during validation.

An enum is useful for fields such as:

- account status
- order status
- permitted categories
- user roles, when the allowed values are fixed

**Security note:** An enum alone does not establish whether the current user is authorized to assign a particular role.

### D. `trim`

Removes whitespace from both ends of a string.

```js
firstName: {
  type: String,
  trim: true
}
```

Input:

```text
"  Fahad  "
```

Result:

```text
"Fahad"
```

It does not remove every space inside the string.

### E. `lowercase`

Converts strings to lowercase.

```js
email: {
  type: String,
  lowercase: true
}
```

Input:

```text
"FAHAD@EXAMPLE.COM"
```

Result:

```text
"fahad@example.com"
```

### F. `maxlength` and `minlength`

These apply to strings.

```js
comment: {
  type: String,
  minlength: 2,
  maxlength: 100
}
```

This limits the string length to between 2 and 100 characters.

Note: This is a character limit, not a word limit. If your requirement is specifically 100 words, you need a separate word-count rule.

### G. `match`

Validates a string against a regular expression.

```js
email: {
  type: String,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}
```

This provides a basic email-format check, not a guarantee that the address exists or belongs to the user. Production applications may need stronger validation and email verification.

### H. Custom `validate`

Use this when built-in validators cannot express your rule.

```js
username: {
  type: String,
  validate: {
    validator: function (value) {
      return /^[a-zA-Z0-9_]+$/.test(value);
    },
    message: "Username can contain only letters, numbers, and underscores"
  }
}
```

The validator should return `true` for a valid value and `false` for an invalid value. Mongoose then creates the validation error.

---

## 5. Important bug in your `gender` validator

Your original code was:

```js
validate: () => {
  !["Male", "Female", "Other"];
  throw new Error("Invalid Gender");
};
```

This is incorrect for two reasons:

1. `!["Male", "Female", "Other"]` does not check the submitted gender. It negates an array, which is truthy, producing `false`.
2. The function always throws an error, so it rejects every value when the validator runs.

Use this instead:

```js
gender: {
  type: String,
  enum: ["Male", "Female", "Other"]
}
```

For custom rules, prefer a validator that returns a Boolean.

---

## 6. What does `unique: true` mean?

Your schema uses:

```js
email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true
}
```

The important distinction is:

**`unique: true` is not a Mongoose validator.** It tells MongoDB to create a unique index, which prevents duplicate indexed values.

For example, two accounts cannot normally have the same indexed email value.

But this has important consequences:

- The index must exist for the uniqueness guarantee to apply.
- A duplicate may produce a MongoDB duplicate-key error, often with code `11000`, rather than a normal Mongoose validation error.
- Checking whether an email already exists before inserting is useful for user experience, but it does not replace the unique index. Two requests can race.

A robust registration endpoint handles both cases.

---

## 7. `timestamps: true`

Your schema includes:

```js
{
  timestamps: true;
}
```

Mongoose automatically manages two date fields:

```js
createdAt;
updatedAt;
```

- `createdAt` records when the document was created.
- `updatedAt` records when the document was last updated through supported Mongoose operations.

For example:

```js
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
```

A stored document may look like:

```js
{
  firstName: "Fahad",
  createdAt: new Date("2026-10-09T07:00:00Z"),
  updatedAt: new Date("2026-10-09T07:00:00Z")
}
```

The dates above are illustrative.

When the document is subsequently updated through a supported operation, Mongoose updates `updatedAt` automatically. `createdAt` is normally immutable.

Official reference: [Mongoose timestamps documentation](https://mongoosejs.com/docs/timestamps.html). <Cite refs={["turn572411search0"]} />

---

## 8. Corrected `user.js`

This version retains the important fields from your lecture and corrects the gender validator. It also uses a string for the phone number, because phone numbers are identifiers rather than quantities used for arithmetic.

```js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    age: {
      type: Number,
      min: [15, "Age must be at least 15"],
      max: [70, "Age cannot exceed 70"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email format",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### Important password correction

This schema validates the password's length, but it does **not** make the password safe to store.

Never store a plain-text password. Hash it using a suitable password-hashing algorithm, such as Argon2id or bcrypt, before saving it. Also, never return password hashes in ordinary API responses.

---

## 9. Update validation: `runValidators: true`

Your lecture contains:

```js
await User.findByIdAndUpdate(_id, update, { runValidators: true });
```

This is important because Mongoose update validators are **off by default** for operations such as `findByIdAndUpdate()`.

Without `runValidators: true`, an update can bypass schema validation rules that you expected to apply.

However, update validation has limitations: it generally validates updated paths rather than revalidating every field in the entire document. Certain update operators also have special behavior.

Official reference: [Mongoose validation documentation](https://mongoosejs.com/docs/validation.html). <Cite refs={["turn572411search1","turn572411search2"]} />

---

## 10. Important route bug: duplicate route patterns

Your code has these two routes:

```js
app.get("/info/:name", ...);

app.get("/info/:id", ...);
```

Both routes match a URL such as:

```text
/info/Fahad
```

Express does not distinguish them based on the parameter name. Both patterns have the same structure.

Consequently, the first matching route handles the request; the second route is not automatically selected because its parameter is named `id`.

Use distinct paths instead:

```js
app.get("/info/name/:name", async (req, res) => {
  // Find user by name
});

app.get("/info/id/:id", async (req, res) => {
  // Find user by ID
});
```

You should also validate that an ID has a valid MongoDB ObjectId format before querying by it.

---

## 11. API-level validation: practical example

Your current registration route calls:

```js
await User.create(req.body);
```

Mongoose can reject schema-invalid data, but the API should first check the request and decide which fields the client is allowed to submit.

For example:

```js
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, age, gender, phoneNumber, email, password } =
      req.body;

    if (
      typeof firstName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "First name, email, and password must be strings",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      phoneNumber,
      email,
      password,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        error: "Email or phone number already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
```

This example illustrates the layers, but a production registration route must also hash the password before calling `User.create()`, validate all expected fields and types, and handle duplicate-key errors carefully.

### Why use appropriate HTTP status codes?

| Status                      | Typical use                                         |
| --------------------------- | --------------------------------------------------- |
| `201 Created`               | Registration succeeded                              |
| `400 Bad Request`           | Request data is invalid                             |
| `404 Not Found`             | Requested user does not exist                       |
| `409 Conflict`              | Email or phone number conflicts with a unique index |
| `500 Internal Server Error` | Unexpected server-side failure                      |

Avoid returning every error as status `200` or `500`. Clients should be able to distinguish invalid input, conflicts, missing records, and server failures.

---

## 12. Important interview questions

**Q1. What is the difference between sanitization and validation?**

Sanitization normalizes or cleans input. Validation checks whether it satisfies defined rules.

**Q2. What is API-level validation?**

Checking request data in the API layer before carrying out database operations or business logic.

**Q3. Why do we need schema validation if we already validate the API request?**

It provides another layer of protection for documents handled through Mongoose, including code paths other than a particular HTTP endpoint. It does not replace validation for every security or business rule.

**Q4. Is `unique: true` a validator?**

No. It requests a unique MongoDB index.

**Q5. Why is `runValidators: true` important?**

Mongoose update validators are off by default for common update operations. This option enables them, subject to update-validator limitations.

**Q6. What is the purpose of `trim` and `lowercase`?**

They normalize strings by removing surrounding whitespace and converting letters to lowercase.

**Q7. What does `timestamps: true` do?**

It adds and maintains `createdAt` and `updatedAt` through supported Mongoose operations.

**Q8. Is a valid schema enough to prevent hackers?**

No. You also need authentication, authorization, safe input handling, password hashing, appropriate database permissions, and other security controls.

---

## Final revision checklist

- [ ] Know the difference between sanitization and validation.
- [ ] Memorize `required`, `min`, `max`, `enum`, `minlength`, `maxlength`, and `match`.
- [ ] Understand `trim` and `lowercase`.
- [ ] Remember that `unique: true` creates a unique index; it is not a validator.
- [ ] Understand `timestamps: true`.
- [ ] Remember `runValidators: true` for Mongoose update operations.
- [ ] Validate incoming requests before database work when possible.
- [ ] Never trust client-supplied fields such as `isAdmin` or `role`.
- [ ] Hash passwords before storing them.
- [ ] Return appropriate HTTP status codes and avoid exposing sensitive error details.
- [ ] Use different Express route patterns for different parameter meanings.
