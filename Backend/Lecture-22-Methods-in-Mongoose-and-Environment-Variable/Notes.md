# Backend Development Notes: Mongoose Methods, Environment Variables, and Express Router

Node.js · Express.js · MongoDB · Mongoose · Application Configuration · Backend Architecture

These notes explain the concepts from the ground up, including why they exist, what problems they solve, how to use them in practical projects, and what you should understand for interviews.

# Part 1 — Mongoose Methods

## 1. What is Mongoose?

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.

MongoDB stores data in documents, which resemble JavaScript objects. Mongoose provides a structured way to define those documents, validate data, interact with the database, and organize database operations.

For example, suppose you are building a student management application. You need to store each student's name, email, age, and password hash.

Without Mongoose, you can use the MongoDB driver directly. With Mongoose, you can define a schema and model that help you manage the data consistently.

```
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const Student = mongoose.model("Student", studentSchema);
```

Here:

- `mongoose.Schema()` defines the expected structure of a document.
- `studentSchema` describes the fields and their types.
- `mongoose.model()` creates a model used to interact with the corresponding MongoDB collection.
- `Student` provides methods for creating, finding, updating, and deleting student documents.

## 2. What are methods in Mongoose?

A method is a function associated with an object or model that performs a particular operation.

In Mongoose, the term "methods" can refer to several related concepts:

### 1. Model methods

Operate on a model or query a collection.

Examples: `Student.find()`, `Student.findOne()`, `Student.create()`.

### 2. Document methods

Operate on an individual document.

Examples: `student.save()`, `student.deleteOne()`, `student.toObject()`.

### 3. Instance methods you define

Custom functions attached to individual documents.

Example: `student.getDisplayName()`.

### 4. Static methods you define

Custom functions attached to the model itself.

Example: `Student.findByEmail()`.

A common beginner mistake is assuming that all Mongoose methods do the same thing. They do not. Some retrieve data, some modify it, some validate it, and others persist changes to MongoDB.

## 3. Why do we need Mongoose methods?

Imagine you want to find a student whose email is `student@example.com`.

You could write database logic repeatedly throughout your application. However, as your project grows, this creates duplication and makes code harder to maintain.

Mongoose methods provide a consistent interface for database operations.

For example:

```
const student = await Student.findOne({
  email: "student@example.com"
});
```

This line asks Mongoose to find a document matching the email address.

The alternative is not necessarily impossible or wrong: you could use the native MongoDB driver instead. Mongoose methods are useful because they provide an abstraction layer, schema-aware behavior, and convenient APIs.

### What if we do not use Mongoose methods?

There are two different meanings to this question.

Case A: You do not use a particular Mongoose method.

You can often use another method or a different approach.

For example, instead of `Student.create()`, you can construct a document and call `save()`:

```
const student = new Student({
  name: "Ali",
  email: "ali@example.com",
  age: 20
});

await student.save();
```

This creates and saves a document without using `Student.create()`.

Case B: You do not use Mongoose at all.

You can still communicate with MongoDB through the native MongoDB Node.js driver. However, you will not get Mongoose's schema and model APIs. You may need to implement more validation, structure, and data-handling logic yourself.

Important: Mongoose is optional. It is a tool that simplifies database interaction; it is not the database itself.

## 4. Understanding a Mongoose schema and model

Consider this example:

```
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 5
  }
});

const Student = mongoose.model(
  "Student",
  studentSchema
);
```

Let's separate the concepts.

| Concept    | Meaning                                                      |
| ---------- | ------------------------------------------------------------ |
| Schema     | Defines the expected structure and behavior of documents     |
| Model      | Provides an interface for querying and changing a collection |
| Document   | An individual record represented as a Mongoose document      |
| Collection | A MongoDB grouping of documents                              |
| Field      | A property such as `name`, `email`, or `age`                 |

### How the relationship works

Schema

Defines fields, types, and validation rules

Model: `Student`

Provides database methods

MongoDB collection

Stores the actual documents

The model gives your JavaScript code a convenient way to work with the database.

