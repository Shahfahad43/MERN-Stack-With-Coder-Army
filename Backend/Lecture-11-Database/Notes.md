# 🗄️ Database — Complete Interview & Concept Notes

NOTE: Use markdown preview extension for reading this notes in proper way

> **Goal:** Understand databases conceptually, not just memorize definitions. These notes are designed for both **learning and technical interviews**.

---

# 1. Error Handling While Getting Data

Before starting databases, one important concept is **error handling** when working with APIs.

When we request data from a server, many things can go wrong:

- Server may be down.
- Network may fail.
- API may return an error.
- JSON data may be invalid.
- Database operation may fail.
- The requested resource may not exist.

Therefore, we use `try...catch`.

## Basic Example

```js
try {
  const data = JSON.parse(jsonData);

  console.log(data);
} catch (error) {
  console.log("Something went wrong:", error.message);
}
```

### How it works

```text
try
 │
 ├── Code runs successfully
 │        ↓
 │     Continue
 │
 └── Error occurs
          ↓
        catch
          ↓
   Handle the error
```

The main purpose of `try...catch` is:

> **Prevent an error from unexpectedly crashing the entire flow of the program and give us a controlled way to handle the error.**

---

# 2. Why Do We Need `JSON.parse()`?

Suppose a server gives us JSON as a string:

```js
const data = '{"name":"Fahad","age":20}';
```

At this point:

```js
typeof data;
```

returns:

```text
string
```

We can convert it into a JavaScript object:

```js
const user = JSON.parse(data);
```

Now:

```js
console.log(user.name);
```

Output:

```text
Fahad
```

### Important

`JSON.parse()` means:

> Convert a **JSON string** into a JavaScript value/object.

---

# 3. If `JSON.parse()` Exists, Why Do We Need `express.json()`?

This is a very common **interview question**.

## `JSON.parse()`

`JSON.parse()` is a JavaScript function.

It manually converts a JSON string into a JavaScript object/value.

```js
const obj = JSON.parse('{"name":"Fahad"}');
```

---

## `express.json()`

`express.json()` is **Express middleware**.

```js
app.use(express.json());
```

Its purpose is to tell Express:

> "When an incoming HTTP request contains JSON data in its body, parse that body and make the resulting JavaScript object available through `req.body`."

### Example

Client:

```js
fetch("/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Fahad",
    age: 20,
  }),
});
```

Server:

```js
app.use(express.json());

app.post("/users", (req, res) => {
  console.log(req.body);
});
```

Output:

```js
{
    name: "Fahad",
    age: 20
}
```

---

# 4. `JSON.parse()` vs `express.json()`

| `JSON.parse()`                      | `express.json()`                            |
| ----------------------------------- | ------------------------------------------- |
| JavaScript function                 | Express middleware                          |
| Parses a JSON string                | Parses incoming HTTP request bodies         |
| Used manually                       | Used automatically for matching requests    |
| Works on a string/value you give it | Works as part of Express request processing |
| Example: `JSON.parse(str)`          | Example: `app.use(express.json())`          |

### Interview Answer

**Question:** If we already have `JSON.parse()`, why do we need `express.json()`?

**Answer:**

> `JSON.parse()` is a JavaScript function that manually parses a JSON string. `express.json()` is Express middleware that automatically parses incoming HTTP requests whose body contains JSON and places the resulting JavaScript object in `req.body`. They solve related but different problems.

### Very important distinction

`express.json()` internally performs parsing work, but its job is not simply "another version of `JSON.parse()`."

It is part of the **HTTP request-processing pipeline**.

---

# 🗄️ 5. What Is a Database?

A **database** is an organized collection of data that allows data to be stored, managed, retrieved, modified, and often queried efficiently.

A more complete view is:

```text
Application
     ↓
    DBMS
     ↓
  Database
     ↓
Persistent Storage
```

For example:

```text
Food Delivery App
       ↓
     Server
       ↓
    MongoDB
       ↓
 Users / Restaurants / Orders
```

---

# 6. Why Do We Need a Database?

Suppose we create an API:

```js
let users = [
  {
    name: "Fahad",
    age: 20,
  },
  {
    name: "Ali",
    age: 22,
  },
];
```

The data is currently stored in the server application's memory.

### What happens if the server restarts?

The data stored only in memory can disappear.

```text
Application starts
       ↓
RAM contains data
       ↓
Server crashes/restarts
       ↓
RAM is cleared
       ↓
Temporary data is lost
```

Therefore, we need **persistent storage**.

A database allows important application data to survive:

- server restart
- application restart
- machine restart
- crashes

assuming the database itself and its storage are properly maintained.

---

# 7. Is a Database the Same Thing as RAM?

No.

### RAM

RAM is **volatile memory**.

It is fast but generally loses its contents when power is removed.

### Database Storage

A database normally stores persistent data using storage such as:

- SSD
- HDD
- cloud storage

The database system may also use RAM heavily for caching and processing.

So saying:

> "Database = secondary storage"

is useful as a beginner mental model, but technically a database is **not simply a type of secondary storage**.

A database is an organized data-management system that uses persistent storage and software to manage that data.

---

# 8. What Is DBMS?

## DBMS = Database Management System

A **DBMS** is software that allows us to:

- create databases
- store data
- retrieve data
- update data
- delete data
- query data
- control access
- manage transactions
- maintain data integrity

Think of it as the **manager between the application and the stored data**.

```text
Application
     ↓
    DBMS
     ↓
  Database
```

---

# 9. Example of DBMS

Examples include:

### SQL / Relational DBMS

- PostgreSQL
- MySQL
- Microsoft SQL Server
- Oracle Database

### NoSQL DBMS

