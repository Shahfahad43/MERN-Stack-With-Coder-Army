# Lecture 16 — Mongoose Working

## 1. What Is Mongoose?

**Mongoose** is an ODM (Object Data Modeling) library for MongoDB and Node.js.

It provides a structured way for a Node.js application to work with MongoDB documents.

The relationship is:

```text
Your Express / Node.js Application
              │
              ▼
          Mongoose
              │
              ▼
       MongoDB Node Driver
              │
              ▼
          MongoDB
              │
              ▼
         Database
```

### Important correction

Mongoose is **not MongoDB itself**.

MongoDB is the database system.

Mongoose is a library that sits between your JavaScript application and MongoDB and provides features such as:

- schemas
- models
- validation
- middleware/hooks
- casting
- convenient CRUD APIs
- document-oriented JavaScript objects

You can use MongoDB **without Mongoose** by using the official MongoDB Node.js driver.

---

# 2. Is MongoDB Schemaless?

You will often hear:

> "MongoDB is schemaless."

This is a useful beginner description, but it needs to be understood correctly.

## What does schemaless mean?

A traditional relational database often defines a schema before inserting data.

For example:

```text
Users table

id
name
age
email
password
```

The database structure is defined beforehand.

MongoDB is more flexible.

Two documents in the same collection can have different fields.

For example:

```js
{
  name: "Fahad",
  age: 22
}
```

and:

```js
{
  name: "Ali",
  city: "Mumbai",
  skills: ["React", "Node.js"]
}
```

Both can exist in the same MongoDB collection.

Therefore, MongoDB's document model is often described as **schema-flexible** or **schemaless**.

---

# 3. "Schemaless" Does NOT Mean "No Structure"

This is extremely important.

Schemaless does **not** mean:

> "Anybody can send anything and MongoDB will blindly accept it."

It means MongoDB does not require one rigid schema to be enforced in the same way a traditional relational table does.

You can still impose structure using:

- application-level validation
- Mongoose schemas
- MongoDB's own schema validation
- indexes
- required fields
- type restrictions
- authentication/authorization

For example, with Mongoose:

```js
const userSchema = new Schema({
  name: String,
  age: Number,
  city: String,
  gender: String,
});
```

Now Mongoose gives your application a defined structure.

So:

```text
MongoDB
→ flexible document model

Mongoose
→ lets you define application-level structure and validation
```

---

# 4. Why Do We Need a Schema?

Imagine you are building Instagram.

A user document might contain:

```text
username
password
profile photo
comments
likes
followers
following
```

Without proper validation, an application might accidentally accept inappropriate or malformed data.

For example:

```js
{
  name: 123456,
  age: "hello",
  email: "not-an-email"
}
```

Or:

```js
{
  comment: "extremely long unwanted content...";
}
```

A schema allows us to define rules.

For example:

```js
const commentSchema = new Schema({
  text: {
    type: String,
    maxlength: 100,
  },
});
```

Now Mongoose can reject a value exceeding the specified maximum.

---

# 5. Important Security Correction

Your lecture mentions:

> "What if a hacker sends dislikes and stores it in the database?"

This is not really a **schema vs hacker** problem.

Suppose your application only allows:

```text
name
email
comment
```

but somebody sends:

```json
{
  "name": "Fahad",
  "email": "x@example.com",
  "isAdmin": true
}
```

A secure application should not blindly trust client input.

There are several layers of protection:

```text
Client
  ↓
Input validation
  ↓
Authentication
  ↓
Authorization
  ↓
Application logic
  ↓
Database validation
  ↓
MongoDB
```

### Very important rule

> **Never trust data sent by the client.**

For example, if a user sends:

```json
{
  "role": "admin"
}
```

your server should not simply store that value.

The server should decide whether that user is actually allowed to have the role.

Schema validation helps with **data shape and validity**, but it is not a complete security system.

---

# 6. Mongoose Schema

A Mongoose schema defines the structure and rules for documents handled through a particular model.

Example:

```js
const userSchema = new Schema({
  name: String,
  city: String,
  age: Number,
  gender: String,
});
```

This says:

```text
name   → String
city   → String
age    → Number
gender → String
```

You can also define more detailed rules:

```js
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    min: 0,
  },

  email: {
    type: String,
    required: true,
  },
});
```

---

# 7. Installing Mongoose

The correct installation command is:

```bash
npm install mongoose
```

or:

```bash
npm i mongoose
```

### Do you also need `mongodb`?

If you are specifically using Mongoose, you normally install:

```bash
npm i mongoose
```

Mongoose itself uses the MongoDB Node.js driver underneath.

You do **not** normally need to separately install `mongodb` just to make Mongoose work.

If you are using the native MongoDB driver directly, then:

```bash
npm i mongodb
```

is appropriate.

Therefore:

```text
Using Mongoose
→ npm i mongoose

Using native MongoDB Node.js driver
→ npm i mongodb
```

---

# 8. MongoDB Driver vs Mongoose

## Native MongoDB Driver

```js
import { MongoClient } from "mongodb";
```

You directly interact with MongoDB through the official driver.

## Mongoose

```js
import mongoose from "mongoose";
```

Mongoose provides another abstraction layer.

Conceptually:

```text
                 Your Application
                        │
              ┌─────────┴─────────┐
              │                   │
          Mongoose          MongoDB Driver
              │                   │
              └─────────┬─────────┘
                        ▼
                     MongoDB
```

Mongoose internally relies on the MongoDB driver for communication.

---

# 9. Creating a Database by Naming It in the URI

Your lecture gives:

```text
mongodb://localhost:27017/Bookstore
```

or an Atlas URI such as:

```text
mongodb+srv://username:password@cluster.mongodb.net/Bookstore
```

Here:

```text
Bookstore
```

is the database name.

### Does MongoDB immediately create the database?

Not necessarily.

Simply connecting and referring to a database does not mean that a persistent database with that name has immediately been created.

MongoDB creates the database when data is first stored in it, or when you explicitly create something such as a collection.

Conceptually:

```text
connect to Bookstore
        ↓
database reference
        ↓
insert first document
        ↓
Bookstore actually exists
```

---

# 10. Database vs Collection vs Document

This hierarchy is extremely important:

```text
MongoDB Server / Deployment
        │
        ▼
     Database
        │
        ▼
    Collection
        │
        ▼
    Documents
```

For your example:

```text
Bookstore
   │
   └── users
         │
         ├── document 1
         ├── document 2
         └── document 3
```

A MongoDB document is similar conceptually to a row in SQL, but documents can contain nested objects and arrays.

---

# 11. Creating a Schema

Your code:

```js
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: String,
  age: Number,
  city: String,
  gender: String,
});
```

Let's understand each part.

### `Schema`

```js
Schema;
```

is Mongoose's schema constructor.

### `new Schema(...)`

```js
new Schema({...})
```

creates a Mongoose schema definition.

### Fields

```js
name: String;
age: Number;
city: String;
gender: String;
```

define the expected types.

---

# 12. Creating a Model

Next:

```js
const User = mongoose.model("User", userSchema);
```

This is one of the most important lines.

You have:

```text
Schema
   ↓
Model
   ↓
MongoDB Collection
```

### Schema

Defines the structure/rules.

```js
userSchema;
```

### Model

Provides the interface you use from JavaScript.

```js
User;
```

### Collection

The actual MongoDB collection where documents are stored.

For example:

```text
users
```

---

# 13. Why Is the Collection Called `users` When We Say `User`?

You specifically asked about this.

You write:

```js
const User = mongoose.model("User", userSchema);
```

but MongoDB shows:

```text
users
```

Why?

Mongoose uses a **collection naming convention**.

By default, Mongoose generally takes the model name:

```text
User
```

and derives a collection name:

```text
users
```

Conceptually:

```text
"User"
   ↓
pluralize
   ↓
"users"
```

For example:

```js
mongoose.model("User", userSchema);
```

usually maps to:

```text
users
```

And:

```js
mongoose.model("Product", productSchema);
```

usually maps to:

```text
products
```

---

# 14. Does Mongoose Always Simply Add `s`?

No.

Do not memorize:

```text
User → User + s
```

as the complete rule.

Mongoose uses a pluralization mechanism, so irregular words can be transformed differently.

For example, the concept is:

```text
Person → people
```

rather than:

```text
persons
```

The exact generated collection name depends on Mongoose's pluralization rules.

---

# 15. How to Explicitly Choose a Collection Name

You don't have to rely on automatic naming.

You can specify it in the schema:

```js
const userSchema = new Schema(
  {
    name: String,
    age: Number,
  },
  {
    collection: "my_users",
  },
);
```