Note that `unique: true` is not ordinary Mongoose validation. It requests a unique index, and duplicate values can still cause a MongoDB duplicate-key error. You should handle that error in your application.

## 5. The most commonly used Mongoose methods

We will use the same `Student` model throughout these examples.

### A. `Model.create()` — create a new document

Use this method when you want to insert a new record.

```
const student = await Student.create({
  name: "Ali",
  email: "ali@example.com",
  age: 20
});

console.log(student);
```

What happens?

1. You provide the document's data.
2. Mongoose creates a document.
3. Mongoose applies applicable schema casting and validation.
4. Mongoose saves the document to MongoDB.
5. The created document is returned.

Use `create()` when you want a straightforward way to create and save a document.

### B. `Model.find()` — find multiple documents

```
const students = await Student.find();

console.log(students);
```

This retrieves all documents matching the query. With no filter, it can retrieve the entire collection, which may be expensive for a large collection.

You can provide a condition:

```
const students = await Student.find({
  age: { $gte: 18 }
});
```

This finds students whose age is greater than or equal to 18.

Other useful query operators include:

| Operator | Meaning                       | Example                          |
| -------- | ----------------------------- | -------------------------------- |
| `$gt`    | Greater than                  | `{ age: { $gt: 18 } }`           |
| `$gte`   | Greater than or equal to      | `{ age: { $gte: 18 } }`          |
| `$lt`    | Less than                     | `{ age: { $lt: 25 } }`           |
| `$lte`   | Less than or equal to         | `{ age: { $lte: 25 } }`          |
| `$in`    | Matches one of several values | `{ age: { $in: [18, 20, 22] } }` |

### C. `Model.findOne()` — find one matching document

```
const student = await Student.findOne({
  email: "ali@example.com"
});
```

This returns the first matching document or `null` if no document matches.

It is useful for login operations, checking whether an email exists, or retrieving a particular record using a unique field.

For example:

```
const existingStudent = await Student.findOne({
  email: req.body.email
});

if (existingStudent) {
  return res.status(409).json({
    message: "Email already registered"
  });
}
```

This check is useful, but the database should also enforce email uniqueness where required because two simultaneous requests could otherwise pass the check.

### D. `Model.findById()` — find by document ID

```
const student = await Student.findById(
  req.params.id
);
```

This finds a document using its MongoDB `_id`.

It is similar to:

```
const student = await Student.findOne({
  _id: req.params.id
});
```

The dedicated `findById()` method is more expressive when the purpose is to find a document by its ID.

If the ID is invalid, Mongoose may throw a casting error. If it is valid but no document exists, the result is `null`.

### E. `Document.save()` — save a document

Suppose you retrieve a student and want to change the student's age.

```
const student = await Student.findById(studentId);

if (!student) {
  throw new Error("Student not found");
}

student.age = 21;

await student.save();
```

The assignment changes the document in memory. Calling `save()` persists the change to MongoDB.

This is different from merely writing:

```
student.age = 21;
```

That assignment alone does not save the modification to the database.

`save()` is especially useful when you need document validation, middleware hooks, or document-level logic.

### F. `Model.updateOne()` — update one matching document

```
const result = await Student.updateOne(
  { email: "ali@example.com" },
  { $set: { age: 21 } }
);
```

This updates one matching document.

The result includes information such as how many documents matched and how many were modified.

For example:

```
console.log(result.matchedCount);
console.log(result.modifiedCount);
```

Important: `updateOne()` does not return the updated document by default. It returns an update-result object.

Also, update validators are not enabled by default for every update operation. Use `{ runValidators: true }` when you need applicable schema validators to run.

### G. `Model.findOneAndUpdate()` — find and update one document

```
const student = await Student.findOneAndUpdate(
  { email: "ali@example.com" },
  { $set: { age: 22 } },
  {
    new: true,
    runValidators: true
  }
);
```

Here:

- The first argument identifies the document.
- The second argument describes the update.
- `new: true` returns the updated document in common Mongoose versions.
- `runValidators: true` enables applicable update validators.

