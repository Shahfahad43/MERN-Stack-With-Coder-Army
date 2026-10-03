# Day 12 — Internal Database

> **Main topics**
>
> - Why do we need different databases if SQL already exists?
> - SQL and social-media applications
> - Rows vs columns
> - Redundant data
> - Normalization
> - Primary keys
> - MongoDB's document model
> - Vertical vs horizontal scaling
> - SQL horizontal scaling
> - MongoDB horizontal scaling
> - Sharding
> - Replication
> - Distributed databases
> - Distributed database challenges
> - CAP theorem
> - NoSQL meaning

---

# 1. Why Did We Need Other Databases If We Already Had SQL?

This is an important conceptual question.

At first, relational/SQL databases solved many problems extremely well.

They provide:

- structured data
- relationships
- powerful queries
- transactions
- constraints
- consistency
- ACID guarantees
- mature tooling

So why did we need other database models?

Because **applications and their requirements changed**.

Different applications have different types of data and workloads.

For example:

### Banking

```text
Accounts
Transactions
Customers
Payments
```

Relationships and strong transactional guarantees are extremely important.

A relational database is a natural fit.

---

### Social Media

Imagine a social-media application:

```text
Users
Posts
Comments
Likes
Followers
Messages
Notifications
Images
Videos
Stories
```

The amount of data can become enormous.

The structure of some data can also change frequently.

For example:

```text
Post
 ├── text
 ├── images
 ├── videos
 ├── hashtags
 ├── reactions
 ├── comments
 └── metadata
```

At huge scale, the application may need:

- massive distributed storage
- horizontal scaling
- flexible data models
- high availability
- geographically distributed infrastructure
- specialized data models

This led to the development and adoption of many **NoSQL and distributed database systems**.

### Important interview point

Do **not** say:

> "SQL cannot handle social media."

SQL databases absolutely **can** power social-media applications.

The correct statement is:

> Relational databases can support social-media applications, but at very large scale, different database models and distributed architectures may be useful depending on the workload.

---

# 2. Why Can't We Just Use SQL For Everything?

Because there is no database model that is optimal for every possible workload.

Different applications have different requirements.

| Requirement                   | Possible suitable approach     |
| ----------------------------- | ------------------------------ |
| Complex relationships         | Relational database            |
| Financial transactions        | Relational database often used |
| Flexible documents            | Document database              |
| Key-value access              | Key-value database             |
| Graph relationships           | Graph database                 |
| Massive distributed workloads | Distributed database systems   |
| Time-series data              | Time-series databases          |

The important engineering question is:

> **What are the application's data and workload requirements?**

Not:

> "Which database is universally the best?"

---

# 3. What Happens If We Build Social Media Using SQL?

We absolutely can.

For example:

```text
Users
----------------
id
name
email
password
```

```text
Posts
----------------
id
user_id
content
created_at
```

```text
Comments
----------------
id
post_id
user_id
content
created_at
```

```text
Likes
----------------
id
post_id
user_id
```

Relationships can be created using:

```text
Users
  │
  │ user_id
  ▼
Posts
  │
  │ post_id
  ▼
Comments
```

This is completely possible using a relational database.

The challenge appears when the system becomes extremely large.

For example:

```text
1 billion users
10 billion posts
100 billion likes
```

Now the system needs sophisticated:

- partitioning
- replication
- caching
- indexing
- sharding
- load balancing
- distributed processing

A SQL database can also support some of these techniques.

Therefore:

> **SQL itself is not the problem. Scaling a database system to a particular workload is the engineering challenge.**

---

# 4. Are Data Stored in Rows or Columns?

This question needs careful understanding.

In a traditional relational table, data is logically represented using **both rows and columns**.

Example:

```text
Users

id | name  | age
---|-------|----
1  | Ali   | 20
2  | Fahad | 21
3  | Ahmed | 22
```

### Column

A column represents an attribute/field.

```text
name
```

contains:

```text
Ali
Fahad
Ahmed
```

### Row

A row represents one record/entity.

```text
1 | Ali | 20
```

represents one user.

So:

```text
Column = attribute/field

Row = record/instance
```

---

# 5. Why Not Store Everything as Rows?

Actually, relational databases **do store records as rows logically**.

The important distinction is between:

### Logical model

How we understand the data:

```text
Table
 ↓
Rows + Columns
```

### Physical storage

How the database actually stores data internally.

The database may use different physical storage structures depending on its engine.

So don't say:

> "SQL stores data only in columns."

or:

> "SQL stores data only in rows."

The relational model consists of **relations represented through rows and columns**.

---

# 6. Row-Oriented vs Column-Oriented Storage

This is a more advanced interview topic.

There are database/storage systems that physically organize data differently.

## Row-oriented

Conceptually:

```text
Row 1 → id, name, age, email
Row 2 → id, name, age, email
Row 3 → id, name, age, email
```

Good for many transactional workloads where we frequently need complete records.

---

## Column-oriented

Conceptually:

