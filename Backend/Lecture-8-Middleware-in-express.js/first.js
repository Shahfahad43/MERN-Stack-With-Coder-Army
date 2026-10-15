const express = require("express");
const app = express();
app.use(express.json());

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("I am first");
//     // res.send("Response sent!");
//     // res.send("Response sent! 2nd one");
//     // You can't send more than one response
//     next();
//     // The use of next to run the upcoming function
//   },
//   (req, res, next) => {
//     console.log("I am second");
//     // res.send("I am second response");
//     next();
//   },
//   (req, res) => {
//     console.log("I am third");
//     res.send("I am third");
//   },
// );

// What is the use of Middleware:
// If we want to maintain the logs for each request then we can use middleware to handle it.
app.use("/user", (req, res, next) => {
  console.log(`${Date.now()} ${req.method} ${req.url}`);
  next();
});

app.get("/user", (req, res) => {
  res.send("I am get.");
});

app.post("/user", (req, res) => {
  res.send("I am post.");
});

app.delete("/user", (req, res) => {
  res.send("I am delete.");
});

app.listen(3000, () => {
  console.log("I am listening at 3000");
});