In current Mongoose versions, `returnDocument: "after"` is another explicit option for requesting the updated document.

Use this method when you want to update a record and obtain the resulting document in the same operation.

### H. `Model.deleteOne()` — delete one document

```
const result = await Student.deleteOne({
  email: "ali@example.com"
});

console.log(result.deletedCount);
```

This deletes one matching document.

If no document matches, `deletedCount` is normally `0`.

Deletion is permanent unless you have a separate recovery mechanism, such as backups or soft deletion.

### I. `Model.findByIdAndDelete()` — delete by ID

```
const deletedStudent =
  await Student.findByIdAndDelete(studentId);
```

This deletes the document identified by the supplied ID and returns the deleted document, or `null` if none exists.

This is convenient for an endpoint such as:

```
DELETE /students/:id
```

Before deleting a document, your application must verify that the requester is authorized to delete it.

### J. `Model.countDocuments()` — count matching documents

```
const totalStudents =
  await Student.countDocuments();

const adultStudents =
  await Student.countDocuments({
    age: { $gte: 18 }
  });
```

This returns the number of documents matching the filter.

It is useful for dashboards, statistics, and pagination.

### K. `Query.sort()` and `Query.limit()` — sort and limit results

```
const students = await Student.find()
  .sort({ age: -1 })
  .limit(10);
```

- `.sort({ age: -1 })` sorts by age in descending order.
- `.sort({ age: 1 })` sorts in ascending order.
- `.limit(10)` restricts the result to at most 10 documents.

These are query methods chained onto a Mongoose query.

### L. `Query.select()` — choose which fields to return

```
const students = await Student.find()
  .select("name email age");
```

This selects only the requested fields.

For example, to exclude a password hash:

```
const user = await User.findById(userId)
  .select("-password");
```

Field projection helps reduce unnecessary data exposure. It does not replace authorization checks.

### M. `Document.deleteOne()` — delete an individual document

```
const student = await Student.findById(studentId);

if (student) {
  await student.deleteOne();
}
```

This is a document-level method, whereas `Model.deleteOne()` performs a query-based deletion.

The distinction becomes important when working with document middleware and custom document behavior.

## 6. Quick reference: Mongoose methods

| Method                      | Main purpose                 | Typical return                |
| --------------------------- | ---------------------------- | ----------------------------- |
| `Model.create()`            | Create and save documents    | Created document or documents |
| `Model.find()`              | Find multiple documents      | Array of documents            |
| `Model.findOne()`           | Find one matching document   | Document or `null`            |
| `Model.findById()`          | Find by `_id`                | Document or `null`            |
| `Document.save()`           | Save document changes        | Saved document                |
| `Model.updateOne()`         | Update one matching document | Update-result object          |
| `Model.findOneAndUpdate()`  | Find and update              | Document or `null`            |
| `Model.deleteOne()`         | Delete one matching document | Delete-result object          |
| `Model.findByIdAndDelete()` | Delete by `_id`              | Deleted document or `null`    |
| `Model.countDocuments()`    | Count matching documents     | Number                        |
| `Query.sort()`              | Sort query results           | Query                         |
| `Query.limit()`             | Limit query results          | Query                         |
| `Query.select()`            | Select fields                | Query                         |

These are not all the methods Mongoose provides. They are among the most useful for everyday CRUD operations.

CRUD stands for Create, Read, Update, Delete.

## 7. Custom instance methods in Mongoose

Mongoose also allows you to define your own methods on documents.

Suppose you want each student document to provide a method that generates a display name.

```
const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
});

studentSchema.methods.getDisplayName = function () {
  return `${this.firstName} ${this.lastName}`;
};

const Student = mongoose.model(
  "Student",
  studentSchema
);
```

Now use it:

```
const student = await Student.findOne({
  email: "ali@example.com"
});

console.log(student.getDisplayName());
```

If the first name is `Ali` and the last name is `Khan`, the result is:

```
Ali Khan
```

### Why use a custom instance method?

It organizes behavior related to an individual document.