- MongoDB
- Cassandra
- Redis
- Couchbase

### Important MongoDB clarification

MongoDB is commonly described as a **NoSQL database**.

More precisely, MongoDB provides a **database management system/database platform** for storing and querying document-oriented data.

---

# 10. What Can a DBMS Do?

Suppose we have:

```text
Users

ID | Name  | Age
---|-------|----
1  | Ali   | 20
2  | Fahad | 21
3  | Ahmed | 25
```

We can ask the DBMS:

> Give me users older than 20.

Or:

> Delete user 2.

Or:

> Add a new user.

Or:

> Change Fahad's age.

This interaction is performed through database operations/query languages or APIs.

---

# 11. Why Can't We Simply Store Everything in Normal Computer Files?

We can store data in normal files.

For example:

```text
users.txt
users.json
users.csv
```

That does **not automatically make the file a database**.

A database is much more than merely a place where data exists.

It provides mechanisms such as:

- structured querying
- indexing
- concurrent access
- transactions
- access control
- constraints
- data integrity
- recovery
- scalability
- efficient searching

---

# 12. If I Store Data on My Computer, Is It a Database?

Not necessarily.

For example:

```text
D:\users.txt
```

contains data.

But the existence of data in a file does not make that file a database.

Think:

```text
File
= Storage of information

Database
= Organized data + database management capabilities
```

---

# 13. Can We Query a Normal Computer File?

Sometimes, yes—but not in the same way or with the same capabilities as a database.

For example, a program can read:

```text
users.json
```

and search it:

```js
users.filter((user) => user.age > 20);
```

So technically, we can perform filtering/searching ourselves.

But a DBMS provides specialized mechanisms for this at much larger scale.

### Example

Suppose:

```text
10 users
```

Searching a JSON file is easy.

But imagine:

```text
100 million users
```

Now we need things like:

- indexes
- query optimization
- concurrency control
- transactions
- efficient storage
- caching
- permissions

This is where databases become extremely useful.

---

# 14. Can Excel Be Called a Database?

This is a nuanced interview question.

Excel stores structured data in:

```text
Rows
Columns
Cells
```

It supports:

- filtering
- sorting
- formulas
- searching
- multiple sheets

So Excel can behave like a **small data-management tool**.

However, Excel is generally **not considered a full DBMS/database system** for typical application workloads.

---

# 15. Why Isn't Excel Normally Used as an Application Database?

### Problem 1 — Concurrent access

Suppose:

```text
User A ──┐
         ├── Excel file
User B ──┘
```

Both users modify the same data.

Managing concurrent changes safely is much more difficult than in a proper database system.

---

### Problem 2 — Scalability

Excel is designed primarily for spreadsheet/data-analysis workflows, not large-scale transactional application workloads.

---

### Problem 3 — Database features

A proper DBMS provides sophisticated features such as:

- transactions
- indexing
- constraints
- concurrency control
- recovery
- access control
- query optimization

---

### Interview Answer

**Can Excel be called a database?**

> Excel can store and manipulate structured data and can sometimes be used for small-scale data management, but it is not generally considered a database management system suitable for typical multi-user application workloads.

---

# 16. Structured, Semi-Structured, and Unstructured Data

This distinction is very important.

## 16.1 Structured Data

Data has a clearly defined structure.

Example:

```text
ID | Name  | Age
---|-------|----
1  | Ali   | 20
2  | Fahad | 21
```

The database knows the fields.

We can efficiently query:

```text
Find users whose age > 20
```

Examples:

- user records
- bank transactions
- product records
- employee records

---

# 17. Unstructured Data

Data does not naturally follow a fixed tabular structure.

Examples:

- videos
- images
- audio
- many types of documents
- raw media files

For example:

```text
video.mp4
```

contains a huge amount of binary data.

---

# 18. Can a Video Be Stored in a Database?

Technically, **yes**.

A database can store binary data, depending on the database and design.

But storing large videos directly inside the main application database is often not the preferred architecture.

A common architecture is:

```text
              ┌───────────────┐
              │    Video      │
              │ File Storage  │
              └───────┬───────┘
                      │
                 video URL
                      │
                      ↓
              ┌───────────────┐
              │   Database    │
              │               │
              │ title         │
              │ URL           │
              │ owner         │
              │ size          │
              │ metadata      │
              └───────────────┘
```

The actual video can be stored in:

- object storage
- file storage
- cloud storage

while the database stores information **about the video**.

---

# 19. Why Store the Video Outside the Database?

Large media files can be expensive and inefficient to manage directly inside a transactional database.

For example:

```text
Video:
2 GB
```

Instead:

```text
Storage:
video.mp4

Database:
{
    title: "Lecture 1",
    url: "...",
    size: "2GB",
    duration: "1h 20m"
}
```

The database stores the metadata and location.

---

# 20. What Is Metadata?

**Metadata = data about data.**

For a video:

```text
Actual data:
video.mp4
```

Metadata:

```text
Title: Lecture 1
Size: 500 MB
Duration: 45 minutes
Format: MP4
CreatedAt: ...
URL: ...
Owner: Fahad
```

The metadata is structured and easy to query.

---

# 21. Why Can't We Query a Million Videos Like Normal Text Data?

Suppose we ask:

> "Give me the videos in which a dog appears."

A traditional database does not automatically understand the visual content of the video.

It can easily search:

```text
WHERE title = "Dog Training"
```

But this is different from understanding the actual pixels inside the video.

To determine whether a dog appears visually, we may need:

- computer vision
- machine learning
- object detection
- video analysis
- embeddings/vector search

So:

```text
Database query
        ↓
Search structured metadata
```

is different from:

```text
AI / Computer Vision
        ↓
Understand content inside media
```

### Important correction