```text
IDs:
1, 2, 3

Names:
Ali, Fahad, Ahmed

Ages:
20, 21, 22
```

This can be useful for analytical workloads where we frequently process particular columns across many rows.

Example:

```sql
SELECT AVG(age)
FROM users;
```

A column-oriented system can potentially read the `age` data without reading every other field.

### Interview distinction

> **Rows and columns describe the logical relational model. Row-oriented and column-oriented describe physical data organization/storage approaches.**

---

# 7. What Is Redundant Data?

**Redundant data** means unnecessary repetition of the same information.

Suppose we have:

| name  |  id | lastName | address | itemOrder | cost | orderId |
| ----- | --: | -------- | ------- | --------- | ---: | ------: |
| Fahad | 101 | Shah     | Bisha   | Burger    |   20 |     501 |
| Fahad | 101 | Shah     | Bisha   | Pizza     |   30 |     502 |
| Fahad | 101 | Shah     | Bisha   | Juice     |   10 |     503 |

Notice:

```text
Fahad
101
Shah
Bisha
```

are repeated.

This is redundant data.

---

# 8. Problems With Redundant Data

Redundancy causes several problems.

## 8.1 Wasted Storage

If the same information is repeated thousands of times, unnecessary storage is consumed.

---

## 8.2 Update Anomaly

Suppose Fahad changes his address.

We may need to update:

```text
Row 1
Row 2
Row 3
Row 4
...
```

If we update only some rows:

```text
Fahad → Bisha
Fahad → Riyadh
Fahad → Bisha
```

the database now contains contradictory information.

---

## 8.3 Insert Anomaly

Sometimes we cannot insert information about an entity without also inserting unrelated information.

For example, if a table is designed around orders, storing a new customer before they make an order may become awkward.

---

## 8.4 Delete Anomaly

Suppose a customer has only one order.

If we delete that order, we might accidentally lose the only stored information about the customer.

These problems are called **data anomalies**.

---

# 9. How Do We Reduce Redundant Data?

This leads to:

# Normalization

---

# 10. What Is Normalization?

**Normalization** is a database design technique used primarily in relational databases to organize data into related tables in order to reduce unnecessary redundancy and prevent data anomalies.

The goal is not simply:

> "Make fewer rows."

The goal is to design data so that:

- unnecessary duplication is reduced
- relationships are represented properly
- updates are safer
- insert/delete anomalies are reduced
- data integrity is improved

---

# 11. Example Before Normalization

Suppose we have:

| name  |  id | lastName | address | itemOrder | cost | orderId |
| ----- | --: | -------- | ------- | --------- | ---: | ------: |
| Fahad | 101 | Shah     | Bisha   | Burger    |   20 |     501 |
| Fahad | 101 | Shah     | Bisha   | Pizza     |   30 |     502 |
| Fahad | 101 | Shah     | Bisha   | Juice     |   10 |     503 |

The customer information is repeated.

```text
Fahad
101
Shah
Bisha
```

appears repeatedly.

---

# 12. Normalized Design

We can separate the information.

## Customers

|  id | name  | lastName | address |
| --: | ----- | -------- | ------- |
| 101 | Fahad | Shah     | Bisha   |

## Orders

| orderId | customerId | itemOrder | cost |
| ------: | ---------: | --------- | ---: |
|     501 |        101 | Burger    |   20 |
|     502 |        101 | Pizza     |   30 |
|     503 |        101 | Juice     |   10 |

Now:

```text
Customers
    │
    │ id
    │
    ▼
Orders.customerId
```

Instead of repeating customer information, we store it once.

---

# 13. Why Is This Better?

Previously:

```text
Fahad → repeated
Shah → repeated
Bisha → repeated
```

Now:

```text
Customer information → stored once
Order information → stored separately
```

This reduces unnecessary duplication.

It also makes updates easier.

If Fahad changes his address:

```text
Customers
id = 101
address = Riyadh
```

We change it once.

---

# 14. But How Do We Know Which Order Belongs to Fahad?

This is where **keys and relationships** become important.

We give each customer a unique identifier:

```text
Customer ID = 101
```

Then the Orders table stores:

```text
customerId = 101
```

So:

```text
Customers
101 → Fahad

Orders
501 → customerId 101
502 → customerId 101
503 → customerId 101
```

Now the database can establish the relationship.

---

# 15. What Is a Primary Key?

A **primary key** is a column or set of columns that uniquely identifies each row in a relational table.

Example:

```text
Customers

id | name
---|------
101| Fahad
102| Ali
103| Ahmed
```

Here:

```text
id
```

can be the primary key.

Properties:

- uniquely identifies a row
- cannot contain duplicate values
- cannot be NULL
- should be stable enough for its intended use

---

# 16. Can a Phone Number Be a Primary Key?

Technically, **yes**, if it satisfies the required uniqueness and non-null constraints.

For example:

```text
phone_number
+966500000001
+966500000002
```

But whether it is a good primary-key design depends on the application.

Phone numbers can:

- change
- be reassigned
- have formatting issues
- contain country-code differences

