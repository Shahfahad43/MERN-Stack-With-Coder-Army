\# Day 13 — Internals of MongoDB



> \*\*Goal of this lecture:\*\* Understand how MongoDB searches data internally, why searching a large amount of data can be slow, why databases use indexes, and how data structures such as \*\*Binary Search Trees, AVL Trees, and B+ Trees\*\* help solve the problem.



\---



\# 1. First: SQL vs MongoDB Terminology



Before understanding MongoDB internals, we need to understand how data is represented in SQL and MongoDB.



\## SQL Database Terminology



Suppose we have a `users` table:



| id | firstName | lastName | age |

| -- | --------- | -------- | --- |

| 1  | Fahad     | Ali      | 20  |

| 2  | Ahmed     | Khan     | 22  |

| 3  | Umar      | Ali      | 25  |



\### Important SQL terms



| Term        | Meaning                                           |

| ----------- | ------------------------------------------------- |

| Database    | Collection of related data                        |

| Table       | Structure containing related records              |

| Row         | One complete record                               |

| Column      | One attribute/field of the records                |

| Cell        | One value at the intersection of a row and column |

| Record      | Another name for a row                            |

| Field       | Another name commonly used for a column/attribute |

| Primary Key | Column/value that uniquely identifies a record    |

| Foreign Key | Column that references a key in another table     |

| Index       | Data structure used to make searching faster      |

| Query       | Request for data or an operation on data          |



\### Example



```text

Table: users



&#x20;       Columns

&#x20;         ↓

id | firstName | lastName | age

\--------------------------------

1  | Fahad     | Ali      | 20     ← Row / Record

2  | Ahmed     | Khan     | 22     ← Row / Record

3  | Umar      | Ali      | 25     ← Row / Record

```



A \*\*row\*\* represents one user.



A \*\*column\*\* represents one property of users.



For example:



```text

lastName

```



is a column.



```text

Ali

```



is a value inside that column.



\---



\# 2. MongoDB Terminology



MongoDB is a \*\*document-oriented NoSQL database\*\*.



Instead of tables and rows, MongoDB primarily works with \*\*collections and documents\*\*.



Example:



```javascript

{

&#x20;   \_id: 1,

&#x20;   firstName: "Fahad",

&#x20;   lastName: "Ali",

&#x20;   age: 20

}

```



Another document:



```javascript

{

&#x20;   \_id: 2,

&#x20;   firstName: "Ahmed",

&#x20;   lastName: "Khan",

&#x20;   age: 22

}

```



\## MongoDB terminology



| SQL                | MongoDB     |

| ------------------ | ----------- |

| Database           | Database    |

| Table              | Collection  |

| Row / Record       | Document    |

| Column / Attribute | Field       |

| Cell / Value       | Field value |

| Primary Key        | `\_id`       |

| Index              | Index       |

| Query              | Query       |



\### The basic mapping



```text

SQL                         MongoDB



Database                    Database

&#x20;  ↓                           ↓

Table                       Collection

&#x20;  ↓                           ↓

Row                         Document

&#x20;  ↓                           ↓

Column                      Field

&#x20;  ↓                           ↓

Value                       Value

```



\---



\# 3. What Is a Document?



A MongoDB document is a BSON document containing fields and values.



Example:



```javascript

{

&#x20;   \_id: 101,

&#x20;   name: "Fahad",

&#x20;   age: 20,

&#x20;   city: "Bisha"

}

```



MongoDB stores documents in collections.



For example:



```text

Database

&#x20;  │

&#x20;  └── users collection

&#x20;         │

&#x20;         ├── document 1

&#x20;         ├── document 2

&#x20;         ├── document 3

&#x20;         └── document 4

```



\---



\# 4. Why Do We Care About Searching?



Suppose we have:



```text

10 users

```



Searching through 10 users is easy.



But imagine:



```text

10 million users

```



Now suppose we ask:



```text

Find all users whose lastName is "Ali".

```



MongoDB somehow needs to find those documents.



The important question becomes:



> \*\*How can a database find the required data quickly without checking every document one by one?\*\*



This is where \*\*DSA and indexing\*\* become extremely important.



\---



\# 5. Before Databases: What Is DSA?



The lecture assumes that you already know DSA.



You don't, so let's start from zero.



\## DSA = Data Structures + Algorithms



\### Data Structure



A \*\*data structure\*\* is a way of organizing and storing data so that we can work with it efficiently.



Examples:



```text

Array

Linked List

Stack

Queue

Tree

Hash Table

Graph

```



\### Algorithm



An \*\*algorithm\*\* is a step-by-step procedure for solving a problem.



Example:



> Find the number `50` in a list.



One possible algorithm:



```text

1\. Start from the first element.

2\. Compare it with 50.

3\. If it is 50 → stop.

4\. Otherwise move to the next element.

5\. Continue until found.

```



That is an algorithm.



\---



\# 6. What Is Big-O?



You will frequently hear:



```text

O(1)

O(n)

O(log n)

O(n²)

```



These describe how the amount of work grows as the amount of data increases.



We don't initially care about the exact number of milliseconds.



We care about the \*\*growth of the work\*\*.



\---



\# 7. O(1) — Constant Time



Suppose:



```javascript

const arr = \[10, 20, 30, 40, 50];



console.log(arr\[3]);

```



We directly access an element.



Whether the array contains:



```text

5 elements

```



or:



```text

5 billion elements

```



direct access is conceptually one lookup.



Therefore:



```text

O(1)

```



is called \*\*constant time\*\*.



\---



\# 8. O(n) — Linear Time



Suppose:



```text

10

20

30

40

50

```



and we want to find:



```text

50

```



If the data is unsorted, we may have to check:



```text

10 → no

20 → no

30 → no

40 → no

50 → YES

```



For `n` elements, in the worst case we may inspect all `n`.



Therefore:



```text

O(n)

```



This is called \*\*linear time\*\*.



\---



\# 9. Why Is O(n) a Problem?



Suppose:



```text

n = 10

```



At most around 10 elements need checking.



But:



```text

n = 1,000,000

```



Potentially around 1,000,000 elements.



And:



```text

n = 1,000,000,000

```



Potentially around one billion elements.



Therefore, databases need better search strategies.



\---



\# 10. Unsorted Data



Suppose we have:



```text

50

10

90

30

70

20

```



There is no useful ordering.



We want:



```text

70

```



We may have to search:



```text

50 → 10 → 90 → 30 → 70

```



Therefore:



```text

Search = O(n)

```



This is called \*\*linear search\*\*.



\---



\# 11. What If Data Is Sorted?



Now suppose the data is sorted:



```text

10

20

30

40

50

60

70

80

90

100

```



We want to find:



```text

70

```



Instead of checking every value, we can use \*\*Binary Search\*\*.



\---



\# 12. What Is Binary Search?



Binary means:



> \*\*Divide into two parts.\*\*



Binary search works on sorted data.



Suppose:



```text

10 20 30 40 50 60 70 80 90 100

```



We want:



```text

70

```



Look at the middle:



```text

10 20 30 40 50 | 60 70 80 90 100

&#x20;               ↑

&#x20;             middle

```



Middle is `50`.



We know:



```text

70 > 50

```



Therefore, we don't need to search:



```text

10 20 30 40

```



We eliminate half the data.



Now:



```text

60 70 80 90 100

```



Middle:



```text

60 70 | 80 90 100

```



Since:



```text

70 > 60

```



search the right side.



Then we find:



```text

70

```



\---



\# 13. Why Is Binary Search O(log n)?



Every step approximately cuts the search space in half.



For example:



```text

1,000,000 elements



↓ half



500,000



↓ half



250,000



↓ half



125,000



...

```



You need only a small number of divisions before reaching the answer.



Therefore:



```text

Binary Search = O(log n)

```



This is dramatically better than:



```text

O(n)

```



for very large datasets.



\---



\# 14. Important: Binary Search Requires Ordering



Binary search cannot normally be applied to completely unsorted data.



For example:



```text

80

10

70

20

90

30

```



You cannot simply take the middle and eliminate half because the ordering tells you nothing.



Therefore:



> \*\*Binary search requires an appropriate sorted/ordered structure.\*\*



\---



\# 15. Your Lecture's SSD/HDD Example



Suppose data is stored on an SSD.



Imagine:



```text

User 1

User 2

User 3

...

User 10

```



and each user contains information.



If we want:



```text

Find user with ID = 7

```



and the data is not organized for searching, we may have to inspect documents one by one.



This is approximately:



```text

O(n)

```



\---



\# 16. Unsorted vs Sorted Data



There are two different ideas here that should not be confused.



\### Unsorted collection



```text

30

10

90

20

70

```



Searching:



```text

O(n)

```



\### Sorted array



```text

10

20

30

70

90

```



Searching using binary search:



```text

O(log n)

```



So yes:



> \*\*Searching can be much faster when data is ordered appropriately.\*\*



But there is a problem.



\---



\# 17. The Problem With Maintaining a Sorted Array



Suppose we have:



```text

10

20

30

40

50

```



Now we want to insert:



```text

25

```



We must maintain the sorted order:



```text

10

20

25

30

40

50

```



We cannot simply put `25` at the end.



We need to move elements:



```text

30 → right

40 → right

50 → right

```



Then insert:



```text

25

```



This movement can require:



```text

O(n)

```



time.



\---



\# 18. Insertion Comparison



\## Unsorted array



If order does not matter:



```text

10

20

30

40

```



Insert:



```text

50

```



We can put it at the end.



Approximately:



```text

O(1)

```



assuming there is available capacity.



\### But important



If the array needs resizing because it is full, resizing can require additional work. So `O(1)` is typically \*\*amortized\*\* for dynamic-array append, not guaranteed for every single insertion.



\---



\# 19. Sorted Array



Suppose:



```text

10

20

30

40

50

```



Insert:



```text

25

```



We need:



```text

10

20

25

30

40

50

```



Elements may need to move.



Therefore:



```text

Insertion = O(n)

```



in the general case for an array.



\---



\# 20. Deletion



Suppose:



```text

10

20

30

40

50

```



Delete:



```text

30

```



We may need to move:



```text

40

50

```



to close the gap.



Therefore array deletion can be:



```text

O(n)

```



depending on where the element is and how the array is managed.



\---



\# 21. Update



Suppose we want:



```text

ID = 30

```



and we already know exactly where the record is.



Updating the value itself can be:



```text

O(1)

```



But if we first need to \*\*search for the element\*\*, the total operation includes the search cost.



For unsorted data:



```text

Search → O(n)

Update → O(1)

Total → O(n)

```



For an indexed/ordered structure:



```text

Search → approximately O(log n)

Update → additional work depending on structure

```



This distinction is very important.



> \*\*Do not automatically say "update is O(n)." The search required to locate the record may be O(n); the actual update can be much cheaper.\*\*



\---



\# 22. So We Have a Problem



We want:



\### Fast searching



```text

O(log n)

```



But we don't want:



\### Expensive insertion/deletion



```text

O(n)

```



if we can avoid it.



This is the fundamental problem that leads us to better data structures.



\---



\# 23. The Solution: Trees



Instead of storing everything as one giant array, we can organize data as a \*\*tree\*\*.



A tree is a data structure where elements are connected in a hierarchy.



Example:



```text

&#x20;            50

&#x20;           /  \\

&#x20;         30    70

&#x20;        / \\    / \\

&#x20;      20  40  60  80

```



This is a tree.



\---



\# 24. What Is a Node?



Each item in a tree is called a \*\*node\*\*.



For example:



```text

&#x20;       50

&#x20;      /  \\

&#x20;    30    70

```



Here:



```text

50 = node

30 = node

70 = node

```



\---



\# 25. Root



The top node is called the:



> \*\*Root\*\*



In:



```text

&#x20;       50

&#x20;      /  \\

&#x20;    30    70

```



`50` is the root.



\---



\# 26. Parent and Child



```text

&#x20;       50

&#x20;      /  \\

&#x20;    30    70

```



`50` is the parent of:



```text

30

70

```



And:



```text

30

70

```



are children of `50`.



\---



\# 27. Binary Tree



A binary tree is a tree where each node can have at most:



```text

2 children

```



Usually called:



```text

left child

right child

```



Example:



```text

&#x20;       50

&#x20;      /  \\

&#x20;    30    70

```



\---



\# 28. Binary Search Tree — BST



A \*\*Binary Search Tree\*\* adds an important rule.



For a node:



```text

&#x20;       50

&#x20;      /  \\

&#x20;    30    70

```



Values smaller than `50` go to the left.



Values greater than `50` go to the right.



So:



```text

Left < Root < Right

```



Example:



```text

&#x20;            50

&#x20;           /  \\

&#x20;         30    70

&#x20;        / \\    / \\

&#x20;      20  40  60  80

```



This organization allows searching efficiently when the tree is balanced.



\---



\# 29. Searching in a BST



Find:



```text

60

```



Start:



```text

50

```



Since:



```text

60 > 50

```



go right.



```text

70

```



Since:



```text

60 < 70

```



go left.



```text

60

```



Found.



We did not check every element.



\---



\# 30. The Problem With a Normal BST



A BST can become badly unbalanced.



Suppose values are inserted in this order:



```text

10

20

30

40

50

60

```



The tree can become:



```text

10

&#x20; \\

&#x20;  20

&#x20;    \\

&#x20;     30

&#x20;       \\

&#x20;        40

&#x20;          \\

&#x20;           50

&#x20;             \\

&#x20;              60

```



This is almost like a linked list.



Now searching can become:



```text

O(n)

```



instead of:



```text

O(log n)

```



So we need a way to keep the tree balanced.



\---



\# 31. AVL Tree



An \*\*AVL Tree\*\* is a self-balancing Binary Search Tree.



Its goal is to prevent the tree from becoming extremely unbalanced.



For example, instead of:



```text

10

&#x20; \\

&#x20;  20

&#x20;    \\

&#x20;     30

&#x20;       \\

&#x20;        40

```



it tries to maintain something closer to:



```text

&#x20;      20

&#x20;     /  \\

&#x20;   10    30

&#x20;           \\

&#x20;            40

```



AVL trees perform special operations called \*\*rotations\*\* to maintain balance.