It is not correct to say:

> "You can never query videos."

You can query **video metadata**, and modern systems can also search video content using AI-based techniques.

The important point is that a normal relational query does not automatically understand the visual content of a video.

---

# 22. Semi-Structured Data

Semi-structured data does not follow a rigid table structure but still contains organizational information.

Examples:

```json
{
  "name": "Fahad",
  "age": 20,
  "skills": ["JavaScript", "React"]
}
```

JSON is a common example.

XML is another example.

Semi-structured data often contains:

- keys
- values
- nested objects
- arrays
- metadata

MongoDB documents are commonly represented using JSON-like structures.

---

# 23. SQL vs NoSQL

This is one of the most important database interview topics.

## SQL

SQL generally refers to **relational databases** that organize data into tables with defined relationships.

Examples:

- PostgreSQL
- MySQL
- Oracle Database
- SQL Server

Example:

```text
Users

id | name  | age
---|-------|----
1  | Ali   | 20
2  | Fahad | 21
```

Another table:

```text
Orders

id | user_id | amount
---|---------|-------
1  | 2       | 500
2  | 1       | 700
```

Here:

```text
Users.id
    ↑
    |
Orders.user_id
```

creates a relationship.

---

# 24. What Does SQL Stand For?

SQL:

> **Structured Query Language**

It is a language used to interact with relational databases.

Example:

```sql
SELECT *
FROM users
WHERE age > 20;
```

---

# 25. What Is NoSQL?

NoSQL databases are non-relational database systems that use different data models depending on the database.

"NoSQL" is commonly interpreted as:

> Not Only SQL

Examples include:

- MongoDB → document database
- Redis → key-value
- Cassandra → wide-column
- Neo4j → graph database

NoSQL does **not** mean:

> "No querying."

NoSQL databases absolutely support querying.

---

# 26. SQL vs NoSQL — Basic Difference

| SQL                                                | NoSQL                                                      |
| -------------------------------------------------- | ---------------------------------------------------------- |
| Usually relational                                 | Usually non-relational                                     |
| Tables                                             | Depends on model                                           |
| Fixed/schema-defined structure is common           | Flexible schema is common                                  |
| Relationships are a major concept                  | Relationships may be modeled differently                   |
| SQL language                                       | Database-specific query APIs/languages                     |
| Strong transactional capabilities are common       | Capabilities depend on the specific database               |
| Excellent for many structured relational workloads | Useful for flexible/high-scale/document-oriented workloads |

---

# 27. Why Is SQL Still Used in Banking?

Banking systems handle highly important transactions.

Example:

```text
Account A: $5000
Account B: $3000
```

Transfer:

```text
A → B
$1000
```

After:

```text
A = $4000
B = $4000
```

We cannot allow a situation like:

```text
A = $4000
B = $3000
```

because $1000 disappeared.

Or:

```text
A = $5000
B = $4000
```

because money was created.

This requires reliable transaction processing.

This is where **ACID properties** become extremely important.

---

# 28. ACID Properties

ACID stands for:

```text
A → Atomicity
C → Consistency
I → Isolation
D → Durability
```

These properties help databases process transactions reliably.

---

# 29. What Is a Transaction?

A transaction is a logical unit of work.

Example:

```text
Transfer $1000 from A to B
```

It may involve multiple operations:

```text
1. Read A's balance
2. Subtract 1000 from A
3. Read B's balance
4. Add 1000 to B
```

Although multiple database operations occur, logically we want them treated as **one transaction**.

---

# 30. A — Atomicity

### Meaning

> A transaction is treated as one indivisible unit: either all required operations succeed, or the transaction is rolled back.

Think:

```text
ALL
or
NOTHING
```

Example:

```text
A = $5000
B = $3000
```

Transfer:

```text
$1000
```

Desired result:

```text
A = $4000
B = $4000
```

Suppose:

```text
A - $1000       ✅
B + $1000       ❌
```

Atomicity ensures the transaction does not simply remain half-completed.

The transaction can be rolled back.

---

# 31. Atomicity Example

Imagine buying a product.

We need to:

```text
1. Deduct money from customer
2. Create order
3. Reduce product inventory
```

Suppose:

```text
Money deducted       ✅
Order created        ✅
Inventory updated    ❌
```

Without proper transaction handling, the system can become inconsistent.

With transaction handling:

```text
All succeed
    ↓
COMMIT

Something fails
    ↓
ROLLBACK
```

---

# 32. C — Consistency

### Meaning

> A transaction must move the database from one valid state to another valid state while maintaining defined rules and constraints.

Example:

Before:

```text
A = 5000
B = 3000

Total = 8000
```

After transferring $1000:

```text
A = 4000
B = 4000

Total = 8000
```

The transaction preserves the relevant integrity rules.

---

# 33. Important Understanding of Consistency

Consistency does **not** simply mean:

> "The numbers before and after must be the same."

Instead:

> The database must obey its defined rules before and after the transaction.

For example, suppose a database has a rule:

```text
age >= 0
```

A transaction that produces:

```text
age = -5
```

would violate a consistency constraint.

---

# 34. I — Isolation

Isolation addresses the problem of **multiple transactions happening at the same time**.

Suppose:

```text
B = $5000
```

Two people are sending money to B.

```text
A → B : $2000

D → B : $5000
```

Both transactions may execute concurrently.

We don't want one transaction to incorrectly overwrite the result of another.

---

# 35. The Lost Update Problem

Suppose B starts with:

```text
$5000
```

Transaction 1 reads:

```text
5000
```

Transaction 2 also reads:

```text
5000
```

Transaction 1 calculates:

```text
5000 + 2000 = 7000
```

Transaction 2 calculates:

```text
5000 + 5000 = 10000
```

If the second result overwrites the first:

```text
B = 10000
```

But the correct result should be:

```text
5000 + 2000 + 5000 = 12000
```

This illustrates why concurrent transactions require proper isolation/concurrency control.

---

# 36. How Does Isolation Help?

Databases use mechanisms such as:

- locks
- MVCC (Multi-Version Concurrency Control)
- transaction isolation levels
- concurrency-control algorithms

One simple mental model is:

```text
Transaction A
     ↓
Lock / coordinate access
     ↓
Update
     ↓
Commit
     ↓
Other transaction continues
```

However, modern databases do not necessarily use simple "lock everything" behavior. The exact mechanism depends on the database and isolation level.

---

# 37. Transaction Isolation Levels

A common interview topic.

SQL systems commonly define isolation levels such as:

```text
Read Uncommitted
Read Committed
Repeatable Read
Serializable
```

Higher isolation generally provides stronger guarantees but can involve more coordination and reduced concurrency.

### Common problems discussed with isolation

- Dirty reads
- Non-repeatable reads
- Phantom reads
- Lost updates

---

# 38. D — Durability

### Meaning

> Once a transaction has successfully committed, its result should survive subsequent failures such as a process crash or system restart, subject to the database's durability guarantees.

Example:

```text
Transfer $1000
       ↓
Transaction commits
       ↓
Server crashes
       ↓
Server restarts
       ↓
Committed transaction remains
```

---

# 39. Does Durability Mean "There Must Be Replicas"?

Not exactly.

This is an important correction.

Replication can improve:

- availability
- fault tolerance
- disaster recovery

But **durability itself is broader than replication**.

Databases can use mechanisms such as:

- write-ahead logging (WAL)
- durable storage
- checkpoints
- backups
- replication

The exact implementation depends on the database system.

So in an interview, do **not** define durability as:

> "There must always be replicas in different locations."

Better:

> "Durability means committed data should survive failures, with the database using mechanisms such as durable storage and logging; replication and backups can additionally provide fault tolerance and recovery."

---

# 40. ACID Summary

| Property        | Simple Meaning                                      | Example                                    |
| --------------- | --------------------------------------------------- | ------------------------------------------ |
| **Atomicity**   | All or nothing                                      | Transfer succeeds completely or rolls back |
| **Consistency** | Rules remain valid                                  | Balance/integrity constraints remain valid |
| **Isolation**   | Concurrent transactions don't incorrectly interfere | Two transfers are handled safely           |
| **Durability**  | Committed changes survive failures                  | Committed payment remains after restart    |

### Easy Memory Trick

```text
A → All or Nothing
C → Correct State
I → Independent Transactions
D → Data Survives
```

---

# 41. Why Do We Use MongoDB?

MongoDB is a **document-oriented NoSQL database**.

A document can look like:

```json
{
  "name": "Fahad",
  "age": 20,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

This structure is convenient for applications that naturally work with objects/documents.

---

# 42. Why Might a Developer Choose MongoDB?

Possible reasons include:

### 1. Flexible schema

Documents do not have to fit a rigid table structure in exactly the same way as a relational database.

For example:

```json
{
  "name": "Fahad",
  "skills": ["React"]
}
```

Another document may contain:

```json
{
  "name": "Ali",
  "skills": ["Python"],
  "github": "ali123"
}
```

---

### 2. JSON-like data model

JavaScript applications commonly work with objects.

MongoDB documents are represented using BSON and are naturally convenient for JavaScript/Node.js applications.

---

### 3. Nested data

We can represent related information inside documents when that model fits the application.

```json
{
  "name": "Fahad",
  "address": {
    "city": "Bisha",
    "country": "Saudi Arabia"
  }
}
```

---

### 4. Horizontal scaling

MongoDB supports distributed architectures and sharding for scaling large datasets/workloads.

But:

> MongoDB is not chosen simply because "NoSQL is faster."

The appropriate database depends on the application's requirements.

---

# 43. Does NoSQL Mean No ACID?

**No.**

This is a very important interview trap.

Modern NoSQL databases can provide transactional guarantees, including ACID transactions in appropriate situations.

So:

```text
SQL = ACID
NoSQL = No ACID
```

is an incorrect oversimplification.

A better understanding is:

> ACID is a set of transaction properties, not a synonym for SQL.

---

# 44. Does SQL Mean "Old" and NoSQL Mean "Modern"?

No.

Both are actively used.

The correct question is:

> **What data model and consistency/scaling requirements does the application have?**

For example:

```text
Banking
Financial transactions
Complex relationships
Strong relational constraints
```

may favor a relational database.

While:

```text
Flexible document-oriented data
Rapidly changing document structures
Certain distributed workloads
```

may make a document database attractive.

There is no universal database that is best for every application.

---

# 45. Database vs DBMS

This is a common interview question.

### Database

The organized collection of data.

### DBMS

The software used to manage that data.

Example mental model:

```text
Database
= Data

DBMS
= Software managing the data
```

A more complete system is:

```text
Database + DBMS + Application
          ↓
     Database System
```

---

# 46. Database vs File System

| File System                                      | Database                             |
| ------------------------------------------------ | ------------------------------------ |
| Stores files                                     | Manages structured data              |
| Basic file operations                            | Querying                             |
| Basic organization                               | Indexing                             |
| Limited concurrency features                     | Advanced concurrency                 |
| Application handles much of the logic            | DBMS handles many database concerns  |
| No general transaction system comparable to DBMS | Transactions supported by many DBMSs |

A file system and database are not necessarily competitors.

In modern applications, both are commonly used together:

```text
Database
   ↓
Metadata

File/Object Storage
   ↓