Therefore, applications commonly use an internal ID such as:

```text
user_id = 101
```

and put a **UNIQUE constraint** on the phone number if needed.

---

# 17. Can a Username Be a Primary Key?

Technically, yes.

For example:

```text
username
fahad
ali
ahmed
```

But again, it may not be the best choice.

A username can potentially change.

A stable internal identifier is often preferable:

```text
id = 101
username = "fahad"
```

with:

```text
username UNIQUE
```

---

# 18. Primary Key vs Unique Key

Important interview question.

### Primary Key

Used to identify a row.

Typically:

- unique
- NOT NULL
- one primary-key constraint per table

### UNIQUE constraint

Ensures values are unique.

A table can generally have multiple unique constraints.

Example:

```text
id          → PRIMARY KEY
email       → UNIQUE
username    → UNIQUE
```

---

# 19. Foreign Key

The `customerId` in the Orders table can be a **foreign key**.

```text
Customers

id
101
102
103
```

```text
Orders

orderId | customerId
--------|-----------
501     | 101
502     | 101
503     | 102
```

The foreign key creates a relationship between the tables.

```text
Customers.id
     ↑
     │
Orders.customerId
```

---

# 20. Primary Key vs Foreign Key

| Primary Key         | Foreign Key                                  |
| ------------------- | -------------------------------------------- |
| Identifies a row    | References a row in another table            |
| Unique in its table | Can usually repeat                           |
| Cannot be NULL      | May be NULL depending on relationship/design |
| Example: `Users.id` | Example: `Orders.user_id`                    |

---

# 21. Normalization Is Not Just "Saving Space"

This is an important interview correction.

A beginner may say:

> "Normalization is used to save storage."

That is partly true, but incomplete.

The bigger purpose is:

> **Reduce unnecessary redundancy and prevent data anomalies while maintaining data integrity.**

Storage savings can be a benefit, but it is not the entire purpose.

---

# 22. Normal Forms

If an interviewer asks about normalization in depth, know these terms.

### 1NF — First Normal Form

Generally requires:

- atomic values
- no repeating groups in a field
- each field contains a single value in the relevant relational design

Bad:

| id  | name  | skills          |
| --- | ----- | --------------- |
| 1   | Fahad | JS, React, Node |

A simple 1NF-oriented design might represent skills separately.

---

### 2NF — Second Normal Form

A table should be in 1NF and non-key attributes should depend on the **whole primary key**, particularly relevant when the primary key is composite.

---

### 3NF — Third Normal Form

A table should be in 2NF and non-key attributes should not depend transitively on another non-key attribute.

A simple mental model:

```text
Key
 ↓
Non-key attribute
```

rather than:

```text
Key
 ↓
Non-key attribute
 ↓
Another non-key attribute
```

For interviews, understand the dependency idea rather than memorizing definitions.

---

# 23. MongoDB's Approach

Your lecture says:

> "MongoDB says store the data as it comes."

This is a useful beginner description, but technically it needs refinement.

MongoDB is a **document-oriented database**.

Instead of requiring everything to fit into normalized relational tables, it allows data to be modeled as documents.

Example:

```json
{
  "_id": 101,
  "name": "Fahad",
  "address": {
    "city": "Bisha"
  },
  "orders": [
    {
      "orderId": 501,
      "item": "Burger",
      "cost": 20
    },
    {
      "orderId": 502,
      "item": "Pizza",
      "cost": 30
    }
  ]
}
```

The data can naturally be represented as a document.

---

# 24. SQL Normalization vs MongoDB Document Modeling

Relational design might look like:

```text
Users
   │
   └── Orders
```

MongoDB may choose:

```text
User
 ├── name
 ├── address
 └── orders[]
```

But MongoDB can also use references between documents.

So:

> MongoDB does not mean "never normalize."

It means the document model gives developers more flexibility to decide when to **embed** and when to **reference** data.

---

# 25. Embedding vs Referencing in MongoDB

## Embedding

Put related data inside the same document.

```json
{
  "name": "Fahad",
  "address": {
    "city": "Bisha"
  }
}
```

Useful when the related data:

- belongs closely to the parent
- is usually read together
- has manageable size

---

## Referencing

Store an ID/reference to another document.

```json
{
  "userId": 101,
  "orderId": 501
}
```

Useful when:

- data is shared
- data grows independently
- embedding would make documents too large
- independent updates are important

---

# 26. Vertical Scaling

**Vertical scaling = Scale Up**

Increase the resources of a single machine.

For example:

```text
Server
│
├── 8 GB RAM
├── 4 CPU cores
└── 500 GB storage
```

Upgrade:

```text
Server
│
├── 64 GB RAM
├── 32 CPU cores
└── 2 TB storage
```

We upgraded the same server.

---

# 27. Mobile Phone Example

Your example is useful as a mental model.

Suppose your phone has:

```text
128 GB storage
```

You upgrade to a device/storage configuration with:

```text
512 GB
```