\---



\# 32. What Is a Rotation?



A rotation reorganizes the tree while preserving the BST ordering.



For example:



```text

10

&#x20; \\

&#x20;  20

&#x20;    \\

&#x20;     30

```



can be balanced into:



```text

&#x20;    20

&#x20;   /  \\

&#x20; 10    30

```



The actual values remain.



Only their structural arrangement changes.



\---



\# 33. Why Are We Learning Trees?



Because databases need efficient ways to organize enormous amounts of data.



But traditional BST/AVL trees are not the final structure used to explain database indexes.



For databases, another structure is particularly important:



\# \*\*B-Tree / B+ Tree\*\*



\---



\# 34. What Is a B-Tree?



A \*\*B-Tree\*\* is a balanced tree designed especially for working with large amounts of data.



Unlike a binary tree:



```text

Each node can have at most 2 children

```



a B-Tree node can have \*\*many children\*\*.



Conceptually:



```text

&#x20;                \[40 | 80]

&#x20;               /    |    \\

&#x20;             /      |      \\

&#x20;      \[10 20 30] \[50 60 70] \[90 100]

```



This allows the tree to have fewer levels.



\---



\# 35. Why Is This Important for Databases?



Database data is much larger than RAM in many real systems.



Data may live on:



```text

SSD

HDD

```



Reading from storage is much more expensive than working with CPU registers/cache/RAM.



Therefore, databases try to reduce the number of storage accesses.



A B-Tree/B+ Tree can store many keys in one node/page.



Instead of:



```text

One node

&#x20; ↓

One node

&#x20; ↓

One node

&#x20; ↓

One node

```



we can have:



```text

&#x20;                Root

&#x20;         /        |        \\

&#x20;      many       many       many

&#x20;      values     values     values

```



This makes the tree \*\*wide and shallow\*\*.



\---



\# 36. What Is a B+ Tree?



A \*\*B+ Tree\*\* is a variation of the B-Tree commonly used in database/indexing systems.



The important conceptual idea is:



```text

Internal nodes

&#x20;     ↓

mostly guide the search



Leaf nodes

&#x20;     ↓

contain the actual indexed entries

```



Conceptually:



```text

&#x20;                   \[30 | 60]

&#x20;                  /    |    \\

&#x20;                 /     |     \\

&#x20;                /      |      \\

&#x20;            \[10,20] \[30,40,50] \[60,70,80]

```



The leaf level is ordered.



The leaf nodes can also be linked:



```text

\[10,20] → \[30,40,50] → \[60,70,80]

```



That linked structure is extremely useful for \*\*range queries\*\*.



\---



\# 37. Important MongoDB Correction



Your lecture says:



> MongoDB follows B+ Tree.



This is a useful learning simplification, but don't memorize it as:



> "MongoDB is implemented using exactly one B+ Tree."



MongoDB uses indexes implemented by the underlying storage engine, and \*\*WiredTiger uses B-tree-based structures\*\* for indexes.



For interviews, a safe statement is:



> \*\*MongoDB indexes use B-tree-based structures, which provide efficient ordered lookup and range scanning.\*\*



The exact internal implementation should not be reduced to "MongoDB = B+ Tree."



\---



\# 38. Why Not Simply Use an Array?



Suppose we have:



```text

10

20

30

40

50

60

70

80

90

```



A sorted array provides fast binary search.



But insertion can require moving many elements.



A database needs to perform:



```text

Search

Insert

Delete

Update

Range queries

```



efficiently.



B-tree-family structures provide a much better balance for large, storage-backed datasets.



\---



\# 39. Indexing



Now we reach the most important concept of this lecture.



\## What is an Index?



An index is an additional data structure that helps the database find documents faster.



Think about a physical book.



Suppose you want:



```text

MongoDB

```



in a 1,000-page book.



Without an index:



```text

Start at page 1

↓

Read

↓

Page 2

↓

Page 3

↓

...

```



With an index:



```text

Index

&#x20;↓

MongoDB → Page 735

```



You can jump closer to the required information.



A database index works on the same general idea.



\---



\# 40. Example: MongoDB Without an Index



Suppose we have:



```javascript

{

&#x20;   name: "Fahad",

&#x20;   lastName: "Ali"

}

```



and millions of documents.



Query:



```javascript

db.users.find({

&#x20;   lastName: "Ali"

});

```



If there is no useful index, MongoDB may need to examine many or all documents.



This is called a:



> \*\*Collection Scan\*\*



Often shown in query plans as:



```text

COLLSCAN

```



\---



\# 41. MongoDB With an Index



Suppose we create:



```javascript

db.users.createIndex({

&#x20;   lastName: 1

});

```



Now MongoDB has an index on:



```text

lastName

```



Conceptually:



```text

Index



Ali

&#x20; ↓

documents having lastName = Ali



Khan

&#x20; ↓

documents having lastName = Khan



Smith

&#x20; ↓

documents having lastName = Smith

```



MongoDB can use the index to locate matching documents much more efficiently.



\---



\# 42. What Does `1` Mean?



In:



```javascript

db.users.createIndex({

&#x20;   lastName: 1

});

```



`1` means:



```text

ascending order

```



And:



```javascript

\-1

```



means:



```text

descending order

```



For example:



```javascript

db.users.createIndex({

&#x20;   age: 1

});

```



creates an ascending index on `age`.



\---



\# 43. Does an Index Store the Whole Document?



Usually, think of an index as storing information that helps locate the corresponding document.



Conceptually:



```text

Index



lastName       → document location

\-----------------------------------

Ali            → document A

Ali            → document D

Khan           → document B

Smith          → document C

```



The exact physical representation is more complicated.



The key idea is:



> \*\*The index lets the database find relevant records without scanning every document.\*\*



\---



\# 44. Important Correction: "Index Is 4 Bytes"



Your lecture says:



> Each index is 4 bytes.



This is \*\*not a general rule\*\*.



An index entry can contain:



```text

indexed key

\+

record/document reference

\+

tree/page overhead

\+

other metadata

```



Its size depends on:



\* indexed field type

\* indexed value size

\* number of indexed fields

\* document identifiers

\* storage-engine implementation

\* page structure

\* internal metadata



So do \*\*not\*\* memorize:



```text

1 index = 4 bytes

```



as a database rule.



\---



\# 45. Why Does Indexing Consume Storage?



An index is additional data.



Suppose:



```text

Documents = 100 GB

```



and we create several indexes.



The database now needs additional storage for those indexes.



Therefore:



> \*\*Indexes improve read performance but consume storage and add write overhead.\*\*



This is one of the most important database trade-offs.



\---



\# 46. Indexes Also Make Writes More Expensive



Suppose we have:



```text

users

```



with an index on:



```text

lastName

```



Now insert:



```javascript

{

&#x20;   name: "Ali",

&#x20;   lastName: "Khan"

}

```



MongoDB needs to:



1\. Store the document.

2\. Update the relevant index.



If there are several indexes:



```text

Document

&#x20;  ↓

Index 1 update

Index 2 update

Index 3 update

...

```



Therefore:



> More indexes can improve reads but can make inserts, updates, and deletes more expensive.



\---



\# 47. Range Query



