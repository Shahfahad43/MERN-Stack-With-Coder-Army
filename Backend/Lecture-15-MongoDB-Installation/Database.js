// Run these commands for running the code
// npm install
// npm install mongodb / npm i mongodb

const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "Put you connection link of the cluster";
const client = new MongoClient(url);

// Database Name
const dbName = "Backend";

try {
  async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("user");

    // the following code examples can be pasted here...

    // Insert Many
    const insertManyResult = await collection.insertMany([
      { name: "Jalal", age: 24 },
      { name: "Alam", age: 25 },
      { name: "Kashif", age: 22 },
    ]);
    console.log("Inserted documents =>", insertManyResult);

    // Insert one document
    const insertResult = await collection.insertOne({ name: "Hamza", age: 30 });
    console.log("Document Inserted => ", insertResult);

    // Find all document
    const findResult = await collection.find({}).toArray();
    console.log("Found documents =>", findResult);

    // Find document using Query Filter
    const filteredDocs = await collection.find({ name: "Shah" }).toArray();
    console.log("Found documents filtered by {name: Shah} =>", filteredDocs);

    // Update a document
    const updateResult = await collection.updateOne(
      { name: "Alam" },
      { $set: { age: 50 } },
    );
    console.log("Updated documents =>", updateResult);
    // The result can be seen using Compass.

    // How to remove a document
    const deleteResult = await collection.deleteMany({ name: "Jalal" });
    console.log("Deleted documents =>", deleteResult);

    return "done.";
  }

  // At the end try and catch I used for handling errors.

  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
} catch (error) {
  if (error instanceof MongoServerError) {
    console.log(`Error worth logging: ${error}`); // special case for some reason
  }
}