This is analogous to **scaling up** because the individual machine's resources become larger.

However, a phone's hardware upgrade is not literally the same engineering process as vertically scaling a database server.

---

# 28. Horizontal Scaling

**Horizontal scaling = Scale Out**

Instead of making one server bigger, we add more servers.

```text
Server 1
Server 2
Server 3
Server 4
```

Instead of:

```text
One huge server
```

we have:

```text
Multiple servers
```

---

# 29. Mobile Phone Analogy

Your example:

> Buy another phone to store more data.

This is a rough analogy for horizontal scaling:

```text
Phone A
Phone B
Phone C
```

But in real distributed systems, additional servers are connected and coordinated as part of one system.

Simply buying another independent phone would not automatically create a horizontally scaled database.

---

# 30. Vertical vs Horizontal Scaling

```text
VERTICAL
───────────────

      BIGGER
        ↑
   ┌─────────┐
   │ SERVER  │
   │         │
   │ CPU ↑   │
   │ RAM ↑   │
   │ Storage↑│
   └─────────┘
```

```text
HORIZONTAL
────────────────

   ┌─────────┐
   │ Server 1│
   └─────────┘
        │
   ┌─────────┐
   │ Server 2│
   └─────────┘
        │
   ┌─────────┐
   │ Server 3│
   └─────────┘
```

---

# 31. Is SQL Only Vertically Scalable?

This is an important correction.

Your original notes say:

> SQL → vertical
> MongoDB → vertical + horizontal

This is **too simplistic and technically incorrect**.

Relational databases can also scale horizontally.

Examples of techniques include:

- replication
- partitioning
- sharding
- distributed SQL systems
- read replicas
- database clustering

Examples of distributed SQL systems include:

- Google Spanner
- CockroachDB
- YugabyteDB

So the correct statement is:

> **Traditional relational databases have historically had challenges with horizontal scaling, especially when strong relational consistency and complex joins must span partitions, but modern SQL systems can scale horizontally using distributed techniques.**

---

# 32. Why Is Horizontal Scaling More Complicated for Relational Databases?

Suppose we have:

```text
Users
Orders
Payments
```

and we distribute them across servers:

```text
Server A
Users

Server B
Orders

Server C
Payments
```

Now imagine:

```text
User A
   ↓
Order
   ↓
Payment
```

The application may need to query or update information across multiple servers.

Now we have distributed coordination.

Problems become more complicated:

- joins across machines
- transactions across machines
- consistency
- network failures
- latency
- distributed locking/coordination
- partitioning strategy

---

# 33. Why Does Data Distribution Become Difficult?

Imagine:

```text
Server A
User data
```

and:

```text
Server B
Order data
```

Now we need:

```text
"Give me all orders of user 101."
```

The database may need to locate data across servers.

It becomes more complex if a transaction modifies data on multiple servers.

For example:

```text
Transfer money
     ↓
Account A → Server 1
Account B → Server 2
```

Now the transaction crosses a network boundary.

That is much more complicated than:

```text
Account A
Account B
     ↓
Same database server
```

---

# 34. Why Can MongoDB Scale Horizontally?

MongoDB supports **sharding**.

A MongoDB cluster can distribute portions of a collection across multiple servers.

Conceptually:

```text
                    MongoDB Cluster
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
           Shard 1    Shard 2    Shard 3
```

Each shard stores a portion of the data.

---

# 35. What Is Sharding?

**Sharding = Horizontal partitioning of data across multiple machines.**

Suppose we have:

```text
1 billion users
```

Instead of keeping all data on one machine:

```text
Server A
1 billion users
```

we can distribute it:

```text
Server A → part of users
Server B → part of users
Server C → part of users
Server D → part of users
```

Together, the servers form one logical database system.

---

# 36. Example of Sharding

Suppose user IDs are:

```text
1 → 1,000,000
```

A simplified example:

```text
Shard 1
IDs 1–250,000

Shard 2
IDs 250,001–500,000

Shard 3
IDs 500,001–750,000

Shard 4
IDs 750,001–1,000,000
```

This is only a conceptual example.

Real systems can use more sophisticated **shard keys** and partitioning strategies.

---

# 37. What Is a Shard Key?

A **shard key** determines how documents are distributed across shards.

For example:

```text
userId
```

could be used as part of a sharding strategy.

A good shard key helps:

- distribute data evenly
- distribute writes
- route queries efficiently

A poor shard key can cause a **hotspot**, where too much traffic goes to one shard.

---

# 38. Why Does Sharding Help?

Suppose one server can process:

```text
10,000 requests/second
```

Conceptually, distributing the workload across several servers can provide greater total capacity.

```text
Shard 1 → 10,000
Shard 2 → 10,000
Shard 3 → 10,000
```

Potential aggregate capacity:

```text
~30,000 requests/second
```

Actual performance depends on workload, hardware, network, query patterns, and architecture.

---

# 39. Sharding vs Replication

This is one of the most important distinctions.

## Sharding

**Splits data.**

