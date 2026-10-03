const express = require("express");

const app = express();

// app.get("/", (req, res) => {
//   // Normal Formate
//   //   res.send("Hello I am firs time using express.js");
//   // Json Format - API Format
//   res.send({ name: "Shah Fahad", age: 20, money: 123, Mon: 20 });
// });

// app.get("/about", (req, res) => {
//   res.send("I am your about page.");
// });

// app.get("/contact", (req, res) => {
//   res.send("I am your contact page.");
// });

app.use("/about/:id/:user", (req, res) => {
  console.log(req.params); // The use of params to arrange data dynamically.
  res.send({ name: "Shah Fahad", age: 20, money: 123, Mon: 20 });
});

app.listen(4000, () => {
  console.log("I am listening at 4000");
});