Instead of repeatedly writing:

```
`${student.firstName} ${student.lastName}`
```

throughout your application, you can call:

```
student.getDisplayName()
```

This improves consistency and makes the code more expressive.

Important: Define schema methods before compiling the model with `mongoose.model()`.

Use regular functions when you need `this` to refer to the current document. Arrow functions do not have their own `this` binding.

## 8. Custom static methods in Mongoose

A static method belongs to the model rather than an individual document.

For example, you may want a reusable method for finding a student by email.

```
studentSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const Student = mongoose.model(
  "Student",
  studentSchema
);
```

Use it like this:

```
const student = await Student.findByEmail(
  "ali@example.com"
);
```

Notice the difference:

- `student.getDisplayName()` is called on a document.
- `Student.findByEmail()` is called on the model.

Static methods are useful for reusable model-level operations. However, avoid creating a custom method for every trivial query unless it improves clarity or provides reusable behavior.

# Part 2 — Environment Variables in Node.js

## 9. What are environment variables?

An environment variable is a named value provided to a running program by its execution environment.

A Node.js application can read these values through:

```
process.env
```

For example:

```
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
```

If the environment provides these variables, Node.js can access their values.

Environment variables are commonly used to configure an application without hardcoding settings directly into the source code.

### Example: Hardcoding versus environment variables

Suppose your Express server uses port `3000`.

You could write:

```
app.listen(3000);
```

This works, but changing the port requires modifying the code.

Alternatively:

```
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Now the port can be changed through the environment without changing the application code.

This is useful when you run the same project on your laptop, in a testing environment, and on a production server.

## 10. Where do environment variables come from?

Environment variables do not have to come from a `.env` file.

They can be supplied by:

- The operating system.
- A terminal or shell.
- A deployment platform.
- A Docker container.
- A CI/CD pipeline.
- A secrets manager.
- A local `.env` file loaded by a package such as `dotenv`.

A `.env` file is simply one convenient way to define environment variables during development.

### Example `.env` file

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/studentDB
JWT_SECRET=replace_with_a_long_random_secret
```

These are illustrative development settings. The secret is a placeholder and should be replaced with a securely generated value.

### How to load the `.env` file

Install the package:

```
npm install dotenv
```

Then, at the beginning of your application's entry file:

```
require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Load the variables before importing modules that need them.

In supported modern Node.js versions, environment files can also be loaded using Node.js's built-in `--env-file` option. Therefore, `dotenv` is a common approach, not the only approach.

## 11. Are environment variables used only for security?

No. Security is an important use, but environment variables have several purposes.

1\. Sensitive configuration

Examples: database credentials, JWT signing secrets, API keys, and other credentials.

These values should be protected and should not be committed to a public repository.

2\. Application configuration

Examples: server port, log level, pagination defaults, feature flags, and timeouts.

3\. Selecting external services

Examples: database connection strings, Redis addresses, email service configuration, and external API endpoints.

4\. Different deployment environments

The same code can run with different settings in development, testing, staging, and production.

5\. Deployment and automation

Build pipelines and hosting platforms can provide configuration values without requiring source-code changes.

## 12. Common environment variables in a backend project

| Variable               | Purpose                                 | Example             |
| ---------------------- | --------------------------------------- | ------------------- |
| `PORT`                 | Server listening port                   | `3000`              |
| `NODE_ENV`             | Application environment                 | `development`       |
| `MONGODB_URI`          | MongoDB connection string               | Local or hosted URI |
| `JWT_SECRET`           | JWT signing secret                      | Secure random value |
| `ACCESS_TOKEN_SECRET`  | Access-token signing secret             | Secure random value |
| `REFRESH_TOKEN_SECRET` | Signing secret if refresh JWTs are used | Secure random value |
| `LOG_LEVEL`            | Logging verbosity                       | `info`              |
| `REDIS_URL`            | Redis connection address                | Local or hosted URI |

You do not need every variable in every project.

For example, if refresh tokens are opaque random strings rather than JWTs, you may not need a `REFRESH_TOKEN_SECRET`.

### Why separate development and production settings?

Imagine your local database is:

```
mongodb://127.0.0.1:27017/studentDB
```

Your production database might be hosted remotely.

You should not need to rewrite the database connection code to deploy the application. Instead, the same code reads `MONGODB_URI` from the environment, and each environment supplies the appropriate value.

## 13. Accessing environment variables in a Mongoose project

Consider your database connection file.

```
require("dotenv").config();