```text
Shard 1 → A–F
Shard 2 → G–M
Shard 3 → N–Z
```

Purpose:

> Scale storage and workload horizontally.

---

## Replication

**Copies data.**

```text
Primary
   │
   ├── Replica 1
   └── Replica 2
```

Purpose:

> Improve redundancy, availability, and recovery capabilities.

### Easy memory trick

```text
SHARDING
= Divide

REPLICATION
= Copy
```

---

# 40. Why Not Keep Only One Database Copy?

Suppose:

```text
Database Server
      ↓
Data
```

What happens if:

- hardware fails?
- disk fails?
- server is destroyed?
- data becomes corrupted?
- a disaster occurs?

We may lose access to our data.

Therefore, production systems often maintain multiple copies and backups.

---

# 41. What Is Replication?

**Replication** is the process of maintaining copies of data on multiple database nodes.

Example:

```text
                Primary
                   │
          ┌────────┴────────┐
          ↓                 ↓
      Replica 1         Replica 2
```

If the primary becomes unavailable, depending on the system's architecture, another replica may be able to take over.

---

# 42. Why Do We Need Replication?

Replication can provide:

### 1. High availability

If one node fails, another may continue serving the system.

### 2. Redundancy

There are multiple copies of the data.

### 3. Read scaling

Some architectures allow read requests to be distributed across replicas.

### 4. Disaster recovery support

Copies in different locations can reduce the impact of some failures.

---

# 43. Is a Replicated Database a Distributed Database?

A system where data/services are distributed across multiple networked machines is generally considered a **distributed database system** when the database is managed across those nodes.

But be precise:

> Replication is one technique used in distributed database architectures.

Replication itself is not synonymous with the entire concept of distributed databases.

---

# 44. Another Benefit of Multiple Databases/Servers

Your notes correctly identify another important advantage:

> Multiple servers can share the workload.

Imagine:

```text
100,000 requests/second
```

If one server handles everything:

```text
        100,000 requests
               ↓
          One server
               ↓
          Overloaded
```

With multiple servers:

```text
30,000 → Server A
30,000 → Server B
40,000 → Server C
```

The workload can be distributed.

This can improve:

- throughput
- availability
- scalability

---

# 45. Challenges of Distributed Databases

Distributed databases introduce powerful capabilities, but they also introduce complexity.

Major challenges include:

### 1. Network failures

Servers communicate over networks.

Networks can fail.

```text
Server A ─────X───── Server B
```

---

### 2. Synchronization

Multiple copies may need to stay sufficiently up to date.

---

### 3. Consistency

Different nodes may temporarily have different states.

---

### 4. Distributed transactions

A transaction may involve multiple servers.

---

### 5. Latency

Communication between machines takes time.

---

### 6. Failure handling

The system must determine what happens when one node disappears.

---

### 7. Conflict resolution

Some distributed systems need mechanisms to resolve competing updates.

---

# 46. Banking and Distributed Transactions

Banking is a useful example.

Suppose:

```text
Account A → Server 1
Account B → Server 2
```

We want:

```text
A - $1000
B + $1000
```

What happens if:

```text
Server 1 → succeeds
Server 2 → fails
```

We cannot simply leave the system half-completed.

Distributed transaction protocols can coordinate such operations.

However, the exact architecture varies, and not every distributed database uses a simple model where a "master locks all distributed servers."

---

# 47. Master/Primary and Replicas

A common architecture is:

```text
              Primary
                 │
        ┌────────┴────────┐
        ↓                 ↓
     Replica 1        Replica 2
```

The primary may accept writes while replicas receive changes.

Some systems support different read/write configurations.

Modern databases can use more sophisticated consensus and leader-election mechanisms.

So don't memorize:

> "Master always locks every server."

That is not universally true.

---

# 48. MongoDB and Social Media

Your notes say:

> "MongoDB is best for social media."

This should be changed for an interview.

Better:

> **MongoDB can be a suitable choice for some social-media workloads, but there is no universally best database for social media.**

A social-media system might use several technologies at once.

For example:

```text
Social Media System

SQL Database
      ↓
Accounts / transactions

MongoDB
      ↓
Document-oriented application data

Object Storage
      ↓
Images / videos

Redis
      ↓
Caching / fast temporary data

Search Engine
      ↓
Text search
```

Large systems commonly use **polyglot persistence**—different storage technologies for different workloads.

---

# 49. CAP Theorem

CAP is extremely important when studying distributed databases.

CAP stands for:

```text
C → Consistency
A → Availability
P → Partition Tolerance
```

It concerns **distributed data systems**.

---

# 50. C — Consistency

In CAP, consistency means:

> Every successful read receives the most recent successful write (or an error), according to the system's consistency model.

For a simplified example:

```text
User changes name:

Old:
Fahad

New:
Ahmed
```

If a write succeeds, a strongly consistent system aims to ensure subsequent reads see:

```text
Ahmed
```

rather than an old value.

### Important

CAP consistency is **not exactly the same concept as the "C" in ACID**.

They are related ideas but have different meanings.