Your lecture says:



> Range query will give us multiple columns of data.



This needs correction.



A \*\*range query\*\* normally means finding values/documents whose indexed value falls within a range.



It does \*\*not\*\* specifically mean multiple columns.



For example:



```javascript

db.users.find({

&#x20;   age: {

&#x20;       $gte: 20,

&#x20;       $lte: 30

&#x20;   }

});

```



means:



> Find users whose age is between 20 and 30.



This may return multiple \*\*documents\*\*.



\---



\# 48. Another Range Query Example



Suppose:



```text

age

\---

18

20

21

25

30

35

40

```



Query:



```javascript

{

&#x20;   age: {

&#x20;       $gte: 20,

&#x20;       $lte: 30

&#x20;   }

}

```



Results:



```text

20

21

25

30

```



The database can efficiently scan the relevant portion of an ordered index.



\---



\# 49. Range Queries and B+ Trees



This is one reason B+ Tree-style indexes are useful.



Suppose the index is:



```text

10 → 20 → 30 → 40 → 50 → 60 → 70 → 80

```



We want:



```text

30 to 60

```



The database can:



```text

Find 30

&#x20;↓

30 → 40 → 50 → 60

```



It doesn't necessarily need to search the entire dataset.



This is particularly useful for:



```text

age >= 20

price between 100 and 500

date between January and March

\_id > 1000

```



\---



\# 50. Equality Query vs Range Query



\### Equality



```javascript

{

&#x20;   lastName: "Ali"

}

```



Meaning:



> Find documents where lastName exactly equals Ali.



\### Range



```javascript

{

&#x20;   age: {

&#x20;       $gte: 20,

&#x20;       $lt: 30

&#x20;   }

}

```



Meaning:



> Find documents where age is within a range.



\---



\# 51. How Does MongoDB Know Which Documents Have `lastName: "Ali"`?



Without an index:



```text

Document 1 → check

Document 2 → check

Document 3 → check

Document 4 → check

...

```



This can become:



```text

O(n)

```



with respect to the number of documents examined.



With an appropriate index:



```text

Query

&#x20;↓

Index

&#x20;↓

Find "Ali"

&#x20;↓

Locate matching entries

&#x20;↓

Fetch required documents

```



The index greatly reduces the amount of data that may need to be examined.



\---



\# 52. B+ Tree Search



Conceptually, suppose the index contains:



```text

&#x20;                   \[50]

&#x20;                  /    \\

&#x20;             \[20,30]   \[70,90]

&#x20;             /  |  \\    /  |  \\

```



You are searching for:



```text

70

```



Start at:



```text

50

```



Because:



```text

70 > 50

```



go right.



Then find the relevant leaf.



This requires following only a small number of levels.



Therefore the search is approximately:



```text

O(log n)

```



in the number of indexed entries, under the simplified algorithmic model.



\---



\# 53. Why B+ Trees Are Better Than a Binary Tree for Databases



A binary tree:



```text

&#x20;            50

&#x20;          /    \\

&#x20;        30      70

&#x20;       /  \\    /  \\

```



has relatively few children per node.



A B+ Tree can have many children:



```text

&#x20;                \[30 | 60 | 90]

&#x20;              /      |      |     \\

&#x20;            ...     ...    ...    ...

```



This makes it:



> \*\*wide and shallow\*\*



rather than:



> \*\*narrow and deep\*\*



Fewer levels can mean fewer storage-page accesses.



That is extremely valuable for databases.



\---



\# 54. Why SSD/HDD Matters



Your lecture mentions SSD/HDD.



This is important because databases ultimately need to work with persistent storage.



Think of the hierarchy approximately as:



```text

CPU

&#x20;↓

CPU Cache

&#x20;↓

RAM

&#x20;↓

SSD

&#x20;↓

HDD

```



Moving farther down generally means higher access latency.



Modern SSDs are much faster than HDDs, but storage access is still fundamentally different from CPU/register/cache operations.



Therefore databases try to:



\* minimize unnecessary storage I/O

\* organize data into pages/blocks

\* cache frequently used data

\* use indexes

\* reduce the number of pages that must be read



\---



\# 55. Database Pages



A database does not normally think:



```text

"Read exactly one JavaScript object."

```



It works with storage units called \*\*pages\*\*.



Conceptually:



```text

SSD

│

├── Page

├── Page

├── Page

├── Page

└── Page

```



A database loads pages into memory and works with them.



The exact page size and implementation depend on the database/storage engine.



\---



\# 56. Why B+ Trees Work Well With Pages



Imagine:



```text

Page 1

\[10, 20, 30, 40, 50]



Page 2

\[60, 70, 80, 90, 100]



Page 3

\[110, 120, 130, 140, 150]

```



A tree node can correspond conceptually to a page containing many keys.



Therefore one page read can provide many keys.



This is much better suited to storage systems than a tree where every node contains only one tiny key.



\---



\# 57. What Does "Log N" Really Mean?



Suppose there are:



```text

1,000,000

```



indexed values.



A logarithmic search repeatedly reduces the search space.



Very roughly:



```text

1,000,000

↓

500,000

↓

250,000

↓

125,000

...

```



The number of steps grows very slowly compared with `n`.



This is why:



```text

O(log n)

```



is considered very efficient for large datasets.



\---



\# 58. Storage Capacity and Bytes



Your lecture gives:



```text

8 GB

```



and converts it approximately as:



```text

8 × 1024 × 1024 × 1024 bytes

```



which gives:



```text

2³³ bytes

```



This is correct \*\*if we are using the binary interpretation of 8 GiB\*\*.



More precisely:



```text

1 KiB = 1024 bytes

1 MiB = 1024 KiB

1 GiB = 1024 MiB

```



Therefore:



```text

8 GiB

= 8 × 1024 × 1024 × 1024

= 8,589,934,592 bytes

= 2³³ bytes

```



\---



\# 59. GB vs GiB — Important Interview Detail



There is a terminology difference.



\### Decimal



```text

1 GB = 1,000,000,000 bytes

```



\### Binary



```text

1 GiB = 1,073,741,824 bytes

```



So technically:



```text

GB ≠ GiB

```



Operating systems and hardware manufacturers may display storage differently.



For basic DSA/database learning, the important idea is:



> Storage capacity can be converted into bytes using the appropriate unit system.



\---



\# 60. Why Not Just Store Everything in a Sorted Array?



This was an important question in your lecture.



A sorted array gives us:



```text

Fast binary search

```



but:



```text

Expensive insertion/deletion

```



because elements may need to move.



Example:



```text

10 20 30 40 50

```



Insert:



```text

25

```



Result:



```text

10 20 25 30 40 50

```



Several elements may need to move.



This becomes expensive for very large datasets.



\---



\# 61. Trees Solve the Movement Problem



A tree doesn't require all elements to occupy consecutive array positions.



Conceptually:



```text

&#x20;      40

&#x20;     /  \\

&#x20;   20    60

&#x20;  / \\    / \\

&#x20;10  30  50  70

```



Adding another value does not necessarily require shifting millions of elements.



Instead, the tree structure is adjusted.



B-tree-family structures extend this idea while being optimized for storage pages.



\---