Now Mongoose uses:

```text
my_users
```

as the collection name.

Another option is to specify collection behavior through the model configuration.

---

# 16. Creating a User — Method 1

Your lecture first demonstrates:

```js
const user1 = new User({
  name: "Shah",
  age: 20,
  city: "ICT",
  gender: "male",
});

await user1.save();
```

Let's break this down.

### Step 1

```js
const user1 = new User(...)
```

Creates a Mongoose document object in application memory.

At this point, it is **not necessarily persisted in MongoDB yet**.

### Step 2

```js
await user1.save();
```

Mongoose sends the operation to MongoDB.

Now the document is persisted.

---

# 17. Creating a User — Method 2

Instead of:

```js
const user1 = new User({...});

await user1.save();
```

you can use:

```js
await User.create({
  name: "Ali",
  city: "Mumbai",
  gender: "male",
});
```

This creates and saves the document.

Conceptually:

```text
User.create()
      ↓
Create Mongoose document
      ↓
Validate/cast
      ↓
Send database operation
      ↓
MongoDB
```

---

# 18. Creating Multiple Documents

You can use:

```js
await User.insertMany([
  {
    name: "Ahmad",
    city: "New York",
    age: 20,
  },
  {
    name: "Hamza",
    age: 22,
    city: "Paris",
  },
]);
```

### Important correction to your code

The safer/common form is an **array of documents**:

```js
await User.insertMany([
  {...},
  {...}
]);
```

not:

```js
await User.insertMany(
  {...},
  {...}
);
```

---

# 19. Reading All Users

Your code:

```js
const result = await User.find({});
console.log(result);
```

The empty filter:

```js
{
}
```

means:

> No filtering condition — return documents matching everything.

So:

```js
User.find({});
```

means:

> Find all matching documents.

The result is an array of Mongoose documents.

---

# 20. Finding a Specific User

Your example:

```js
const result = await User.find({
  name: "Shah",
});

console.log(result);
```

This means:

> Find all documents where `name` equals `"Shah"`.

Notice that `find()` returns **multiple documents in an array**, even if only one document matches.

If you specifically want one document, you can use:

```js
const user = await User.findOne({
  name: "Shah",
});
```

---

# 21. `find()` vs `findOne()`

### `find()`

```js
const users = await User.find({
  name: "Shah",
});
```

Result:

```js
[
  {...},
  {...}
]
```

### `findOne()`

```js
const user = await User.findOne({
  name: "Shah",
});
```

Result:

```js
{...}
```

or:

```js
null;
```

if no document is found.

---

# 22. CRUD With Mongoose

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

Your Express application demonstrates all four.

---

# 23. READ Route

```js
app.get("/info", async (req, res) => {
  const result = await User.find({});
  res.send(result);
});
```

Flow:

```text
GET /info
    ↓
Express route
    ↓
User.find({})
    ↓
Mongoose
    ↓
MongoDB
    ↓
Documents
    ↓
Express response
```

---

# 24. CREATE Route

```js
app.post("/info", async (req, res) => {
  console.log(req.body);

  try {
    await User.create(req.body);
    res.send("New user added successfully!");
  } catch (err) {
    res.status(500).send("Error!");
  }
});
```

The client might send:

```json
{
  "name": "Fahad",
  "age": 22,
  "city": "ICT",
  "gender": "male"
}
```

Because you have:

```js
app.use(express.json());
```

Express parses JSON request bodies and puts the resulting JavaScript object into:

```js
req.body;
```

Then:

```js
User.create(req.body);
```

passes that data to Mongoose.

---

# 25. Security Problem With `User.create(req.body)`

This is convenient:

```js
User.create(req.body);
```

but in real applications you should be careful.

Why?

Because the client controls `req.body`.

For example, a malicious client could send:

```json
{
  "name": "Fahad",
  "age": 22,
  "isAdmin": true
}
```

You should not blindly allow clients to decide every field.

A better approach is to select the fields your endpoint is supposed to accept:

```js
const { name, age, city, gender } = req.body;

await User.create({
  name,
  age,
  city,
  gender,
});
```

This is called **allowlisting fields**.

---

# 26. DELETE Route

Your code:

```js
app.delete("/info", async (req, res) => {
  await User.deleteOne({
    name: "Ahmad",
  });

  res.send("User deleted!");
});
```

