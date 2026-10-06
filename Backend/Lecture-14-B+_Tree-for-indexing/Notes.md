# Lecture 14 — B+ Tree for Indexing

---

# 1. First: Why Do We Need an Index?

Suppose MongoDB has **10 million users**:

```text
Users collection

1. Fahad
2. Ahmed
3. Ali
4. Umar
...
10,000,000 users
```

You run:

```js
db.users.find({ lastName: "Ali" });
```

### Without an index

MongoDB may need to examine documents one by one:

```text
Document 1 → lastName = Ali? ❌
Document 2 → lastName = Ali? ❌
Document 3 → lastName = Ali? ✅
Document 4 → lastName = Ali? ❌
...
```

This is basically a **linear scan**.

Complexity:

```text
O(n)
```

where `n` = number of documents examined.

---

# 2. What Does an Index Do?

An index creates an additional data structure that helps MongoDB find documents faster.

For example:

```js
db.users.createIndex({ lastName: 1 });
```

MongoDB now has an index organized around `lastName`.

Conceptually:

```text
Index

Ahmed  → document reference
Ali    → document reference
Fahad  → document reference
Umar   → document reference
```

Now MongoDB can navigate the index rather than checking every document.

### Important

An index is **not the same thing as your original collection**.

Think:

```text
                MongoDB
                   |
        +----------+----------+
        |                     |
   Collection              Index
   actual data          search structure
```

The index requires additional storage.

---

# 3. Why Not Use an AVL Tree?

This is one of the most important questions of this lecture.

First understand what an AVL tree is.

## AVL Tree

AVL = **Adelson-Velsky and Landis**.

It is a **self-balancing Binary Search Tree (BST)**.

A simplified AVL tree might look like:

```text
             50
           /    \
         30      70
        /  \    /  \
      20   40  60   80
```

The basic rule is:

```text
Left side < Node < Right side
```

For example:

```text
             50
           /    \
        smaller  greater
```

AVL keeps the tree balanced so that searching remains:

```text
O(log n)
```

That sounds excellent.

So why don't databases simply use AVL trees?

---

# 4. The Main Problem with AVL Trees

The problem is **physical storage**.

An AVL tree is a **binary tree**.

That means each node has at most:

```text
2 children
```

For example:

```text
             50
            /  \
          30    70
         / \    / \
       20  40  60  80
```

Imagine millions of index entries.

The tree can become very tall.

A database does not usually keep all of this information in RAM.

A large database is stored on:

```text
SSD / HDD
```

And accessing storage is much slower than accessing RAM.

Therefore, databases want to minimize the number of times they have to go from one storage page/block to another.

---

# 5. The Key Idea: B+ Tree Has Many Children

Instead of:

```text
AVL:

             50
            /  \
          30    70
```

A B+ Tree can have many children:

```text
                    [30 | 60 | 90]
                  /      |      |      \
                 /       |      |       \
          values<30   30-60   60-90    values>=90
```

One node can contain **many keys** and therefore point to **many children**.

This is called a high **fan-out**.

### Why is this useful?

Because the tree becomes very short.

For example:

```text
AVL:

Level 1       50
             /  \
Level 2     ...  ...
           / \  / \
Level 3   ... ...
Level 4   ...
Level 5   ...
Level 6   ...
```

A B+ Tree might have:

```text
Level 1       [30 | 60 | 90]
             /    |    |    \
Level 2     ...  ...  ...   ...
             |    |    |    |
Level 3     ...  ...  ...   ...
```

The same huge amount of data can be represented with **far fewer levels**.

That means fewer storage-page accesses.

---

# 6. The Most Important Database Idea

When discussing database indexes, don't think only about:

> "How many CPU operations are required?"

Think about:

> **"How many disk/storage pages do I need to read?"**

This is extremely important.

For a database:

```text
CPU operation        → very cheap
RAM access           → very fast
SSD access           → slower
HDD access           → much slower
```