\# 62. Why Not Use an AVL Tree in the Database?



AVL trees provide excellent theoretical search performance.



But database storage has a special problem:



> \*\*Disk/SSD I/O.\*\*



A normal AVL tree has relatively few keys per node.



A B+ Tree can store many keys per node/page.



Therefore a B+ Tree can reduce the number of storage pages that need to be accessed.



For database indexes, this is a major advantage.



\---



\# 63. BST vs AVL vs B+ Tree



| Structure   | Main Idea                                                     | Children per node | Main Use                        |

| ----------- | ------------------------------------------------------------- | ----------------: | ------------------------------- |

| Binary Tree | Hierarchical tree                                             |               ≤ 2 | General tree structure          |

| BST         | Ordered binary tree                                           |               ≤ 2 | Searching                       |

| AVL Tree    | Self-balancing BST                                            |               ≤ 2 | Consistently balanced searching |

| B-Tree      | Multi-way balanced tree                                       |              Many | Storage/indexing                |

| B+ Tree     | B-tree variant with data/index entries concentrated at leaves |              Many | Database/file-system indexes    |



\---



\# 64. Important Difference: BST and B+ Tree



\### BST



```text

&#x20;             50

&#x20;            /  \\

&#x20;          30    70

```



Each node has at most two children.



\### B+ Tree



```text

&#x20;            \[30 | 60 | 90]

&#x20;           /     |     |     \\

&#x20;         ...    ...   ...    ...

```



One node can have many children.



Therefore B+ Trees are much wider.



\---



\# 65. What Is a Query?



A query is a request to the database.



Example:



```javascript

db.users.find({

&#x20;   lastName: "Ali"

});

```



You are saying:



> Find users whose last name is Ali.



Another:



```javascript

db.users.find({

&#x20;   age: {

&#x20;       $gte: 20

&#x20;   }

});

```



Means:



> Find users whose age is greater than or equal to 20.



\---



\# 66. Query Execution: High-Level Picture



When you execute:



```javascript

db.users.find({

&#x20;   lastName: "Ali"

});

```



conceptually:



```text

Application

&#x20;    ↓

MongoDB Query

&#x20;    ↓

Query Planner

&#x20;    ↓

Choose useful execution strategy

&#x20;    ↓

Index / Collection

&#x20;    ↓

Find matching documents

&#x20;    ↓

Return results

```



The query planner can consider available indexes and choose an execution plan.



\---



\# 67. Collection Scan vs Index Scan



\## Collection Scan



```text

Query

&#x20;↓

Check documents one by one

&#x20;↓

Document 1

Document 2

Document 3

...

```



Conceptually:



```text

COLLSCAN

```



Potentially expensive.



\## Index Scan



```text

Query

&#x20;↓

Index

&#x20;↓

Find matching keys

&#x20;↓

Fetch corresponding documents

```



Often much more efficient for selective queries with suitable indexes.



\---



\# 68. `explain()` — Very Important MongoDB Tool



MongoDB provides:



```javascript

explain()

```



to inspect how a query is executed.



For example:



```javascript

db.users.find({

&#x20;   lastName: "Ali"

}).explain("executionStats");

```



It can provide information about:



\* execution plan

\* whether an index was used

\* documents examined

\* keys examined

\* documents returned

\* execution statistics



This is extremely useful when optimizing MongoDB queries.



\---



\# 69. `COLLSCAN` vs `IXSCAN`



Two important terms:



\### `COLLSCAN`



Collection scan.



MongoDB scans documents from the collection.



\### `IXSCAN`



Index scan.



MongoDB scans an index.



Example conceptual result:



```text

COLLSCAN

```



means:



```text

No suitable index was used for that stage.

```



Whereas:



```text

IXSCAN

```



indicates an index scan.



\---



\# 70. Index Selectivity



Suppose we have:



```text

1,000,000 users

```



and:



```text

gender = "male"

```



matches:



```text

500,000 users

```



The index may not reduce the amount of work as dramatically as an index on a highly selective field.



Now suppose:



```text

userId = "abc123"

```



matches exactly:



```text

1 document

```



That is highly selective.



\### General idea



> \*\*Selectivity describes how much an index condition narrows down the possible records.\*\*



\---



\# 71. Why Indexing Every Field Is a Bad Idea



You might think:



> "If indexes are fast, I should create an index on every field."



No.



Indexes have costs:



```text

More storage

\+

More memory/cache pressure

\+

More work during insert

\+

More work during update

\+

More work during delete

```



Therefore:



> Create indexes according to actual query patterns and workload.



\---



\# 72. Compound Index



MongoDB can create an index on multiple fields.



Example:



```javascript

db.users.createIndex({

&#x20;   lastName: 1,

&#x20;   age: 1

});

```



This is called a:



> \*\*Compound index\*\*



It is useful for queries involving those fields in appropriate ways.



The order of fields in a compound index matters.



\---



\# 73. Why Index Order Matters



Suppose:



```javascript

{

&#x20;   lastName: 1,

&#x20;   age: 1

}

```



The index is primarily organized by:



```text

lastName

```



and then:



```text

age

```



within the same last-name grouping.



Conceptually:



```text

Ali

&#x20;├── 20

&#x20;├── 25

&#x20;└── 30



Khan

&#x20;├── 19

&#x20;├── 24

&#x20;└── 35

```



Therefore, compound-index design requires understanding query patterns.



\---



\# 74. Equality → Sort → Range — Interview Concept



A commonly taught principle for compound-index design is:



```text

Equality fields

→ Sort fields

→ Range fields

```



This is often summarized as the \*\*ESR guideline\*\*.



For example, if queries commonly use:



```text

status = "active"

sort by createdAt

age >= 20

```



an appropriate compound-index design may be considered around:



```javascript

{

&#x20;   status: 1,

&#x20;   createdAt: 1,

&#x20;   age: 1

}

```



But index design should always be validated against the actual query workload and explain plans.



\---



\# 75. What Happens When We Insert Data Into an Indexed Collection?



Suppose:



```javascript

db.users.createIndex({

&#x20;   age: 1

});

```



Then we insert:



```javascript

{

&#x20;   name: "Fahad",

&#x20;   age: 20

}

```



MongoDB must maintain both:



```text

Collection data

\+

Index

```



Conceptually:



```text

Insert document

&#x20;     ↓

Store document

&#x20;     ↓

Update index

```



This is why indexes have a write cost.



\---



\# 76. What Happens During Deletion?



Suppose:



```javascript

{

&#x20;   name: "Fahad",

&#x20;   age: 20

}

```



is deleted.



MongoDB needs to:



```text

Remove document

&#x20;     +

Remove corresponding index entry

```



Again, maintaining indexes has a cost.



\---



\# 77. What Happens During an Update?



Suppose:



```javascript

{

&#x20;   name: "Fahad",

&#x20;   age: 20

}

```



becomes:



```javascript

{

&#x20;   name: "Fahad",

&#x20;   age: 21

}

```



If `age` is indexed, the database may need to update the relevant index entry.



Conceptually:



```text

20 → remove/update index entry

21 → add/update index entry

```



Therefore indexes influence write performance.



\---



\# 78. A Crucial Distinction: Data vs Index