This searches for a matching document and deletes one matching document.

A more realistic API would usually receive an identifier:

```js
await User.deleteOne({
  _id: req.params.id,
});
```

because names may not be unique.

---

# 27. UPDATE Route

Your code:

```js
app.put("/info", async (req, res) => {
  await User.updateOne({ name: "Shah" }, { age: "32" });

  res.send("User updated successfully!");
});
```

There is an important issue here.

Your schema says:

```js
age: Number;
```

but you are sending:

```js
age: "32";
```

which is a string.

Mongoose has a feature called **casting**, so it may convert compatible values such as `"32"` to the number `32`.

However, it is better to send the correct type:

```js
{
  age: 32;
}
```

Don't rely on implicit conversion when you can send the correct type yourself.

---

# 28. Better Update Example

```js
await User.updateOne({ name: "Shah" }, { $set: { age: 32 } });
```

`$set` explicitly says:

> Set this field to this value.

This is clearer and safer when writing MongoDB update operations.

---

# 29. What Is `__v`?

You noticed:

```text
__v: 0
```

or:

```text
__v: 1
```

This is Mongoose's **version key**.

By default, Mongoose adds a field called:

```text
__v
```

to documents.

Example:

```js
{
  name: "Shah",
  age: 20,
  city: "ICT",
  gender: "male",
  __v: 0
}
```

---

# 30. Is `__v` Simply "How Many Times the Document Was Updated"?

**No.**

This is an important correction to the lecture.

It is tempting to think:

```text
__v = number of updates
```

but that is not an accurate definition.

`__v` is Mongoose's **version key**.

It is associated with Mongoose's document versioning behavior, particularly around certain array/document modifications and versioning mechanisms.

Therefore:

```text
__v = 0
```

does **not simply mean**:

> "The document has never been updated."

And:

```text
__v = 5
```

should not automatically be interpreted as:

> "This document was updated exactly five times."

---

# 31. Why Does Mongoose Have a Version Key?

Mongoose uses the version key as part of its mechanism for tracking document versions in certain situations.

This becomes particularly useful with concurrent modifications and document changes where versioning matters.

For beginner-level understanding:

```text
__v
 ↓
Mongoose version key
 ↓
not simply an update counter
```

Remember this distinction for interviews.

---

# 32. Complete Mongoose Architecture

Your files demonstrate a very useful project structure.

```text
Project
│
├── database.js
│
├── Models/
│    └── users.js
│
└── server.js
```

Each file has a different responsibility.

---

# 33. `database.js`

Your code:

```js
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(
    "mongodb+srv://Shah_Fahad:Fahad123@learningbackend.f4z4wux.mongodb.net/Bookstore",
  );
}

module.exports = main;
```

The responsibility of this file is:

> Establish the MongoDB connection.

It does not define your Express routes.

It does not define your User model.

It handles database connection setup.

---

# 34. `Models/users.js`

Your code:

```js
const mongoose = require("mongoose");

const { Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  city: String,
  age: Number,
  gender: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

Its responsibility is:

```text
Define schema
      ↓
Create model
      ↓
Export model
```

---

# 35. Main Express File

Your server contains:

```js
const main = require("./database");
const User = require("./Models/users");
```

Therefore:

```text
server.js
   │
   ├── gets database connection function
   │
   └── gets User model
```

Then:

```js
main()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
```

---

# 36. Why Start Express Only After MongoDB Connects?

This is a very good pattern.

Your code:

```js
main()
  .then(async () => {
    console.log("Connected Successfully to DB!");

    app.listen(3000, () => {
      console.log("app is listening at 3000");
    });
  })
  .catch((err) => console.log(err));
```

means:

```text
Start application
       ↓
Connect to MongoDB
       ↓
Connection successful?
       │
       ├── YES → Start HTTP server
       │
       └── NO  → Handle error
```

This prevents the application from announcing itself as ready before the database connection has succeeded.

---

# 37. Why Not Do This?

You had:

```js
require("./database.js");
```

and then:

```js
app.listen(3000);
```

This can work depending on how the connection module is written, but it doesn't give you as clean a startup sequence.

The preferred pattern is to explicitly await the database connection:

```js
main()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
```

This makes the startup dependency explicit.

---

# 38. `mongoose.connect()` Is Asynchronous

Your code:

```js
await mongoose.connect(...)
```

connects to MongoDB asynchronously.

Why asynchronous?

Because connecting to a remote database involves network communication.

Conceptually:

```text
Node.js
   │
   │ network request
   ▼