const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}

module.exports = connectDB;
```

The connection string is not hardcoded into the database logic.

A more robust version validates the configuration:

```
require("dotenv").config();

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(uri);

  console.log("Connected to MongoDB");
}

module.exports = connectDB;
```

This produces a clear error when the required configuration is missing instead of attempting a connection with an undefined value.

### Important security practices

- Add `.env` to `.gitignore`.
- Never commit real passwords, API keys, or signing secrets.
- Use your hosting platform's environment-variable or secrets-management facility in production.
- Validate required variables at application startup.
- Rotate secrets if they are exposed.
- Remember that environment variables are not automatically encrypted. Other processes or people with sufficient access to the environment may be able to read them.

Example `.gitignore` entry:

```
.env
.env.*
!.env.example
```

An `.env.example` file can document the required variable names without containing actual credentials.

## 14. Environment variables versus hardcoded values

| Hardcoded value                                   | Environment variable                             |
| ------------------------------------------------- | ------------------------------------------------ |
| Written directly in the source code               | Supplied through the runtime environment         |
| Requires code changes to change the value         | Can be changed without changing application code |
| Can accidentally expose secrets in source control | Can reduce that risk when properly managed       |
| May make deployments less flexible                | Supports environment-specific configuration      |

One subtle point: not every value should be an environment variable. A fixed business rule or application constant can appropriately remain in code. Environment variables are most useful for configuration that changes between deployments or should be supplied externally.

# Part 3 — Express Router in Detail

## 15. What is Express Router?

`express.Router()` creates a modular routing object in Express.

It lets you group related routes into separate files and mount those routes into the main application.

For example, imagine you are building a student management API with these endpoints:

```
POST   /students/register
POST   /students/login
GET    /students/me
PATCH  /students/me
DELETE /students/me

GET    /courses
GET    /courses/:id
POST   /courses
DELETE /courses/:id
```

If you write every route in one `index.js` file, that file may eventually contain hundreds or thousands of lines.

Express Router lets you organize the application into modules, such as:

- `studentRoutes.js`
- `courseRoutes.js`
- `adminRoutes.js`

Each file contains routes related to a particular part of the application.

Key idea: Express Router helps organize routing logic. It does not create a separate server or automatically create authentication and authorization.

## 16. Why do we need Express Router?

### Without Express Router

You might put everything into one file:

```
const express = require("express");
const app = express();

app.use(express.json());

app.post("/students/register", registerStudent);
app.post("/students/login", loginStudent);
app.get("/students/me", getMyProfile);

app.get("/courses", getCourses);
app.get("/courses/:id", getCourseById);

app.listen(3000);
```

This is perfectly valid for a small project. Express does not require routers.

However, as the project grows, a single file can become difficult to navigate and maintain.

### With Express Router

You can separate routes into dedicated files:

```
project/
├── index.js
├── routes/
│   ├── studentRoutes.js
│   └── courseRoutes.js
├── controllers/
│   ├── studentController.js
│   └── courseController.js
├── Models/
│   ├── student.js
│   └── course.js
└── database.js
```

Now each file has a clearer responsibility.

- `index.js` configures the application and mounts routers.
- `routes/` defines endpoint paths and their middleware.
- `controllers/` handles request logic.
- `Models/` defines database schemas and models.
- `database.js` establishes the database connection.

This structure is an organizational choice, not a mandatory Express convention.

## 17. How does Express Router work?

Client request

Example: `GET /students/me`

Main Express application

Receives the request and matches mounted middleware and routers

Student router

Matches the `/me` route under the `/students` prefix

Route middleware and handler

Authenticate the request, execute the controller, and return a response

The important detail is that a router can be mounted at a prefix.

For example:

```
app.use("/students", studentRouter);
```

If the router defines:

```
studentRouter.get("/me", getMyProfile);
```

The full endpoint becomes:

```
GET /students/me
```

The prefix `/students` comes from the main application, while `/me` comes from the router.

## 18. Creating your first Express Router

### Step 1: Create a routes directory

Create this structure:

```
project/
├── index.js
└── routes/
    └── studentRoutes.js