Think of:



```text

Collection

```



as the actual data.



And:



```text

Index

```



as an additional organized structure that helps find the data.



Example:



```text

&#x20;               MongoDB



&#x20;      ┌─────────────────────┐

&#x20;      │   Collection Data   │

&#x20;      │                     │

&#x20;      │ Document 1          │

&#x20;      │ Document 2          │

&#x20;      │ Document 3          │

&#x20;      │ ...                 │

&#x20;      └─────────────────────┘

&#x20;                ▲

&#x20;                │

&#x20;             reference

&#x20;                │

&#x20;      ┌─────────────────────┐

&#x20;      │        Index        │

&#x20;      │                     │

&#x20;      │ Ali   → locations   │

&#x20;      │ Khan  → locations   │

&#x20;      │ Smith → locations   │

&#x20;      └─────────────────────┘

```



\---



\# 79. Why Does MongoDB Need Indexes If Documents Are Already Stored?



Because physical storage order is not automatically an efficient search structure.



Imagine:



```text

Document 1 → Fahad

Document 2 → Ahmed

Document 3 → Umar

Document 4 → Ali

Document 5 → John

...

```



Searching for:



```text

lastName = "Ali"

```



may require checking many documents.



An index creates an additional structure specifically optimized for lookup.



\---



\# 80. The Big Picture



Now connect everything.



\### Without index



```text

Query

&#x20; ↓

Collection

&#x20; ↓

Document 1

Document 2

Document 3

Document 4

...

Document N

```



Potentially:



```text

O(n)

```



documents examined.



\### With a suitable index



```text

Query

&#x20; ↓

B-tree-based index

&#x20; ↓

Locate relevant key/range

&#x20; ↓

Relevant document locations

&#x20; ↓

Documents

```



Conceptually much closer to:



```text

O(log n)

```



for locating a position in the ordered index, plus the cost of retrieving matching results.



\---



\# 81. Very Important: O(log n) Does Not Mean the Whole Query Is Always O(log n)



This is an important interview point.



Suppose:



```text

1,000,000 documents

```



and the query matches:



```text

500,000 documents

```



Finding the beginning of the range may be very efficient.



But returning 500,000 documents still requires work.



So query cost depends on:



```text

Index traversal

\+

Number of matching index entries

\+

Document fetches

\+

Sorting/other operations

\+

Data transfer

```



Therefore don't blindly say:



> "MongoDB query = O(log n)."



Instead say:



> \*\*An appropriate index can make locating the relevant range approximately logarithmic, but total query cost also depends on how many entries/documents must be examined and returned.\*\*



\---



\# 82. Why B+ Trees Are Good for Range Queries



Suppose:



```text

10 20 30 40 50 60 70 80 90

```



Query:



```text

30 ≤ x ≤ 70

```



The index can locate:



```text

30

```



and then traverse the ordered entries:



```text

30 → 40 → 50 → 60 → 70

```



This is one of the major strengths of ordered indexes.



\---



\# 83. Equality Query



Example:



```javascript

db.users.find({

&#x20;   lastName: "Ali"

});

```



Conceptually:



```text

Index

&#x20;↓

Ali

&#x20;↓

matching entries

```



\---



\# 84. Range Query



Example:



```javascript

db.users.find({

&#x20;   age: {

&#x20;       $gte: 20,

&#x20;       $lte: 30

&#x20;   }

});

```



Conceptually:



```text

Index



20 → 21 → 22 → 23 → ... → 30

```



The ordered index can scan the relevant range.



\---



\# 85. Why Databases Don't Just Use Binary Search on the Whole Collection



Because the database has multiple requirements:



```text

Fast lookup

Fast range queries

Efficient insertion

Efficient deletion

Efficient updates

Storage efficiency

Minimize I/O

Support huge datasets

```



A simple sorted array is excellent for some operations but poor for others.



B-tree-family indexes provide a better overall trade-off for storage-backed database workloads.



\---



\# 86. Data Structures Are About Trade-offs



There is no data structure that is perfect for every operation.



For example:



| Structure      | Search           | Insert           | Delete           | Important Property                     |

| -------------- | ---------------- | ---------------- | ---------------- | -------------------------------------- |

| Unsorted array | O(n)             | O(1)\*            | O(n)             | Simple                                 |

| Sorted array   | O(log n)         | O(n)             | O(n)             | Excellent binary search                |

| BST            | O(log n) average | O(log n) average | O(log n) average | Can become unbalanced                  |

| AVL            | O(log n)         | O(log n)         | O(log n)         | Self-balancing                         |

| B/B+ Tree      | O(log n)         | O(log n)         | O(log n)         | Designed for large storage-backed data |



`\*` assumes insertion at an available position such as the end; dynamic-array resizing can add cost.



These are simplified asymptotic models, not guarantees for every database operation.



\---



\# 87. Why DSA Matters for Backend Developers



You may wonder:



> "I'm learning backend development. Why do I need DSA?"



Because backend systems constantly deal with:



```text

Searching

Sorting

Caching

Databases

Queues

Graphs

Trees

Memory

Indexes

Scheduling

Optimization

```



For example:



```text

MongoDB Index

&#x20;     ↓

Tree data structure

&#x20;     ↓

Search algorithm

&#x20;     ↓

Faster query

```



So DSA is not separate from real-world software engineering.



It is underneath many systems you use every day.



\---



\# 88. How MongoDB Connects With DSA



This entire lecture can be summarized as:



```text

Large amount of data

&#x20;       ↓

Need efficient searching

&#x20;       ↓

Searching unsorted data

&#x20;       ↓

O(n)

&#x20;       ↓

Too expensive for huge data

&#x20;       ↓

Need an organized structure

&#x20;       ↓

Sorted data

&#x20;       ↓

Binary Search

&#x20;       ↓

O(log n)

&#x20;       ↓

But sorted arrays make insertion/deletion expensive

&#x20;       ↓

Need a better data structure

&#x20;       ↓

Trees

&#x20;       ↓

BST

&#x20;       ↓

AVL

&#x20;       ↓

B-Tree / B+ Tree

&#x20;       ↓

Database-friendly indexing

&#x20;       ↓

MongoDB indexes

```



\---



\# 89. The Complete Mental Model



Remember this chain:



```text

DATA

&#x20;↓

Data Structure

&#x20;↓

Algorithm

&#x20;↓

Performance

&#x20;↓

Index

&#x20;↓

Tree

&#x20;↓

B+ Tree / B-tree family

&#x20;↓

Database Search

```



\---



\# 90. Terminology Cheat Sheet



\## SQL



```text

Database

Table

Row

Column

Record

Field

Primary Key

Foreign Key

Index

Query

Transaction

```



\## MongoDB



```text

Database

Collection

Document

Field

Value

\_id

Index

Query

Embedded Document

Array

Compound Index

```



\## DSA



```text

Array

Node

Tree

Root

Parent

Child

Leaf

Binary Tree

BST

AVL Tree

B-Tree

B+ Tree

Algorithm

Big-O

Binary Search

Linear Search

```



\---



\# 91. Interview Questions and Answers



\## Q1. What is the difference between a row and a column?



\*\*Answer:\*\*