MongoDB Atlas
   │
   │ response
   ▼
Node.js
```

The program should not freeze while waiting for the network.

Therefore:

```js
await
```

allows your asynchronous function to wait for the Promise.

---

# 39. One Important Improvement: Never Hard-Code Your Password

Your lecture code contains:

```text
mongodb+srv://Shah_Fahad:Fahad123@...
```

Do **not** put real database credentials directly in source code.

Instead use an environment variable:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Bookstore
```

Then:

```js
await mongoose.connect(process.env.MONGO_URI);
```

and load environment variables appropriately.

This is especially important when using GitHub.

Never commit your MongoDB password/API keys to a public repository.

---

# 40. The `@` Problem in MongoDB Passwords

If your password contains:

```text
@
```

you cannot always place the raw character directly inside a MongoDB URI because `@` has a structural meaning in the URI.

It must be percent-encoded.

For example:

```text
@
```

becomes:

```text
%40
```

Therefore:

```text
Fahad@12
```

becomes:

```text
Fahad%4012
```

This is called **percent encoding**.

---

# 41. Complete Flow of Your Project

Your complete application works approximately like this:

```text
                    Client
                      │
                HTTP Request
                      │
                      ▼
                   Express
                      │
                req.body/params
                      │
                      ▼
                 Mongoose Model
                      │
              ┌───────┴───────┐
              │               │
          Validation       Casting
              │               │
              └───────┬───────┘
                      │
                      ▼
              MongoDB Driver
                      │
                      ▼
                   MongoDB
                      │
                      ▼
                 Collection
                      │
                      ▼
                  BSON data
```

---

# 42. Schema vs Model vs Collection vs Document

This is one of the most important things to memorize.

| Concept         | Meaning                               |
| --------------- | ------------------------------------- |
| MongoDB         | Database system                       |
| Database        | Container for collections             |
| Collection      | Container for documents               |
| Document        | Individual MongoDB record             |
| BSON            | Binary document representation        |
| Mongoose Schema | Defines structure/rules in Mongoose   |
| Mongoose Model  | JavaScript interface for a collection |
| `User`          | Your Mongoose model                   |
| `users`         | Default MongoDB collection name       |

Mental model:

```text
Schema
   ↓
Model
   ↓
Collection
   ↓
Documents
```

---

# 43. Mongoose vs MongoDB

Do not say:

> "Mongoose is the database."

Correct:

```text
MongoDB
= Database system

Mongoose
= ODM library for Node.js + MongoDB
```

---

# 44. Is Mongoose Required to Use MongoDB?

No.

You can use:

```js
import { MongoClient } from "mongodb";
```

directly.

Or:

```js
import mongoose from "mongoose";
```

with Mongoose.

So:

```text
MongoDB
   │
   ├── Native Node.js Driver
   │
   └── Mongoose
```

---

# 45. Why Do Developers Use Mongoose?

Mongoose provides convenient features such as:

### 1. Schema definitions

```js
name: String;
age: Number;
```

### 2. Validation

```js
required: true;
maxlength: 100;
```

### 3. Casting

```text
"32" → 32
```

when compatible with the schema/type.

### 4. Models

```js
User;
```

### 5. Middleware/hooks

You can execute logic before/after certain operations.

### 6. Convenient CRUD APIs

```js
User.find();
User.create();
User.updateOne();
User.deleteOne();
```

### 7. Relationships through population

Mongoose provides `populate()` for working conveniently with referenced documents.

---

# 46. Mongoose Does Not Make MongoDB Relational

Mongoose adds structure to your application, but MongoDB remains a document database.

You still have:

```text
Database
   ↓
Collections
   ↓
Documents
```

not:

```text
Database
   ↓
Tables
   ↓
Rows
```

---

# 47. Interview Questions

## Q1. What is Mongoose?

Mongoose is an ODM library for Node.js that provides schemas, models, validation, casting, middleware, and convenient APIs for working with MongoDB.

---

## Q2. What does ODM mean?

**Object Data Modeling.**

It provides a way to model database documents as JavaScript objects/models.

---

## Q3. Is MongoDB completely schemaless?