Therefore, database data structures are designed to reduce expensive storage I/O.

---

# 7. What Is a B Tree?

B Tree = **Balanced Tree**.

It is a multi-way search tree.

Unlike a Binary Search Tree:

```text
one node
   |
maximum 2 children
```

a B Tree can have many:

```text
keys
+
children
```

For example:

```text
              [20 | 40 | 60]
             /    |    |    \
            /     |    |     \
          <20   20-40 40-60   >60
```

The exact number of keys and children depends on the tree's **order/fan-out**.

---

# 8. What Is a B+ Tree?

A B+ Tree is a variation of a B Tree optimized for database/file-system style storage.

The major conceptual difference is:

### B Tree

Actual records/data may be stored in:

```text
internal nodes
+
leaf nodes
```

### B+ Tree

Internal nodes primarily contain:

```text
search keys
+
pointers/references
```

while the actual indexed record references are kept at the **leaf level**.

Simplified:

```text
                 ROOT
             [30 | 60 | 90]
            /    |    |    \
           /     |    |     \
        Leaf   Leaf  Leaf   Leaf
```

The leaves contain the searchable index entries.

---

# 9. Understanding a B+ Tree Node

Suppose we have:

```text
10 20 30 40 50 60 70 80
```

A simplified B+ Tree could look like:

```text
                    [30 | 50 | 70]
                  /      |      |      \
                 /       |      |       \
              [10,20] [30,40] [50,60] [70,80]
```

The root tells us where to go.

For example, search for:

```text
60
```

Start:

```text
[30 | 50 | 70]
```

60 is:

```text
>= 50
< 70
```

Therefore:

```text
        [30 | 50 | 70]
                 |
                 ↓
             [50,60]
                 |
                 ↓
                60
```

We don't need to examine every value.

---

# 10. Your Statement: "Small Nodes on the Left, Greater and Equal on the Right"

This idea is correct for a **Binary Search Tree**, but it needs to be adjusted for a B+ Tree.

For a simple BST:

```text
             50
            /  \
           <50  >=50
```

For example:

```text
             50
            /  \
          30    70
```

Everything on the left is smaller than 50.

Everything on the right is greater than 50.

But B+ Trees are **multi-way trees**, so a node can have multiple ranges:

```text
             [30 | 60 | 90]
            /     |     |     \
           /      |     |      \
         <30    30-60 60-90   >=90
```

So instead of only:

```text
smaller | greater
```

we have multiple ranges.

---

# 11. Why Is It Called "Balanced"?

A B+ Tree is balanced because:

> All leaf nodes are generally at the same depth.

Example:

```text
                  [40 | 80]
                /    |     \
               /     |      \
             Leaf   Leaf    Leaf
```

You don't get:

```text
Root
 |
Node
 |
Node
 |
Node
 |
Leaf
```

on one side while another leaf is directly below the root.

Keeping the leaves at the same level keeps search predictable.

---

# 12. What Is a Linked List?

You mentioned:

> "What is linglist?"

The term is **Linked List**.

A linked list is a data structure in which elements are connected using references/pointers.

For example:

```text
[10] → [20] → [30] → [40] → NULL
```

Each node contains:

```text
Data
+
Reference to next node
```

Conceptually:

```text
Node

+---------+---------+
|  Data   |  Next   |
+---------+---------+
```

For example:

```text
[10 | address of 20]
             |
             ↓
        [20 | address of 30]
                         |
                         ↓
                    [30 | NULL]
```

---

# 13. Why Is a Linked List Important in B+ Trees?

This is a very important B+ Tree feature.

The leaf nodes can be linked:

```text
[10,20,30] → [40,50,60] → [70,80,90]
```

This is extremely useful for **range queries**.

Suppose we ask:

```js
age >= 20 && age <= 80;
```

Once MongoDB finds the first relevant leaf:

```text
[20,30]
```

it can continue through the linked leaves:

```text
[20,30]
    ↓
[40,50,60]
    ↓
[70,80]
```

It doesn't need to repeatedly go back to the root.

That makes B+ Trees especially useful for range scans.

---

# 14. B Tree vs B+ Tree

| Feature                     | B Tree                                | B+ Tree                        |
| --------------------------- | ------------------------------------- | ------------------------------ |
| Multiple children           | Yes                                   | Yes                            |
| Balanced                    | Yes                                   | Yes                            |
| Internal nodes contain keys | Yes                                   | Yes                            |
| Data/record references      | Can appear in internal and leaf nodes | Typically stored at leaf level |
| Leaf nodes linked           | Not necessarily                       | Typically yes                  |
| Range queries               | Good                                  | Excellent                      |
| Sequential traversal        | Good                                  | Very efficient                 |
| Database indexing           | Possible                              | Very commonly used             |

### Easy way to remember

**B Tree:**

```text
Data can be found throughout the tree.
```

**B+ Tree:**

```text
Search/navigation information is in internal nodes.
Actual indexed entries are concentrated at the leaves.
Leaves are linked.
```

---

# 15. Why Are Linked Leaves So Useful?

Imagine searching:

```text
20 ≤ age ≤ 80
```

The B+ Tree first finds:

```text
20
```

Then it can walk through:

```text
20 → 25 → 30 → 35 → 40 → ... → 80
```

through the linked leaf pages.

This is much better than repeatedly performing independent searches.

This is one of the reasons B+ Trees are excellent for:

- range queries
- sorted results
- sequential scans
- database indexes

---

# 16. How Is Data Physically Stored in an HDD?

Now we move from the data structure to the physical storage device.

## HDD = Hard Disk Drive

An HDD is a mechanical storage device.

Conceptually, it contains:

```text
        Spinning platter
      ___________________
    /                     \
   |       tracks          |
   |   ------------        |
   |   ------------        |
   |   ------------        |
    \_____________________/

             ↑
           head
```

The platter rotates.

A read/write head moves over the platter.

Data is physically organized into areas such as:

```text
Platter
   ↓
Tracks
   ↓
Sectors
```

The operating system and storage system work with blocks/sectors rather than thinking:

```text
"document #1 is physically next to document #2"
```

---

# 17. HDD Physical Structure

A simplified mental model:

```text
HDD
│
├── Platters
│
├── Spindle
│
├── Read/Write Heads
│
├── Tracks
│
└── Sectors
```

### Platter

Circular disk where data is stored magnetically.

### Spindle

Rotates the platters.

### Read/Write Head

Reads or writes magnetic information.

### Track

A circular path on the platter.

### Sector

A subdivision of a track.

Modern storage abstractions are more complicated than this simplified model, but this is enough to understand database I/O.

---

# 18. Why HDD Access Is Expensive

Suppose the database needs data somewhere else.

The HDD may need to:

```text
1. Move the head
2. Wait for the platter to rotate
3. Read the required sector
```

Therefore random access can be expensive.

This is why databases try to minimize unnecessary storage accesses.

---

# 19. How Is Data Physically Stored in an SSD?

SSD = **Solid State Drive**.

Unlike an HDD:

```text
No spinning platter
No moving read/write head
```

Instead, SSDs use **NAND flash memory**.

Simplified hierarchy:

```text
SSD
 |
 +-- NAND Flash
       |
       +-- Chips
             |
             +-- Dies
                   |
                   +-- Planes
                         |
                         +-- Blocks
                               |
                               +-- Pages
```

The exact physical architecture varies between SSDs.

---

# 20. SSD Pages and Blocks

A very important distinction:

### Page

The smaller unit commonly used for reading/writing data.

### Block

A larger group of pages.

Conceptually:

```text
Block
│
├── Page
├── Page
├── Page
├── Page
└── Page
```

One important property of NAND flash is:

```text
Read → page-level
Program/write → page-level
Erase → block-level
```