A row represents one complete record, while a column represents one attribute/property shared by records.



Example:



```text

id | name | age

1  | Fahad| 20

```



The complete `1, Fahad, 20` is a row.



`name` is a column.



\---



\## Q2. What is the MongoDB equivalent of a SQL row?



\*\*Answer:\*\*



A MongoDB document.



\---



\## Q3. What is the MongoDB equivalent of a SQL table?



\*\*Answer:\*\*



A MongoDB collection.



\---



\## Q4. What is a document in MongoDB?



\*\*Answer:\*\*



A BSON document containing fields and values that represents one record/entity.



\---



\## Q5. What is an index?



\*\*Answer:\*\*



An index is an additional data structure maintained by the database to allow queries to locate relevant data more efficiently without scanning the entire collection/table.



\---



\## Q6. Why are indexes needed?



\*\*Answer:\*\*



Without a suitable index, the database may need to examine many or all records.



An index can reduce the amount of data that needs to be examined and can make equality, range, sorting, and other supported query patterns much faster.



\---



\## Q7. What is a collection scan?



\*\*Answer:\*\*



A collection scan means examining documents in the collection rather than efficiently locating them through a suitable index.



MongoDB query plans commonly represent this as:



```text

COLLSCAN

```



\---



\## Q8. What is an index scan?



\*\*Answer:\*\*



An index scan examines an index to locate relevant indexed entries.



MongoDB query plans commonly represent this as:



```text

IXSCAN

```



\---



\## Q9. What is binary search?



\*\*Answer:\*\*



Binary search is a search algorithm that works on ordered data by repeatedly dividing the search space approximately in half.



Its time complexity is:



```text

O(log n)

```



\---



\## Q10. Why can't binary search normally work on unsorted data?



\*\*Answer:\*\*



Because the algorithm relies on ordering to determine which half can be eliminated.



Without ordering, the middle value does not tell us which side contains the target.



\---



\## Q11. What is a BST?



\*\*Answer:\*\*



A Binary Search Tree is a binary tree where values smaller than a node are placed on one side and larger values on the other, according to the BST ordering rule.



\---



\## Q12. What is the problem with a normal BST?



\*\*Answer:\*\*



It can become unbalanced.



In the worst case it can resemble a linked list, making search:



```text

O(n)

```



instead of:



```text

O(log n)

```



\---



\## Q13. What is an AVL tree?



\*\*Answer:\*\*



An AVL tree is a self-balancing Binary Search Tree that uses rotations to maintain balance and provide logarithmic search, insertion, and deletion in the standard complexity model.



\---



\## Q14. Why are B-Trees useful for databases?



\*\*Answer:\*\*



B-Trees can store many keys per node, making them wide and shallow. This reduces the number of levels/pages that may need to be accessed when working with large storage-backed datasets.



\---



\## Q15. What is a B+ Tree?



\*\*Answer:\*\*



A B+ Tree is a balanced multi-way tree in which internal nodes primarily guide searches while indexed entries are stored at the leaf level. Leaf nodes are typically linked, making ordered traversal and range queries efficient.



\---



\## Q16. Why are B+ Trees good for range queries?



\*\*Answer:\*\*



Because the leaf entries are ordered and can be traversed sequentially after locating the beginning of the required range.



\---



\## Q17. What is a range query?



\*\*Answer:\*\*



A query that retrieves values within a specified range.



Example:



```javascript

{

&#x20;   age: {

&#x20;       $gte: 20,

&#x20;       $lte: 30

&#x20;   }

}

```



\---



\## Q18. Does a range query mean multiple columns?



\*\*Answer:\*\*



No.



A range query can operate on one field or, depending on the query, multiple fields. "Range" refers to a condition over values, such as:



```text

age >= 20

price < 500

date between X and Y

```



\---



\## Q19. What does `1` mean in a MongoDB index?



```javascript

{

&#x20;   age: 1

}

```



\*\*Answer:\*\*



It specifies ascending index order.



`-1` specifies descending order.



\---



\## Q20. What is a compound index?



\*\*Answer:\*\*



An index containing multiple fields.



Example:



```javascript

db.users.createIndex({

&#x20;   lastName: 1,

&#x20;   age: 1

});

```



\---



\## Q21. Why shouldn't we create an index on every field?



\*\*Answer:\*\*



Indexes consume storage and require maintenance during inserts, updates, and deletes. Too many indexes can therefore hurt write performance and increase resource usage.



\---



\## Q22. Does an index contain the complete document?



\*\*Answer:\*\*



Not necessarily.



An index stores indexed key information and information needed by the database to locate or process corresponding records. The exact representation depends on the database and storage engine.



\---



\## Q23. Does every index entry have exactly 4 bytes?



\*\*Answer:\*\*



No.



Index-entry size depends on the key, document identifier/reference, metadata, storage engine, and other factors.



\---



\## Q24. Is MongoDB simply a B+ Tree?



\*\*Answer:\*\*



No.



MongoDB is a document-oriented database. Its WiredTiger storage engine uses B-tree-based structures for indexes. It is more accurate to say that MongoDB indexes use B-tree-family structures rather than saying MongoDB itself is a B+ Tree.



\---



\## Q25. Why does indexing make reads faster?



\*\*Answer:\*\*



Because the database can use an organized index to locate relevant keys and corresponding records instead of scanning every document.



\---



\## Q26. Why can indexing make writes slower?



\*\*Answer:\*\*



When data changes, the database must also maintain every affected index.



Therefore:



```text

Insert/update/delete

\+

Index maintenance

```



adds work.



\---



\## Q27. What is the trade-off of indexing?



\*\*Answer:\*\*



Indexes generally provide:



```text

Faster reads

```



at the cost of:



```text

Extra storage

\+

Index maintenance

\+

Potentially slower writes

\+

Additional memory/cache usage

```



\---



\## Q28. What is `COLLSCAN`?



\*\*Answer:\*\*



It represents a collection scan in a MongoDB query execution plan.



\---



\## Q29. What is `IXSCAN`?



\*\*Answer:\*\*



It represents an index scan in a MongoDB query execution plan.



\---



\## Q30. How can you inspect MongoDB's query execution?



\*\*Answer:\*\*



Using:



```javascript

explain()

```



For example:



```javascript

db.users.find({

&#x20;   lastName: "Ali"

}).explain("executionStats");

```



\---



\# 92. Advanced Interview Questions



\## Q31. Is O(log n) guaranteed for every MongoDB query?



\*\*Answer:\*\*



No.



An index may allow efficient navigation to a relevant portion of the index, but total query cost depends on the number of matching entries, documents fetched, sorting, filtering, and other execution work.



\---



\## Q32. Why can a query with an index still be slow?



Possible reasons include:



\* The query returns many documents.

\* The index is poorly designed.

\* The query is not selective.

\* MongoDB must fetch many documents.

\* Sorting/filtering requires additional work.

\* The index does not match the query pattern well.

\* The working set does not fit efficiently in memory.

\* There may be significant I/O.



\---



\## Q33. What is index selectivity?



\*\*Answer:\*\*



Selectivity describes how effectively a query condition narrows the candidate records.



For example:



```text

userId = 123

```