```

### Step 2: Define the router

Inside `routes/studentRoutes.js`:

```
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("All students");
});

router.get("/:id", (req, res) => {
  res.send(`Student ID: ${req.params.id}`);
});

router.post("/", (req, res) => {
  res.status(201).json({
    message: "Student created"
  });
});

module.exports = router;
```

Let's understand the important parts.

- `express.Router()` creates a router.
- `router.get()` defines a GET route.
- `router.post()` defines a POST route.
- `req.params.id` reads the `id` path parameter.
- `module.exports = router` makes the router available to other files.

The POST example only returns a response. It does not actually save a student to MongoDB yet.

### Step 3: Mount the router in `index.js`

```
const express = require("express");
const app = express();

const studentRouter =
  require("./routes/studentRoutes");

app.use(express.json());

app.use("/students", studentRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

Now the routes become:

| Method | Full endpoint   | Result                       |
| ------ | --------------- | ---------------------------- |
| `GET`  | `/students`     | Returns all students         |
| `GET`  | `/students/123` | Returns the example ID `123` |
| `POST` | `/students`     | Returns a creation message   |

Try these routes in Postman, an API client, or your browser for the GET endpoints.

## 19. What happens if you do not use Express Router?

Nothing is automatically broken.

You can define all routes directly on `app`:

```
app.get("/students", getStudents);
app.get("/students/:id", getStudentById);
app.post("/students", createStudent);
```

This works.

The problem is mainly about maintainability as the project grows.

Without routers, you may experience:

- Large and difficult-to-navigate files.
- Route definitions mixed with unrelated features.
- Repeated middleware configuration.
- More difficult testing and code ownership.
- Harder separation of student, course, and admin functionality.

Express Router provides modularity, but it does not automatically make an application faster or more secure.

## 20. Router versus app: What is the difference?

| `app`                                                  | `router`                                         |
| ------------------------------------------------------ | ------------------------------------------------ |
| Represents the main Express application                | Represents a modular routing system              |
| Created with `express()`                               | Created with `express.Router()`                  |
| Commonly starts the HTTP server through `app.listen()` | Does not start its own HTTP server               |
| Mounts middleware and routers                          | Defines and groups related routes and middleware |
| Often configured in the entry file                     | Often defined in separate route files            |

A router is mounted into an application or another router.

You can think of `app` as the main entry point and routers as organized groups of routes.

## 21. Using middleware inside Express Router

One of the most useful features of a router is the ability to attach middleware to a group of related routes.

For example:

```
const express = require("express");
const router = express.Router();

const authenticateUser =
  require("../middleware/authenticateUser");

router.get("/me", authenticateUser, (req, res) => {
  res.json({
    message: "Your profile"
  });
});

router.get("/dashboard", authenticateUser, (req, res) => {
  res.json({
    message: "Your dashboard"
  });
});

module.exports = router;
```

Here, `authenticateUser` runs before each corresponding route handler.

You can also apply middleware to every route in the router:

```
router.use(authenticateUser);
```

If this line appears before the route definitions, the middleware applies to subsequent matching routes in that router.

Example:

```
router.use(authenticateUser);

router.get("/me", getMyProfile);
router.get("/dashboard", getDashboard);
router.patch("/me", updateMyProfile);
```

This can be useful when every route in a router requires authentication.

Be careful: If the router also contains public routes, applying authentication to the entire router may block those routes unintentionally. Keep public and protected routes organized according to their requirements.

## 22. Express Router with controllers and Mongoose

Now let's combine the concepts into a practical structure.

Suppose you want to retrieve all students from MongoDB.

### Step 1: Create the Mongoose model

`Models/student.js`

```
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 5
  }
});

module.exports = mongoose.model(
  "Student",
  studentSchema
);
```

### Step 2: Create the controller

`controllers/studentController.js`

```
const Student = require("../Models/student");

async function getStudents(req, res) {
  try {
    const students = await Student.find()
      .select("name email age")
      .sort({ name: 1 })
      .limit(50);

    return res.json(students);
  } catch (error) {
    console.error("Failed to retrieve students:", error);

    return res.status(500).json({
      message: "Unable to retrieve students"
    });
  }
}

module.exports = {
  getStudents
};
```

The controller uses several Mongoose methods:

- `find()` retrieves matching documents.
- `select()` chooses the fields to return.
- `sort()` orders the results.
- `limit()` limits the number of results.

### Step 3: Create the router

`routes/studentRoutes.js`

```
const express = require("express");
const router = express.Router();

const {
  getStudents
} = require("../controllers/studentController");

router.get("/", getStudents);

module.exports = router;
```

The router connects the URL to the controller.

### Step 4: Mount the router

`index.js`

```
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const studentRouter =
  require("./routes/studentRoutes");

const app = express();

app.use(express.json());

app.use("/students", studentRouter);

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
}

startServer();
```

This example uses a direct Mongoose connection for clarity. In a larger project, you may place the connection logic in a separate `database.js` module.

### What happens when the client sends a request?

The client sends:

```
GET /students
```

The request flows through the application as follows:

1. Express receives the request.
2. The application matches `/students` and delegates to `studentRouter`.
3. The router matches its `/` GET route.
4. The route invokes `getStudents`.
5. The controller calls Mongoose to query MongoDB.
6. The controller returns a JSON response.

This is the key separation:

- Router: Which endpoint should handle the request?
- Controller: What should happen for that request?
- Model: How does the application interact with MongoDB?

This structure makes the application easier to extend and test.

## 23. Router and controller: Why separate them?

You can write all the logic directly inside a router:

```
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});
```

For a small project, this may be entirely reasonable.

However, when routes become more complex, separating controllers can make the code easier to understand.

| Router                                          | Controller                            |
| ----------------------------------------------- | ------------------------------------- |
| Defines the HTTP method and path                | Implements the request-handling logic |
| Connects middleware to routes                   | Uses models and other services        |
| Determines which handler runs                   | Prepares the response                 |
| Often contains relatively little business logic | Contains the endpoint's main behavior |

A controller is a common architectural pattern, not a mandatory feature of Express. You can also separate business logic into service modules as your project grows.

## 24. Common mistakes to avoid

### Mongoose mistakes

- Forgetting `await` when you need the result of an asynchronous database operation.
- Assuming that `updateOne()` returns the updated document.
- Assuming that changing a document property automatically saves it to MongoDB.
- Returning password hashes or sensitive fields in API responses.
- Assuming `unique: true` guarantees that duplicate-email errors can never occur.
- Running update operations without considering validation and authorization.

### Environment-variable mistakes

- Forgetting to load `.env` before reading its values.
- Using `process.env.PORT` without a fallback or configuration check.
- Committing real secrets to GitHub.
- Assuming that environment variables are automatically encrypted.
- Using production credentials in a development project unnecessarily.
- Failing to validate required variables when the application starts.

### Express Router mistakes

- Forgetting `module.exports = router`.
- Forgetting to import the router into the main application.
- Mounting a router at the wrong prefix.
- Defining authentication middleware after a route that needs it.
- Applying authentication to public routes unintentionally.
- Putting all database and business logic into one increasingly large route file without considering modularization.

## 25. Interview questions and answers

### Mongoose

Q1. What is Mongoose?

Mongoose is an ODM library that provides schemas, models, validation, and convenient methods for interacting with MongoDB from Node.js.

Q2. What is the difference between a schema and a model?

A schema defines the structure and behavior of documents. A model provides an interface for querying and modifying the associated collection.

Q3. What is the difference between `find()` and `findOne()`?

`find()` returns an array of matching documents. `findOne()` returns one matching document or `null`.

Q4. What is the difference between `create()` and `save()`?

`create()` is a model method that creates and saves a document. `save()` is a document method used to persist a document's changes or save a newly constructed document.

Q5. What is the difference between `updateOne()` and `findOneAndUpdate()`?

`updateOne()` returns an update-result object. `findOneAndUpdate()` can return the matched document, with options controlling whether the returned document reflects the update.

Q6. What is the difference between instance methods and static methods?

Instance methods operate on individual documents. Static methods operate on the model.

### Environment variables

Q7. What are environment variables?

They are named configuration values supplied to an application by its execution environment and accessed in Node.js through `process.env`.

Q8. Are environment variables only used for security?

No. They also configure ports, database addresses, logging, feature flags, timeouts, and deployment-specific settings.

Q9. Why use a `.env` file?

It provides a convenient way to define local environment variables during development. It is not the only source of environment variables.

Q10. What is the difference between `process.env.PORT` and `3000`?

`process.env.PORT` reads the configured port from the environment. `3000` is a hardcoded number. A common pattern is `process.env.PORT || 3000`.

### Express Router

Q11. What is Express Router?

It is a modular routing object that groups related routes and middleware.

Q12. Why use Express Router?

It improves organization, maintainability, modularity, and reuse of route-specific middleware.

Q13. Does Express Router create a separate server?

No. It defines routes that are mounted into an Express application or another router.

Q14. What is the difference between `app.use()` and `router.get()`?

`app.use()` mounts middleware or a router on the application. `router.get()` defines a GET route on the router.

Q15. What happens when you mount a router at `/students`?

A route defined as `router.get("/:id", ...)` becomes accessible as `GET /students/:id` when that router is mounted using `app.use("/students", router)`.

Q16. Does using Express Router automatically make the application secure?

No. Security depends on proper authentication, authorization, validation, error handling, and other safeguards.

## 26. Final revision sheet

## Mongoose

- `create()` — create and save a document.
- `find()` — retrieve multiple documents.
- `findOne()` — retrieve one matching document.
- `findById()` — retrieve by document ID.
- `save()` — persist document changes.
- `updateOne()` — update one matching document.
- `findOneAndUpdate()` — update and optionally return the document.
- `deleteOne()` — delete one matching document.
- `countDocuments()` — count matching documents.
  ## Environment variables
- `process.env` — access environment values.
- `.env` — a convenient local configuration file.
- `PORT` — configure the listening port.
- `MONGODB_URI` — configure the database connection.
- `NODE_ENV` — identify the application environment.
- Signing secrets and credentials — supply sensitive configuration securely.
  ## Express Router
- `express.Router()` — create a router.
- `router.get()` — define a GET route.
- `router.post()` — define a POST route.
- `router.use()` — attach middleware to a router.
- `app.use("/prefix", router)` — mount the router.
- `module.exports = router` — export the router.

  ## Application architecture

  Request

  Router

  Middleware

  Controller

  Mongoose Model

  MongoDB

  This is a common architecture. Middleware can run at different points in the request flow, and not every application requires separate controller and service layers.

## 27. Practice exercises

Try these tasks in your own Node.js project:

## Learning checklist

0/10 completed

Create a Student schema with name, email, and age.

Use create() to insert three sample students.

Use find() to retrieve students whose age is at least 18.

Use findById() to retrieve one student and save an age change.

Use findOneAndUpdate() and return the updated document.

Create a .env file and read PORT and MONGODB_URI.

Move student routes into a separate routes/studentRoutes.js file.

Create a controller that retrieves students using Mongoose.

Mount the student router at /students and test the endpoints.

Add authentication middleware to a protected route.

Reset checklist

The main principle: Mongoose organizes database operations, environment variables separate configuration from application code, and Express Router organizes HTTP endpoints. Together, they help you build backend applications that are easier to understand, maintain, test, and deploy.