This is why SSDs have different behavior from HDDs.

---

# 21. Does MongoDB Store Documents Directly in SSD Cells?

Not in the simple way you might imagine.

You should not think:

```text
MongoDB document
       ↓
SSD cell
```

Instead, the stack is approximately:

```text
MongoDB
   ↓
Storage Engine
   ↓
Operating System
   ↓
Filesystem
   ↓
SSD controller
   ↓
NAND flash
```

MongoDB's storage engine organizes database data into structures suitable for efficient storage and retrieval.

Therefore, MongoDB does not simply put all documents into one giant physical array.

---

# 22. HDD vs SSD

| Feature            | HDD             | SSD         |
| ------------------ | --------------- | ----------- |
| Moving parts       | Yes             | No          |
| Storage technology | Magnetic        | NAND flash  |
| Random access      | Relatively slow | Much faster |
| Sequential access  | Good            | Very good   |
| Mechanical delay   | Yes             | No          |
| Physical head      | Yes             | No          |
| Spinning platter   | Yes             | No          |

But remember:

> **SSD being faster does not mean storage access is free.**

RAM is still much faster.

Therefore database systems still care about:

```text
Page locality
Cache
Indexes
Number of I/O operations
```

---

# 23. What Is a Storage Page?

A database usually works with data in **pages** rather than individual bytes/documents.

Think of a page as a box:

```text
+--------------------------------+
|          DATABASE PAGE         |
|                                |
| Document A                     |
| Document B                     |
| Document C                     |
| Index information              |
| ...                            |
+--------------------------------+
```

The database can load a page from storage into memory.

Then it can operate on the data in RAM.

Conceptually:

```text
SSD/HDD
   ↓
Database page
   ↓
RAM
   ↓
CPU
```

This is another reason B+ Trees are useful: one tree node can correspond conceptually to a storage page and contain many keys.

---

# 24. Why B+ Tree Is Better Than AVL for Databases

Now combine everything.

### AVL

```text
Each node
   ↓
small number of keys
   ↓
few children
   ↓
tree becomes relatively tall
   ↓
more storage-page accesses
```

### B+ Tree

```text
One node/page
   ↓
many keys
   ↓
many children
   ↓
high fan-out
   ↓
short tree
   ↓
fewer storage-page accesses
```

This is the core answer.

### Important Interview Answer

> **We generally prefer B+ Tree–style structures for database indexes because they have high fan-out, produce shallow trees, work well with page-based storage, and support efficient sequential and range scans through linked leaf nodes. AVL trees are excellent in-memory balanced trees, but their binary structure causes greater tree height and less efficient storage-page utilization for large disk-based indexes.**

---

# 25. Is B+ Tree Search O(log n)?

Yes, at a high level:

```text
O(log n)
```

But database engineers often think in terms of:

> **Number of page I/Os**

rather than simply CPU comparisons.

For example:

```text
Root page
   ↓
Internal page
   ↓
Leaf page
```

Only a few pages might need to be read even when there are millions or billions of records.

That is the real advantage.

---

# 26. What Is BSON?

BSON stands for:

> **Binary JSON**

MongoDB stores documents using BSON.

However, there is an important correction:

### BSON is not simply "JSON converted into binary."

BSON is a **binary-encoded document format** designed for storing and transmitting data.

It is similar in spirit to JSON but supports additional data types.

---

# 27. JSON vs BSON

JSON example:

```json
{
  "name": "Fahad",
  "age": 22,
  "isStudent": true
}
```

Conceptually, BSON represents this information in a binary format.

MongoDB uses BSON documents.

---

# 28. Why Does MongoDB Use BSON?

BSON provides support for data types that ordinary JSON does not represent as directly.

For example:

- String
- Integer
- Double
- Boolean
- Array
- Embedded document
- Date
- Binary data
- ObjectId
- Decimal128
- Null
- Regular expression
- Timestamp

For example:

```js
{
  _id: ObjectId("..."),
  name: "Fahad",
  age: 22,
  createdAt: new Date()
}
```

`ObjectId` and `Date` are examples where BSON's richer type system is useful.

---

# 29. JSON vs BSON — Simple Comparison

| JSON                      | BSON                                     |
| ------------------------- | ---------------------------------------- |
| Text-based format         | Binary-encoded format                    |
| Human-readable            | Not intended for direct human reading    |
| Limited native data types | Richer data types                        |
| Common for APIs           | Used internally by MongoDB for documents |
| Smaller conceptual syntax | Contains type/length information         |

---

# 30. Is BSON Faster Than JSON?

Do not memorize:

> "BSON is always faster than JSON."

That is incorrect.

BSON is designed to make MongoDB document storage and traversal practical, with explicit type and length information and support for additional types.

Its advantages depend on the workload.

Also, BSON can sometimes be **larger than equivalent JSON text** because BSON contains additional type/length information.

---

# 31. How MongoDB Data Looks Conceptually

Suppose we have:

```js
{
  name: "Fahad",
  age: 22,
  skills: ["JavaScript", "React", "MongoDB"]
}
```

MongoDB sees this as a BSON document.

Conceptually:

```text
Database
   │
   └── Collection
          │
          ├── BSON Document
          │      ├── name
          │      ├── age
          │      └── skills
          │
          ├── BSON Document
          │
          └── BSON Document
```

---

# 32. How Everything Connects

This entire lecture is actually one story.

### Step 1 — We have data

```text
MongoDB documents
```

### Step 2 — Documents are represented as BSON

```text
Document
   ↓
BSON
```

### Step 3 — Documents are stored by the database storage engine

```text
MongoDB
   ↓
Storage Engine
```

### Step 4 — Storage eventually lives on persistent storage

```text
Storage Engine
      ↓
Filesystem / OS
      ↓
SSD / HDD
```

### Step 5 — Searching millions of documents directly is expensive

```text
10 million documents
       ↓
linear scan
       ↓
O(n)
```

### Step 6 — Create an index

```text
Index
  ↓
B+ Tree–style structure
```

### Step 7 — Search the index

```text
Root
 ↓
Internal node
 ↓
Leaf
```

### Step 8 — Find the document references

```text
Index entry
     ↓
Document location/reference
```

This is the complete mental model.

---

# 33. One Important Correction About "Physical Movement"

You may hear:

> "If data is sorted, insertion requires moving all the elements."

This is true for a simple **sorted array**.

For example:

```text
[10, 20, 30, 40, 50]
```

Insert:

```text
25
```

You may need:

```text
[10, 20, 25, 30, 40, 50]
```

and therefore shift elements.

But databases don't simply maintain their entire collection as one sorted array.

They use sophisticated storage structures such as:

```text
Pages
Indexes
B+ Tree–style structures
Caching
Storage engines
```

So don't imagine MongoDB physically shifting millions of documents every time you insert one document.

---

# 34. Indexes Have a Cost

Indexes are not free.

Suppose:

```js
db.users.createIndex({ lastName: 1 });
```

You gain:

```text
Faster reads
```

But you pay:

```text
Additional storage
+
Index maintenance
+
Potentially slower writes
```

When inserting a document:

```text
New document
     ↓
Collection updated
     +
Index updated
```

When deleting:

```text
Document deleted
     ↓
Corresponding index entries must also be maintained
```

Therefore:

> **Indexes improve appropriate queries but add storage and write-maintenance cost.**

---

# 35. Range Query Connection

Remember the distinction from the previous lecture.

This:

```js
db.users.find({ lastName: "Ali" });
```

is an:

> **Equality query**

This:

```js
db.users.find({
  age: {
    $gte: 20,
    $lt: 30,
  },
});
```

is a:

> **Range query**

Meaning:

```text
20 ≤ age < 30
```

B+ Trees are particularly useful for range queries because the leaf nodes can be traversed sequentially.