may match one document.



That is highly selective.



Whereas:



```text

country = "Saudi Arabia"

```



may match millions of documents.



That is less selective.



\---



\## Q34. Why can an index be useless for a query?



If the index does not support the query pattern effectively, the database may gain little from using it.



The query planner evaluates possible execution strategies.



You should verify with:



```javascript

explain()

```



rather than assuming an index is useful.



\---



\## Q35. Why are B+ Trees better suited to storage than ordinary BSTs?



\*\*Answer:\*\*



B+ Trees can store many keys per node/page and therefore have fewer levels. This reduces the number of storage pages that may need to be accessed.



\---



\## Q36. Why does range scanning benefit from linked B+ Tree leaves?



\*\*Answer:\*\*



After locating the beginning of a range, the database can move through neighboring ordered leaf entries rather than repeatedly navigating from the root for every value.



\---



\## Q37. Why is a sorted array not enough for a database index?



\*\*Answer:\*\*



A sorted array provides efficient binary search, but inserting or deleting elements in the middle can require moving many elements.



B-tree-family structures provide efficient ordered search while supporting dynamic insertion and deletion without shifting an entire contiguous array.



\---



\## Q38. What is the difference between an index and the actual data?



\*\*Answer:\*\*



The actual collection stores the documents.



The index is an additional organized structure used to locate and process those documents more efficiently.



\---



\## Q39. What happens if we create too many indexes?



\*\*Answer:\*\*



You may get:



```text

More storage consumption

More index maintenance

Slower writes

More memory/cache pressure

```



Therefore indexes should be based on actual workload requirements.



\---



\## Q40. Why should we use `explain()` instead of guessing?



\*\*Answer:\*\*



Because query performance depends on the actual execution plan.



`explain()` provides evidence about:



```text

Index usage

Documents examined

Keys examined

Documents returned

Execution statistics

```



This allows performance decisions to be based on actual behavior.



\---



\# 93. Important Corrections From the Lecture



Memorize these corrected versions.



\### Lecture:



> Range query gives multiple columns.



\### Correct:



> A range query retrieves values/documents satisfying a range condition. It does not specifically mean multiple columns.



\---



\### Lecture:



> MongoDB follows B+ Tree.



\### Correct:



> MongoDB indexes use B-tree-based structures through its storage engine; don't reduce MongoDB to "MongoDB is a B+ Tree."



\---



\### Lecture:



> Every index element is 4 bytes.



\### Correct:



> Index-entry size varies depending on key size, document identifiers, metadata, and implementation.



\---



\### Lecture:



> Update always takes O(n).



\### Correct:



> Finding an element in an unsorted collection can take O(n). The actual update may be much cheaper once the document is located.



\---



\### Lecture:



> Sorted data always takes more time.



\### Correct:



> Sorted structures can make searching faster but may make insertion/deletion more expensive. Different data structures balance these operations differently.



\---



\### Lecture:



> SSD makes arrays better.



\### Correct:



> Arrays can be useful for some workloads, but database storage is organized into pages/blocks, and tree-based indexes are designed to reduce storage I/O while supporting dynamic data.



\---



\# 94. Final Mental Picture



Imagine a university has:



```text

100 million students

```



and you ask:



```text

Find students whose lastName = "Ali".

```



\### Without index



```text

Student 1 → check

Student 2 → check

Student 3 → check

Student 4 → check

...

Student 100,000,000

```



Potentially:



```text

O(n)

```



\### With index



```text

Query

&#x20;↓

lastName index

&#x20;↓

B-tree-based navigation

&#x20;↓

Find "Ali"

&#x20;↓

Relevant index entries

&#x20;↓

Fetch matching documents

```



This can dramatically reduce the amount of unnecessary data examined.



\---



\# 95. The Most Important Concepts to Remember



If you remember only the core ideas from this lecture, remember these:



\### 1. SQL terminology



```text

Table → Row → Column

```



\### 2. MongoDB terminology



```text

Collection → Document → Field

```



\### 3. Unsorted search



```text

O(n)

```



\### 4. Binary search on ordered data



```text

O(log n)

```



\### 5. Sorted arrays



```text

Fast search

but

Expensive insertion/deletion

```



\### 6. BST



```text

Ordered binary tree

```



\### 7. AVL



```text

Self-balancing BST

```



\### 8. B/B+ Trees



```text

Wide, shallow, storage-friendly tree structures

```



\### 9. MongoDB indexes



```text

Additional structures that make suitable queries faster

```



\### 10. Index trade-off



```text

Faster reads

\+

More storage

\+

Write-maintenance cost

```



\### 11. Range queries



```text

age >= 20

price <= 500

date between X and Y

```



\### 12. `explain()`



```javascript

db.collection.find(query).explain("executionStats")

```



Use it to understand what MongoDB actually did.



\---



\# 96. One-Line Interview Summary



If an interviewer asks:



> \*\*"Why does MongoDB use indexes and what is the underlying idea?"\*\*



A strong answer is:



> \*\*MongoDB indexes provide an additional organized structure that allows the database to locate relevant documents more efficiently than scanning the entire collection. Its indexes use B-tree-based structures, which maintain ordered keys and support efficient lookup, sorting, and range scans while being designed for storage-backed workloads.\*\*



And if asked:



> \*\*"Why not just use a sorted array?"\*\*



Answer:



> \*\*A sorted array provides efficient binary search, but inserting and deleting elements can require shifting many elements. B-tree-family indexes provide efficient ordered lookup while supporting dynamic insertion and deletion and minimizing the number of storage pages that need to be accessed.\*\*



\---



\# 97. Final Revision Diagram



```text

&#x20;                   MONGODB QUERY

&#x20;                         │

&#x20;                         ↓

&#x20;                   Query Planner

&#x20;                         │

&#x20;               ┌─────────┴─────────┐

&#x20;               ↓                   ↓

&#x20;            Index?             No useful index

&#x20;               ↓                   ↓

&#x20;       B-tree-based index       Collection Scan

&#x20;               ↓                   ↓

&#x20;        Locate relevant       Check documents

&#x20;        index entries         one by one

&#x20;               │

&#x20;               ↓

&#x20;       Fetch matching data

&#x20;               │

&#x20;               ↓

&#x20;            RESULT

```



And the DSA journey behind it:



```text

Unsorted Data

&#x20;    │

&#x20;    ↓

Linear Search

&#x20;    │

&#x20;    ↓

&#x20;  O(n)

&#x20;    │

&#x20;    ↓

Need faster search

&#x20;    │

&#x20;    ↓

Sorted Data

&#x20;    │

&#x20;    ↓

Binary Search

&#x20;    │

&#x20;    ↓

&#x20; O(log n)

&#x20;    │

&#x20;    ↓

But sorted arrays have

expensive insertion/deletion

&#x20;    │

&#x20;    ↓

Tree Data Structures

&#x20;    │

&#x20;    ├── BST

&#x20;    │

&#x20;    ├── AVL

&#x20;    │

&#x20;    ↓

B-Tree / B+ Tree Family

&#x20;    │

&#x20;    ↓

Database Indexes

&#x20;    │

&#x20;    ↓

Efficient MongoDB Queries

```