Large files
```

---

# 47. Database Architecture in a Web Application

A typical architecture:

```text
                USER
                  │
                  ▼
             Frontend
          React / HTML / etc.
                  │
                  │ HTTP
                  ▼
             Backend
          Node.js + Express
                  │
                  │ Query
                  ▼
               DBMS
                  │
                  ▼
              Database
                  │
                  ▼
         Persistent Storage
```

Example:

```text
React
  ↓
POST /users
  ↓
Express
  ↓
MongoDB
  ↓
User document stored
```

---

# 48. Why Should Frontend Usually Not Connect Directly to the Database?

A common architecture is:

```text
Frontend
    ↓
Backend/API
    ↓
Database
```

Instead of:

```text
Frontend
    ↓
Database
```

The backend provides:

- authentication
- authorization
- validation
- business logic
- database credentials protection
- API control
- rate limiting
- error handling

You generally do **not** expose database credentials to the browser.

---

# 49. CRUD Operations

CRUD is another essential interview topic.

```text
C → Create
R → Read
U → Update
D → Delete
```

### Create

```text
Add a new user
```

### Read

```text
Get user information
```

### Update

```text
Change user's age
```

### Delete

```text
Remove user
```

---

# 50. CRUD and HTTP Methods

A common mapping is:

```text
POST    → Create
GET     → Read
PUT     → Replace/update
PATCH   → Partial update
DELETE  → Delete
```

Important:

> HTTP methods and CRUD are related concepts, but they are not literally the same thing.

---

# 51. What Is a Query?

A query is a request for data or an operation against a database.

Conceptually:

```text
"Give me users whose age is greater than 20."
```

SQL example:

```sql
SELECT *
FROM users
WHERE age > 20;
```

MongoDB example:

```js
db.users.find({
  age: { $gt: 20 },
});
```

---

# 52. What Is an Index?

Suppose we have:

```text
10 million users
```

and frequently search:

```text
email = "fahad@example.com"
```

Without a suitable index, the database may need to inspect many records.

An index provides an additional data structure that helps the database find matching records efficiently.

Think about a book:

### Without index

```text
Search page-by-page
```

### With index

```text
Use index
   ↓
Find relevant page
   ↓
Read information
```

### Important trade-off

Indexes improve some reads but:

- consume storage
- can increase write/update cost
- must be chosen carefully

---

# 53. What Is Schema?

A schema describes the expected structure/rules of data.

For example:

```text
User
 ├── name → string
 ├── age → number
 └── email → string
```

Relational databases typically define schemas strongly.

Some NoSQL databases allow more flexible document structures.

### Important

"Schema-less" does **not** mean:

> "There are absolutely no rules."

Application-level validation, database validation, and conventions can still enforce structure.

---

# 54. What Is a Collection in MongoDB?

MongoDB organizes documents into **collections**.

Conceptually:

```text
Database
   ↓
Collection
   ↓
Documents
```

Example:

```text
ubsmart
   ↓
users
   ↓
{ name: "Fahad", age: 20 }
{ name: "Ali", age: 21 }
```

Relational comparison:

```text
SQL:
Database → Table → Row

MongoDB:
Database → Collection → Document
```

This is a useful mental model, although the systems are not identical.

---

# 55. What Is a Document in MongoDB?

A MongoDB document is a BSON document represented in a JSON-like form.

Example:

```js
{
    name: "Fahad",
    age: 20,
    skills: ["JavaScript", "React"]
}
```

Unlike a traditional relational row, a document can naturally contain:

- arrays
- nested objects
- different fields depending on the data model

---

# 56. Why Can't We Just Keep Data in JavaScript Variables?

Example:

```js
const users = [];
```

This data lives in the application's process memory.

Problems:

### 1. Restart

```text
Server restart
     ↓
Memory cleared
```

### 2. Multiple servers

Suppose:

```text
Server A → users[]
Server B → users[]
Server C → users[]
```

Each process may have different memory.

A shared persistent database gives the application a central source of persistent data.

### 3. Scalability

Large applications require specialized mechanisms for:

- querying
- indexing
- transactions
- concurrency
- persistence
- replication
- recovery

---

# 57. Common Interview Trap: "Database Stores Data Permanently"

Be precise.

A database is designed for **persistent data**, but no storage system should be described as magically permanent.

Data can still be lost because of:

- hardware failure
- operator mistakes
- software bugs
- corruption
- disasters
- accidental deletion

This is why production systems use:

- backups
- replication
- recovery procedures
- monitoring

---

# 58. Common Interview Question: What Happens When the Server Restarts?

### If data exists only in RAM:

```text
Server process
    ↓
RAM
    ↓
Restart
    ↓
Temporary in-memory data lost
```

### If data is persisted in a database:

```text
Server
   ↓
Database
   ↓
Persistent storage
```

After restart:

```text
Server starts
    ↓
Connects to database
    ↓