---

# 51. A — Availability

Availability means:

> Every request to a non-failed node receives a response, without requiring the system to wait indefinitely for unavailable parts of the system.

Simplified:

```text
Request
   ↓
System
   ↓
Response
```

The system continues responding even when certain failures occur.

But the response may not necessarily contain the newest data if the system chooses availability over strong consistency during a partition.

---

# 52. P — Partition Tolerance

A **network partition** occurs when parts of a distributed system cannot communicate with each other.

Example:

```text
Server A        Server B
   │               │
   └──────X────────┘
       Network
       failure
```

Server A and Server B are still running, but they cannot communicate properly.

Partition tolerance means:

> The distributed system continues operating despite communication failures between nodes.

---

# 53. Why Is Partition Tolerance Important?

Because in a distributed system, network failures can happen.

Imagine:

```text
           Internet / Network
                  X
                 / \
                /   \
          Server A   Server B
```

The servers cannot simply assume that communication will always work.

Therefore, distributed systems need to decide how to behave during a partition.

---

# 54. The CAP Trade-off

The commonly taught CAP idea is:

> When a network partition occurs, a distributed system cannot simultaneously guarantee both strong consistency and availability.

So during a partition, the system has to make a trade-off between:

```text
Consistency
     vs
Availability
```

while partition tolerance is required because the partition has actually occurred.

---

# 55. Simple CAP Example

Suppose we have:

```text
Server A
Balance = $1000

Server B
Balance = $1000
```

Network partition:

```text
Server A  X  Server B
```

Now a user sends:

```text
Withdraw $500
```

to Server A.

At the same time, another request reaches Server B.

If both independently accept operations, their states can diverge.

The system can instead choose to reject/wait for some operations to preserve stronger consistency.

That reduces availability during the partition.

Alternatively, it may continue serving requests, but reads may temporarily return different/stale information.

That is the core trade-off.

---

# 56. CAP Does NOT Mean "Choose Any Two"

A common interview statement is:

> "CAP says you can choose any two of the three."

This is an oversimplification.

A better explanation is:

> **In the presence of a network partition, a distributed system cannot simultaneously guarantee both strong consistency and availability. Partition tolerance is therefore unavoidable for a system that must continue operating despite network partitions.**

This is the interview-safe explanation.

---

# 57. CAP vs ACID

Very important.

### ACID

Describes properties of **database transactions**.

```text
Atomicity
Consistency
Isolation
Durability
```

### CAP

Describes a fundamental trade-off in **distributed systems** under network partition.

```text
Consistency
Availability
Partition Tolerance
```

Notice that both have a `C`, but:

```text
ACID C ≠ CAP C
```

They are different concepts.

---

# 58. NoSQL Meaning

NoSQL is commonly expanded as:

> **Not Only SQL**

It does not simply mean:

> "No SQL."

NoSQL is a broad category containing different database models, including:

```text
Document
Key-Value
Wide-Column
Graph
```

Examples:

```text
MongoDB → Document

Redis → Key-Value

Cassandra → Wide-Column

Neo4j → Graph
```

---

# 59. Does "Not Only SQL" Mean NoSQL Can Act Like SQL?

Not exactly.

The phrase means that databases in this category are **not limited to the traditional relational/SQL model**.

It does not mean:

> "MongoDB becomes MySQL whenever we want."

MongoDB has its own document-oriented model and query mechanisms.

---

# 60. SQL vs NoSQL — Better Mental Model

Don't think:

```text
SQL
vs
NoSQL
```

as:

```text
Old
vs
New
```

or:

```text
Bad
vs
Good
```

Think:

```text
Different data models
        +
Different workloads
        +
Different scaling requirements
        +
Different consistency requirements
        ↓
Different database choices
```

---

# 61. Sharding + Replication Together

Large distributed systems can use both.

For example:

```text
                    Cluster
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Shard 1      Shard 2      Shard 3
          │            │            │
       ┌──┴──┐       ┌─┴──┐       ┌─┴──┐
       ↓     ↓       ↓    ↓       ↓    ↓
     Copy  Copy    Copy  Copy    Copy  Copy
```

Conceptually:

```text
Sharding
= distribute different data

Replication
= keep copies of each portion
```

This provides both:

- horizontal scaling
- redundancy/high availability

depending on the architecture.

---

# 62. Example: Large Social Media Database

Imagine:

```text
500 million users
```

We could conceptually have:

```text
                 Database Cluster
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      Shard 1        Shard 2        Shard 3
        │              │              │
      Users          Users          Users
     1–100M        100–300M       300–500M
```

Each shard could itself have replicas:

```text
Shard 1
 ├── Primary
 ├── Replica
 └── Replica
```

So:

```text
Sharding
→ scale

Replication
→ redundancy / availability
```

---

# 63. Interview Question: Why Do We Need Normalization?

### Answer

> Normalization organizes relational data into related tables to reduce unnecessary redundancy and prevent insertion, update, and deletion anomalies while maintaining data integrity.

---