---

# 36. Interview Questions

### Q1. Why are B+ Trees commonly used for database indexes?

Because they have high fan-out, shallow height, efficient page utilization, and excellent range/sequential scan performance.

---

### Q2. Why not simply use an AVL Tree?

AVL trees are binary and therefore have relatively low fan-out. Large disk-based AVL indexes can require more tree levels and storage-page accesses. B+ Trees are designed around page/block-oriented storage.

---

### Q3. What is the biggest difference between AVL and B+ Tree?

```text
AVL:
Binary tree
At most 2 children per node

B+ Tree:
Multi-way tree
Many keys and children per node
```

---

### Q4. What is a B Tree?

A balanced multi-way search tree where nodes can contain multiple keys and children.

---

### Q5. What is a B+ Tree?

A B Tree variant in which internal nodes primarily guide searches, while indexed record references are stored at the leaf level, with leaves linked for efficient traversal.

---

### Q6. Why are B+ Tree leaves linked?

To make sequential and range traversal efficient.

---

### Q7. What is a linked list?

A data structure in which nodes contain data and references to other nodes.

```text
A → B → C → D
```

---

### Q8. Why is a linked list useful in B+ Trees?

Linked leaves allow the database to move from one range of sorted index entries to the next efficiently.

---

### Q9. What is fan-out?

The number of child pointers a tree node can have.

Higher fan-out means:

```text
more children per node
→ fewer levels
→ shallower tree
```

---

### Q10. What is BSON?

BSON stands for **Binary JSON**. It is MongoDB's binary-encoded document format and supports additional data types such as ObjectId and Date.

---

### Q11. Is BSON simply JSON converted into binary?

No. BSON is its own binary document format with type and length information and a richer type system.

---

### Q12. Is BSON always smaller than JSON?

No. BSON can sometimes be larger because it contains additional type and length information.

---

### Q13. What is an SSD?

A Solid State Drive that stores data using NAND flash memory and has no mechanical moving parts.

---

### Q14. What is an HDD?

A Hard Disk Drive that stores data magnetically on rotating platters and uses read/write heads.

---

### Q15. Why does the database care about storage pages?

Because accessing persistent storage is much more expensive than accessing CPU registers/RAM. Database structures try to reduce the number of page reads/writes.

---

### Q16. Why is a B+ Tree shallow?

Because each node can contain many keys and therefore have many children.

---

### Q17. What is the advantage of a shallow tree?

Fewer levels generally mean fewer storage-page accesses during lookup.

---

### Q18. What is an index?

An additional data structure that helps the database locate documents efficiently without scanning the entire collection.

---

### Q19. What is the disadvantage of indexes?

They consume additional storage and must be maintained when indexed data changes, which can increase write cost.

---

### Q20. What is the difference between an equality query and a range query?

```text
Equality:
age = 25

Range:
age >= 20 AND age < 30
```

---

# 37. Final Mental Model

Memorize this diagram:

```text
                    MongoDB
                       │
                 BSON Documents
                       │
                       ▼
                 Storage Engine
                       │
              ┌────────┴────────┐
              │                 │
         Collection          Index
          actual data       B+ Tree
                                │
                         ┌──────┴──────┐
                         │             │
                      Internal       Leaves
                       Nodes           │
                         │             │
                    navigation    linked together
                                       │
                              efficient range scan
                                       │
                                       ▼
                                  Data reference
                                       │
                                       ▼
                                Storage pages
                                       │
                              ┌────────┴────────┐
                              │                 │
                             SSD               HDD
```

### The core idea of Lecture 14

> **B+ Trees are not mainly chosen because "O(log n) is better than O(n)." AVL trees can also provide O(log n) searches. The deeper reason is that databases deal with large amounts of data stored on persistent storage. B+ Trees have high fan-out, remain shallow, fit naturally with page-based storage, and support efficient sequential/range traversal through linked leaves.**