Reads existing data
```

---

# 59. Common Interview Question: Is MongoDB a Database or DBMS?

A good answer:

> MongoDB is a document-oriented NoSQL database system/DBMS. It provides software for storing, querying, and managing BSON documents in databases and collections.

For a beginner interview:

> MongoDB is a NoSQL document database.

Both answers are acceptable; the second is simpler.

---

# 60. Common Interview Question: Why Not Store Everything in RAM?

Because RAM is:

- volatile
- limited
- relatively expensive
- tied to a running process/server

Databases provide persistent, organized, queryable storage.

---

# 61. Common Interview Question: What Is the Difference Between RAM and Database Storage?

| RAM                                            | Database/Persistent Storage          |
| ---------------------------------------------- | ------------------------------------ |
| Volatile                                       | Persistent                           |
| Very fast                                      | Generally slower than RAM            |
| Limited                                        | Can be much larger                   |
| Data can disappear after power/process failure | Designed to survive restarts         |
| Used heavily during computation                | Used for persistent application data |

---

# 62. Common Interview Question: Can a Database Store Images?

**Yes.**

Images can technically be stored as binary data.

But many systems prefer:

```text
Image → Object/File Storage
URL → Database
```

because large media objects may be better handled by dedicated storage systems.

---

# 63. Common Interview Question: Can a Database Store JSON?

Yes.

Depending on the database:

- JSON can be stored as a native JSON type.
- Document databases such as MongoDB use BSON documents.
- Relational databases can also support JSON columns.

---

# 64. Common Interview Question: What Is the Difference Between JSON and BSON?

### JSON

A text-based data interchange format.

Example:

```json
{
  "name": "Fahad",
  "age": 20
}
```

### BSON

MongoDB's binary representation of documents.

BSON supports additional data types and is designed for efficient storage/processing.

Important:

> MongoDB documents are commonly shown using JSON-like syntax, but internally MongoDB stores them as BSON.

---

# 65. Common Interview Question: Is MongoDB Faster Than SQL?

There is no universal answer.

Performance depends on:

- workload
- schema/data model
- indexes
- queries
- hardware
- concurrency
- configuration
- database design

Never answer:

> "MongoDB is always faster."

Better:

> "Performance depends on the workload and database design. MongoDB and relational databases have different data models and are optimized for different patterns."

---

# 66. Common Interview Question: When Would You Choose SQL?

A relational database can be a strong fit when you need:

- complex relationships
- joins
- strong relational constraints
- structured data
- complex analytical queries
- mature transaction semantics

Example:

```text
Banking
Accounting
ERP
Inventory
Order management
```

---

# 67. Common Interview Question: When Would You Choose MongoDB?

MongoDB can be a strong fit when:

- document-oriented data is natural
- data structures evolve frequently
- nested documents are useful
- the application benefits from MongoDB's distributed/scaling capabilities
- the development team wants its document model

But this should be based on actual requirements, not simply:

> "MongoDB is easier."

---

# 68. Important Interview Question: SQL vs NoSQL — Which One Is Better?

There is no universal winner.

A professional answer:

> "Neither is universally better. The choice depends on the application's data model, relationships, consistency requirements, transaction requirements, workload, scaling strategy, and operational requirements."

This is much stronger than memorizing:

```text
SQL = good
NoSQL = good
```

---

# 69. Database Interview Questions — Rapid Revision

### Q1. What is a database?

> An organized collection of data managed so that applications can store, retrieve, update, and query information efficiently.

---

### Q2. Why do we need databases?

> To provide persistent, organized, queryable, and manageable storage for application data.

---

### Q3. What is DBMS?

> Database Management System — software that manages databases and provides operations such as storing, querying, updating, deleting, access control, and transaction management.

---

### Q4. What is SQL?

> Structured Query Language, commonly used to interact with relational databases.

---

### Q5. What is NoSQL?

> A broad category of non-relational database systems using models such as documents, key-value pairs, wide columns, or graphs.

---

### Q6. What is MongoDB?

> A document-oriented NoSQL database system that stores documents in BSON format.

---

### Q7. What is a transaction?

> A logical unit of database work that should be processed according to the database's transaction guarantees.

---

### Q8. What is ACID?

```text
A → Atomicity
C → Consistency
I → Isolation
D → Durability
```

---

### Q9. What is Atomicity?

> All operations in a transaction succeed together, or the transaction is rolled back.

---

### Q10. What is Consistency?

> A transaction preserves the database's defined integrity rules and moves it from one valid state to another.

---

### Q11. What is Isolation?

> Concurrent transactions are controlled so that their interactions do not produce incorrect results according to the chosen isolation level.

---

### Q12. What is Durability?

> Once a transaction commits, its result is expected to survive failures according to the database's durability guarantees.

---

### Q13. Why can't we use a JavaScript array as our database?

> An in-memory JavaScript array is temporary, process-local storage and lacks the persistence, querying, indexing, concurrency control, transactions, and recovery capabilities of a database system.

---

### Q14. Why do we use `express.json()`?

> It is Express middleware that parses incoming JSON request bodies and makes the resulting object available through `req.body`.

---

### Q15. Why do we need `JSON.parse()`?

> To manually convert a JSON string into a JavaScript value/object.

---

### Q16. What is the difference between them?

> `JSON.parse()` parses a JSON string manually; `express.json()` is HTTP middleware that parses incoming JSON request bodies in an Express application.

---

### Q17. Can Excel store data?

> Yes.

### Q18. Is Excel a DBMS?

> No, not in the typical database-management-system sense. It is primarily a spreadsheet application.

---

### Q19. Can databases store videos?

> Yes, technically, but large media files are often stored in dedicated object/file storage while the database stores metadata and the file's location.

---

### Q20. What is metadata?

> Data about other data.

Example:

```text
Video → actual data

Title, size, duration, URL → metadata
```

---

### Q21. What is an index?

> An additional data structure that helps a database find records efficiently for supported queries.

---

### Q22. What is a schema?

> The structure and rules describing how data is organized and/or constrained.

---

### Q23. What is CRUD?

```text
Create
Read
Update
Delete
```

---

### Q24. Does NoSQL mean "no SQL queries"?

> No. NoSQL databases support querying; the term generally refers to non-relational database systems.

---

### Q25. Does NoSQL mean "no ACID"?

> No. Many NoSQL systems support ACID transactions in appropriate scenarios.

---

### Q26. Does SQL mean old technology?

> No. Relational databases remain widely used in modern systems.

---

# 70. Advanced Interview Questions

## Q27. Why can't a normal file replace a database?

Because a file by itself does not normally provide the full set of database capabilities such as:

```text
Query optimization
Indexes
Transactions
Concurrency control
Constraints
Recovery
Access control
```

A program can implement some of these features itself, but then we are essentially rebuilding database functionality.

---

# 71. Q28. Why Is an Index Faster?

Without an index:

```text
Database
 ↓