# 64. Interview Question: What Is Redundancy?

### Answer

> Redundancy is unnecessary repetition of the same data. It can increase storage usage and cause update, insertion, and deletion anomalies.

---

# 65. Interview Question: What Is a Primary Key?

### Answer

> A primary key is a column or combination of columns that uniquely identifies each row in a relational table. It must uniquely identify records and cannot be NULL.

---

# 66. Interview Question: Can a Phone Number Be a Primary Key?

### Answer

> Technically yes, if it is unique and non-null, but an internal immutable identifier is often a better primary key because phone numbers can change or be reassigned.

---

# 67. Interview Question: What Is a Foreign Key?

### Answer

> A foreign key is a column or set of columns that references a key in another table and is used to represent relationships between tables.

---

# 68. Interview Question: What Is Vertical Scaling?

### Answer

> Increasing the resources of an existing server, such as CPU, RAM, or storage.

---

# 69. Interview Question: What Is Horizontal Scaling?

### Answer

> Adding more servers/nodes and distributing workload or data among them.

---

# 70. Interview Question: Can SQL Databases Scale Horizontally?

### Answer

> Yes. Relational databases can use replication, partitioning, sharding, and distributed SQL architectures. Historically, horizontal scaling has often been more complex for relational workloads because relationships, joins, and distributed transactions can require coordination across machines.

---

# 71. Interview Question: What Is Sharding?

### Answer

> Sharding is distributing portions of a dataset across multiple database nodes so that storage and workload can be scaled horizontally.

---

# 72. Interview Question: Sharding vs Replication?

### Answer

> Sharding divides the dataset across nodes, while replication creates copies of data across nodes.

Easy:

```text
Sharding   = Divide
Replication = Copy
```

---

# 73. Interview Question: Why Do We Need Replication?

### Answer

> Replication provides additional copies of data, which can improve redundancy and availability and can support disaster recovery and read scaling depending on the architecture.

---

# 74. Interview Question: What Is a Distributed Database?

### Answer

> A distributed database system manages data across multiple network-connected machines while presenting the data as part of a coordinated database system.

---

# 75. Interview Question: What Are the Challenges of Distributed Databases?

Important points:

```text
Network failures
Synchronization
Consistency
Latency
Distributed transactions
Conflict handling
Failure recovery
Operational complexity
```

---

# 76. Interview Question: What Is CAP Theorem?

### Answer

> CAP describes a fundamental trade-off in distributed systems: when a network partition occurs, a system cannot simultaneously guarantee both strong consistency and availability.

The three concepts are:

```text
C → Consistency
A → Availability
P → Partition Tolerance
```

---

# 77. Interview Question: What Is Partition Tolerance?

### Answer

> Partition tolerance means the distributed system continues to operate despite network communication failures that divide nodes into separate groups.

---

# 78. Interview Question: What Is the Difference Between CAP Consistency and ACID Consistency?

### Answer

> They are different concepts. ACID consistency concerns preserving database integrity rules across transactions. CAP consistency concerns whether distributed reads see the appropriate latest state across nodes, particularly during network partitions.

---

# 79. Interview Question: Is MongoDB Always Better for Social Media?

### Answer

> No. MongoDB can be suitable for some social-media workloads, but database choice depends on the application's data model, queries, consistency requirements, transaction requirements, scale, and operational architecture.

---

# 80. Interview Question: Is SQL Only Vertically Scalable?

### Answer

> No. SQL databases can also scale horizontally. However, distributing relational workloads can be challenging because relationships, joins, transactions, and consistency may require coordination across multiple machines.

---

# 81. Interview Question: Why Is Horizontal Scaling Difficult?

### Answer

Because distributing data across machines introduces problems such as:

```text
Machine A       Machine B
   │               │
   └──── Network ──┘
```

Now operations may require:

- network communication
- coordination
- distributed transactions
- consistency management
- failure handling

A local operation can be much simpler than an operation involving multiple machines.

---

# 82. Interview Question: Does MongoDB Automatically Solve All Distributed-System Problems?

No.

MongoDB supports distributed architectures, but distributed systems remain difficult.

You still need to consider:

- shard-key design
- replication
- consistency
- network failures
- query routing
- balancing
- operational complexity
- latency

Using a distributed database does not make distributed-system problems disappear.

---

# 83. The Complete Mental Model

```text
                    DATABASE
                       │
       ┌───────────────┴────────────────┐
       │                                │
    Relational                       NoSQL
       │                                │
     SQL                         ┌──────┼──────┐
       │                         │      │      │
   Tables                    Document Key-Value Graph
       │
       ↓
Normalization
       │
       ↓
Reduce redundancy
       │
       ↓
Primary Key + Foreign Key
```

Then for scale:

```text
                    DATABASE
                       │
              ┌────────┴────────┐
              │                 │
         Vertical            Horizontal
         Scaling              Scaling
              │                 │
         Bigger Server      More Servers
                                │
                         ┌──────┴──────┐
                         │             │
                      Sharding      Replication
                         │             │
                       Divide         Copy
                         │             │
                         └──────┬──────┘
                                │
                       Distributed System
                                │
                                ↓
                           CAP Theorem
                       C — A — P trade-off
```

