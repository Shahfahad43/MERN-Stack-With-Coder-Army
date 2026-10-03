const express = require("express");
const app = express();
app.use(express.json());

// app.get("/user", (req, res) => {
//   res.send({ name: "Shah" });
// });

// app.post("/user", (req, res) => {
//   //   console.log("Data saved successfuly!");
//   console.log(typeof req.body.age);
//   res.send("Data saved successfuly!");
// });

// Making a bookstore
const BookStore = [
  { id: 1, name: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, name: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 3, name: "1984", author: "George Orwell" },
  { id: 4, name: "Pride and Prejudice", author: "Jane Austen" },
  { id: 5, name: "The Catcher in the Rye", author: "J.D. Salinger" },
  { id: 6, name: "The Hobbit", author: "J.R.R. Tolkien" },
  { id: 7, name: "Fahrenheit 451", author: "Ray Bradbury" },
  { id: 8, name: "Moby Dick", author: "Herman Melville" },
  { id: 9, name: "War and Peace", author: "Leo Tolstoy" },
  { id: 10, name: "The Alchemist", author: "Paulo Coelho" },
];

// For posting the data
app.use(express.json());

app.get("/books", (req, res) => {
  res.send(BookStore);
});

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = BookStore.find((info) => info.id === id);
  res.send(book);
});

// How to post data
app.post("/books", (req, res) => {
  console.log(req.body);
  BookStore.push(req.body);
  res.send("Data stored successfuly!");
});

app.listen(4000, () => {
  console.log("I am listening at port 4000");
});