MongoDB is schema-flexible rather than meaning "there can never be a schema."

MongoDB allows documents in a collection to have different structures, while schemas and validation can still be enforced at the application or database level.

---

## Q4. Why use Mongoose if MongoDB is schema-flexible?

To introduce application-level structure, validation, casting, models, middleware, and convenient database operations.

---

## Q5. What is a Mongoose Schema?

A schema defines the expected structure, types, defaults, validation rules, and other configuration for documents handled through a Mongoose model.

---

## Q6. What is a Mongoose Model?

A model is a JavaScript interface created from a schema and associated with a MongoDB collection.

Example:

```js
const User = mongoose.model("User", userSchema);
```

---

## Q7. Why does `User` become `users`?

Mongoose normally derives the collection name from the model name using its pluralization convention.

```text
User → users
```

---

## Q8. Can we specify our own collection name?

Yes.

For example:

```js
const userSchema = new Schema(
  {
    name: String,
  },
  {
    collection: "my_users",
  },
);
```

---

## Q9. What is `__v`?

`__v` is Mongoose's default version key.

It should not simply be described as "the number of times the document has been updated."

---

## Q10. What does `User.create()` do?

It creates a document using the model, performs Mongoose processing such as casting/validation, and saves the document to MongoDB.

---

## Q11. Difference between `new User()` and `User.create()`?

```js
const user = new User({...});
await user.save();
```

creates a document object first and saves it separately.

Whereas:

```js
await User.create({...});
```

combines creation and saving into one convenient operation.

---

## Q12. Difference between `find()` and `findOne()`?

```text
find()
→ returns multiple matching documents

findOne()
→ returns one matching document or null
```

---

## Q13. What does `{}` mean in `User.find({})`?

It means there is no filter condition, so the query matches all documents in the collection.

---

## Q14. Why use `await` with Mongoose operations?

Database operations are asynchronous and return Promises. `await` waits for the Promise to settle inside an async function.

---

## Q15. Why shouldn't we blindly use `User.create(req.body)`?

Because the client controls the request body. The server should validate and allowlist fields instead of blindly trusting client input.

---

## Q16. Is schema validation enough for security?

No.

Security also requires:

- authentication
- authorization
- input validation
- safe field handling
- proper database permissions
- secure credential management

---

## Q17. Does Mongoose replace MongoDB?

No.

Mongoose is a library that works with MongoDB.

---

## Q18. Can we use MongoDB without Mongoose?

Yes. Node.js can communicate directly with MongoDB using the official MongoDB driver.

---

## Q19. What happens when you use `/Bookstore` in the MongoDB connection URI?

It specifies `Bookstore` as the database name. The persistent database is created when data or database objects are actually created, rather than merely because the name appears in the URI.

---

## Q20. Why should MongoDB credentials be stored in environment variables?

Because hard-coding credentials can expose them through source code, Git history, repositories, logs, or deployments.

---

# 48. The 10 Things You Should Memorize

```text
1. MongoDB = database system

2. MongoDB is schema-flexible

3. Schemaless ≠ no validation or no structure

4. Mongoose = ODM for Node.js + MongoDB

5. Schema = structure/rules

6. Model = JavaScript interface associated with a collection

7. User model → users collection by default

8. Document = MongoDB record

9. __v = Mongoose version key, not simply update count

10. User.create()/find()/updateOne()/deleteOne()
    are convenient Mongoose CRUD operations
```

# Final Mental Model

```text
                 Your Client
                     │
                     ▼
                  Express
                     │
              HTTP Request
                     │
                     ▼
                  Mongoose
                     │
        ┌────────────┼────────────┐
        │            │            │
      Schema       Model       Validation
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
             MongoDB Node Driver
                     │
                     ▼
                  MongoDB
                     │
              ┌──────┴──────┐
              │             │
          Database        Collection
              │             │
              │          Documents
              │             │
              │           BSON
              │
           Bookstore
              │
            users
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
     User    User   User
```

### The core idea

**MongoDB gives you a flexible document database. Mongoose lets your Node.js application impose a convenient structure and rules on that flexible database through Schemas and Models.**

Your application's path is:

```text
Request
   ↓
Express
   ↓
Mongoose Model
   ↓
Schema validation/casting
   ↓
MongoDB Driver
   ↓
MongoDB
   ↓
BSON Documents
```