Record 1
Record 2
Record 3
Record 4
...
Record 10,000,000
```

Potentially many records must be examined.

With an appropriate index:

```text
Query
 ↓
Index
 ↓
Relevant location
 ↓
Record
```

But indexes have a cost.

```text
More indexes
     ↓
Faster certain reads
     +
More storage
     +
More write/update maintenance
```

---

# 72. Q29. What Happens If Two Users Update the Same Data?

This is a **concurrency** problem.

Database systems can use:

- locks
- MVCC
- transaction isolation
- optimistic/pessimistic concurrency techniques

The exact behavior depends on the database and configuration.

---

# 73. Q30. What Is a Rollback?

Rollback means:

> Undo the changes made by a transaction that has not successfully committed.

Example:

```text
Start transaction
      ↓
A - 1000
      ↓
B + 1000
      ↓
ERROR
      ↓
ROLLBACK
      ↓
Return to previous valid state
```

---

# 74. Q31. What Is Commit?

Commit means:

> Successfully finalize the transaction's changes.

Conceptually:

```text
BEGIN
  ↓
Operations
  ↓
COMMIT
  ↓
Changes become committed
```

---

# 75. Q32. What Is Concurrency?

Concurrency means multiple tasks are **in progress during overlapping periods**.

In databases:

```text
Transaction A ──────────
          Transaction B ──────────
```

The database must coordinate these operations correctly.

Concurrency does not necessarily mean both operations execute on the CPU at exactly the same instant.

---

# 76. Q33. What Is Replication?

Replication means maintaining copies of data across multiple database servers/nodes.

Example:

```text
             Primary
                │
       ┌────────┴────────┐
       ↓                 ↓
   Replica A         Replica B
```

Benefits can include:

- high availability
- redundancy
- read scaling in some architectures
- disaster recovery support

Replication is related to durability and fault tolerance but is **not identical to durability**.

---

# 77. Q34. What Is Backup?

A backup is a stored copy of data that can be used for recovery.

Example:

```text
Database
   ↓
Backup
   ↓
Stored separately
```

Replication and backup are different.

### Replication

Usually keeps operational copies synchronized or near-synchronized.

### Backup

Provides a recoverable historical copy.

A database can have replication and still need backups.

---

# 78. Q35. What Is Database Scaling?

Scaling means increasing a system's ability to handle larger workloads.

Two broad approaches:

## Vertical Scaling

Increase resources of one machine.

```text
Small Server
     ↓
More CPU
More RAM
More Storage
```

## Horizontal Scaling

Add more machines.

```text
Server A
Server B
Server C
```

Distributed databases may use techniques such as sharding.

---

# 79. Q36. What Is Sharding?

Sharding means distributing parts of a dataset across multiple machines.

Conceptually:

```text
10 million records

        ↓

Shard 1 → records 1–3M
Shard 2 → records 3–6M
Shard 3 → records 6–10M
```

This can allow a system to scale beyond the resources of one machine.

The exact strategy is database-specific.

---

# 80. Q37. What Is a Primary Key?

In a relational database, a primary key uniquely identifies a row.

Example:

```text
id | name
---|------
1  | Ali
2  | Fahad
```

Here:

```text
id
```

can be the primary key.

A primary key generally must uniquely identify each row and cannot be NULL.

---

# 81. Q38. What Is a Foreign Key?

A foreign key establishes a relationship between tables.

Example:

```text
Users
id | name
---|------
1  | Fahad

Orders
id | user_id
---|--------
1  | 1
```

Here:

```text
Orders.user_id
```

references:

```text
Users.id
```

---

# 82. Q39. What Is Normalization?

Normalization is a relational database design technique used to organize data and reduce unnecessary duplication and update anomalies.

Instead of:

```text
Order
------------------------------
User Name
User Email
Product
Price
```

we may separate entities:

```text
Users
Products
Orders
OrderItems
```

This allows relationships to be represented more cleanly.

---

# 83. Q40. What Is Denormalization?

Denormalization intentionally duplicates or combines some data to improve certain read patterns or simplify access.

Trade-off:

```text
Less normalization
      ↓
Potentially faster/easier reads
      +
More duplicated data
      +
More update complexity
```

---

# 84. Practical Example — E-Commerce Application

Suppose we build:

```text
Tawla
```

a food-ordering application.

We need:

```text
Users
Restaurants
Food Items
Orders
Payments
Reviews
```

We should not keep everything inside JavaScript variables:

```js
const users = [];
const restaurants = [];
const orders = [];
```

Instead:

```text
React Frontend
      ↓
Express Backend
      ↓
Database
      ↓
Persistent Storage
```

Example request:

```http
POST /orders
```

Request:

```json
{
  "userId": "123",
  "restaurantId": "456",
  "items": [
    {
      "foodId": "789",
      "quantity": 2
    }
  ]
}
```

Backend:

```text
Receive request
      ↓
Validate data
      ↓
Check user
      ↓
Check restaurant
      ↓
Check food item
      ↓
Create order
      ↓
Store in database
      ↓
Return response
```

---

# 85. Where Does `try...catch` Fit?

For example:

```js
app.post("/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
    });
  }
});
```

Here:

```text
Request
   ↓
try
   ↓
Database operation
   ↓
Success ─────────→ Response
   │
   ↓
Failure
   ↓
catch
   ↓