---

# 84. One Big Example

Imagine we build a social-media application.

## Step 1 — Users

```text
Users
-----
id
name
email
```

---

## Step 2 — Posts

```text
Posts
-----
id
user_id
content
created_at
```

The `user_id` connects a post to its author.

---

## Step 3 — Comments

```text
Comments
--------
id
post_id
user_id
content
```

---

## Step 4 — Redundancy Problem

If we put:

```text
name
email
address
```

inside every post:

```text
Post 1 → Fahad, email, address
Post 2 → Fahad, email, address
Post 3 → Fahad, email, address
```

we create unnecessary repetition.

Relational normalization can separate user information from post information.

---

## Step 5 — Application Becomes Huge

Suppose:

```text
10 million users
100 million posts
1 billion comments
```

One machine may eventually become insufficient.

---

## Step 6 — Vertical Scaling

Upgrade:

```text
Server
8 CPU
32 GB RAM
```

to:

```text
Server
64 CPU
256 GB RAM
```

This is vertical scaling.

---

## Step 7 — Horizontal Scaling

Add:

```text
Server A
Server B
Server C
Server D
```

Now the workload/data can be distributed.

---

## Step 8 — Sharding

```text
Shard 1 → portion of users/posts
Shard 2 → portion of users/posts
Shard 3 → portion of users/posts
```

The dataset is divided.

---

## Step 9 — Replication

Each shard can have copies:

```text
Shard 1
 ├── Primary
 ├── Replica
 └── Replica
```

Now the system has redundancy.

---

## Step 10 — Distributed-System Problem

Now servers communicate over a network.

A network failure can occur:

```text
Shard 1  ───X───  Replica
```

The system must decide how to handle reads/writes.

This leads into distributed consistency and availability considerations.

---

# 85. Final Revision Table

| Concept                  | Meaning                                                      |
| ------------------------ | ------------------------------------------------------------ |
| **Redundancy**           | Unnecessary repetition of data                               |
| **Normalization**        | Organizing relational data to reduce redundancy/anomalies    |
| **Primary Key**          | Unique identifier for a row                                  |
| **Foreign Key**          | Reference connecting related tables                          |
| **Vertical Scaling**     | Make one server more powerful                                |
| **Horizontal Scaling**   | Add more servers                                             |
| **Sharding**             | Divide data across servers                                   |
| **Replication**          | Copy data across servers                                     |
| **Distributed Database** | Database system operating across multiple networked machines |
| **SQL**                  | Structured Query Language / relational database ecosystem    |
| **NoSQL**                | Broad category of non-relational database models             |
| **MongoDB**              | Document-oriented NoSQL database                             |
| **CAP**                  | Consistency, Availability, Partition Tolerance               |

---

# 86. The Most Important Corrections From These Notes

For interviews, remember these carefully:

### ❌ Don't say:

> SQL can only scale vertically.

### ✅ Say:

> SQL databases can scale horizontally too, but distributed relational workloads can be more complex because of joins, relationships, transactions, and consistency.

---

### ❌ Don't say:

> MongoDB is the best database for social media.

### ✅ Say:

> MongoDB can be suitable for some social-media workloads, but database choice depends on requirements.

---

### ❌ Don't say:

> Sharding means making copies.

### ✅ Say:

> Sharding divides data; replication creates copies.

---

### ❌ Don't say:

> Replication is the same as backup.

### ✅ Say:

> Replication maintains additional operational copies, while backups provide recoverable copies and historical recovery capability.

---

### ❌ Don't say:

> CAP means choose any two.

### ✅ Say:

> During a network partition, a distributed system cannot simultaneously guarantee both strong consistency and availability.

---

### ❌ Don't say:

> Normalization is only for saving space.

### ✅ Say:

> Normalization primarily reduces unnecessary redundancy and data anomalies while improving data integrity.

---

### ❌ Don't say:

> NoSQL means no SQL.

### ✅ Say:

> NoSQL is commonly understood as "Not Only SQL" and refers broadly to non-relational database models.

---

# 87. 15 Questions You Should Be Able to Answer Without Looking at Notes

1. **Why did NoSQL databases emerge if SQL already existed?**
2. **Can SQL be used for social-media applications?**
3. **What is redundant data?**
4. **What problems does redundancy cause?**
5. **What is normalization?**
6. **What are 1NF, 2NF, and 3NF?**
7. **What is a primary key?**
8. **What is a foreign key?**
9. **What is vertical scaling?**
10. **What is horizontal scaling?**
11. **Can SQL databases scale horizontally?**
12. **What is sharding?**
13. **What is replication, and how is it different from sharding?**
14. **What problems occur in distributed databases?**
15. **Explain CAP theorem with a real-world example.**

If you can explain these **with your own example rather than memorized definitions**, you have understood the core of this lecture.
