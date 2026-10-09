const express = require("express");
const app = express();
app.use(express.json());

const main = require("./database");
const User = require("./Models/user");

app.post("/register", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("User added successfuly!");
  } catch (err) {
    res.send("Error " + err.message);
  }
});

app.get("/info", async (req, res) => {
  try {
    const result = await User.find({});
    res.send(result);
  } catch (err) {
    res.send("Error " + err.message);
  }
});

// Getting a specific user by name
app.get("/info/:name", async (req, res) => {
  try {
    const result = await User.find({ firstName: req.params.name });
    res.send(result);
  } catch (err) {
    res.send("Error " + err.message);
  }
});

// Getting a specific user by id
app.get("/info/:id", async (req, res) => {
  try {
    const result = await User.findById(req.params.id);
    res.send(result);
  } catch (err) {
    res.send("Error " + err.message);
  }
});

// findByIdAndDelete()
app.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully!");
  } catch (err) {
    res.send("Error " + err.message);
  }
});

// findByIdAndUpdate()
app.patch("/user", async (req, res) => {
  try {
    const { _id, ...update } = req.body;
    await User.findByIdAndUpdate(_id, update, { runValidators: true }); // Make sure to run validators before updating otherwise it will will not throw errors and will acceppt whatever is coming to the database.
    res.send("User updated successfuly!");
  } catch (err) {
    res.send("Error " + err.message);
  }
});

//

main()
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Quick sanity check — query the DB
    const count = await User.countDocuments();
    console.log("Users in DB:", count);

    app.listen(3000, () => console.log("app is listening at 3000"));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:");
    console.error(err);
  });