Error response
```

---

# 86. A Very Important Distinction: Error Handling vs Transactions

These are different concepts.

### `try...catch`

Handles errors at the application/code level.

```js
try {
  // code
} catch (error) {
  // handle error
}
```

### Transaction

Controls a group of database operations as a logical unit.

```text
BEGIN
 ↓
Operation 1
 ↓
Operation 2
 ↓
Operation 3
 ↓
COMMIT / ROLLBACK
```

They can work together.

```text
try
  ↓
Start transaction
  ↓
Database operations
  ↓
Commit
  ↓
catch if error
  ↓
Rollback
```

---

# 87. Interview Scenario

### Interviewer:

> You have a banking application. You transfer $1,000 from account A to account B. The server crashes after deducting money from A but before adding it to B. What should happen?

### Strong Answer:

> The transfer should be performed as a database transaction. Atomicity ensures the transaction is treated as a single logical unit. If the transaction cannot complete successfully, it should be rolled back rather than leaving the database in a partially updated state.

---

# 88. Interview Scenario

### Interviewer:

> Why can't you just use an array?

### Answer:

> An array is in-memory application state. It is lost when the process restarts and is not designed to provide persistent storage, indexing, concurrent access control, transactions, recovery, or scalable querying.

---

# 89. Interview Scenario

### Interviewer:

> Why use MongoDB instead of MySQL?

### Answer:

> The choice depends on the application's requirements. MongoDB provides a document-oriented model that can be convenient for flexible and nested data, while MySQL provides a relational model with tables, relationships, joins, and strong relational constraints. I would choose based on the application's data model, consistency, transaction, query, and scaling requirements.

---

# 90. Interview Scenario

### Interviewer:

> If JSON.parse() exists, why use express.json()?

### Answer:

> JSON.parse() manually converts a JSON string into a JavaScript value. Express.json() is middleware that processes incoming HTTP requests with JSON bodies and makes the parsed result available as req.body. So one is a general JavaScript parsing function, while the other is part of Express's HTTP request-processing pipeline.

---

# 91. Interview Scenario

### Interviewer:

> Is MongoDB a DBMS?

### Answer:

> Yes. MongoDB is a database system that provides DBMS functionality for managing document-oriented databases. It is commonly described as a NoSQL document database.

---

# 92. Interview Scenario

### Interviewer:

> Is Excel a database?

### Answer:

> Excel can store and manipulate structured data and can be useful for small-scale data management, but it is not generally considered a full DBMS for multi-user application workloads.

---

# 93. Interview Scenario

### Interviewer:

> Can a database store a video?

### Answer:

> Yes, technically a database can store binary data, depending on the database. However, large media files are often stored in dedicated object or file storage, while the database stores metadata and the file's location.

---

# 94. Interview Scenario

### Interviewer:

> Why can't a normal database query find a dog inside a video?

### Answer:

> A normal database query can search structured metadata such as the title or tags, but understanding whether a dog visually appears in the video requires analyzing the media content. That generally involves computer vision or other machine-learning techniques. Specialized systems can combine those techniques with databases or vector search.

---

# 95. The Complete Mental Model

Remember this architecture:

```text
                    USER
                     │
                     ▼
               FRONTEND
            React / Browser
                     │
                     │ HTTP
                     ▼
                BACKEND
             Node + Express
                     │
            ┌────────┴────────┐
            │                 │
            ▼                 ▼
        Business          Validation
          Logic
            │
            ▼
           DBMS
            │
            ▼
         DATABASE
            │
            ▼
    Persistent Storage
```

For large media:

```text
                    Backend
                   /       \
                  /         \
                 ▼           ▼
             Database     File/Object
               │            Storage
               │               │
          Metadata/URL       Video
```

---

# 96. Final Interview Cheat Sheet

```text
DATABASE
│
├── Purpose
│   ├── Persistent storage
│   ├── Organized data
│   ├── Querying
│   ├── Concurrent access
│   └── Data management
│
├── DBMS
│   ├── Manages database
│   ├── Query
│   ├── Insert
│   ├── Update
│   ├── Delete
│   ├── Security
│   └── Transactions
│
├── Data Types
│   ├── Structured
│   ├── Semi-structured
│   └── Unstructured
│
├── Database Models
│   ├── Relational / SQL
│   ├── Document
│   ├── Key-Value
│   ├── Wide-Column
│   └── Graph
│
├── MongoDB
│   ├── NoSQL
│   ├── Document-oriented
│   ├── BSON
│   ├── Collections
│   └── Documents
│
├── CRUD
│   ├── Create
│   ├── Read
│   ├── Update
│   └── Delete
│
├── Transactions
│   └── ACID
│       ├── Atomicity
│       ├── Consistency
│       ├── Isolation
│       └── Durability
│
├── Performance
│   ├── Indexes
│   ├── Caching
│   ├── Query optimization
│   └── Scaling
│
└── Reliability
    ├── Transactions
    ├── WAL
    ├── Replication
    ├── Backups
    └── Recovery
```

---

# 97. The 10 Concepts You Must Be Able to Explain Without Memorizing

For an interview, make sure you can explain these in your own words:

1. **Why do we need a database?**
2. **Database vs DBMS**
3. **SQL vs NoSQL**
4. **Why MongoDB?**
5. **Structured vs semi-structured vs unstructured data**
6. **What is a transaction?**
7. **ACID — especially Atomicity, Isolation, and Durability**
8. **`JSON.parse()` vs `express.json()`**
9. **Why database instead of JavaScript variables/files/Excel?**
10. **How a frontend, backend, DBMS, database, and storage work together**

If you understand these rather than merely memorizing their definitions, you can answer a large number of follow-up interview questions logically.
