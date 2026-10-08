const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Getting database

// But the below one is not the suggested method
// require("./database.js");

// app.use(express.json());

// app.listen(3000, () => {
//   console.log("The app is listening at port 3000");
// });

// This one is the suggested method
const main = require("./database");

// Getting the user
const User = require("./Models/users");

// CRUD: Create Read Update Delete

// 1. Read
app.get("/info", async (req, res) => {
  //   res.send("You are on the info page.");
  const result = await User.find({});
  res.send(result);
});

// 2. Create
// Adding a new user
app.post("/info", async (req, res) => {
  console.log(req.body);
  //   const newUser = new User(req.body);
  //   await newUser.save();
  // Or simply
  try {
    await User.create(req.body);
    res.send("New user added successfuly!");
  } catch {
    res.status(500).send("Error!");
  }
});

// 3. Delete
app.delete("/info", async (req, res) => {
  await User.deleteOne({ name: "Ahmad" });
  res.send("User deleted!");
});

// 4. Update
app.put("/info", async (req, res) => {
  await User.updateOne({ name: "Shah" }, { age: "32" });
  res.send("User updated Successfuly!");
});

main()
  .then(async () => {
    console.log("Connected Successfuly to DB!");
    app.listen(3000, () => {
      console.log("app is listening at 3000");
    });

    // The below two lines for testing the database that either it is running or not
    // const user = await User.find({});
    // console.log(user);
  })
  .catch((err) => console.log(err));
