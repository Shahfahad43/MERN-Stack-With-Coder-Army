const express = require("express");
const app = express();
app.use(express.json());

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
  {
    id: 11,
    name: "The Noble Man",
    author: "Shah",
  },
  {
    id: 12,
    name: "The inside hero",
    author: "Shah",
  },
];

// For posting the data
app.use(express.json());

// Patch Request
app.patch("/books", (req, res) => {
  const book = BookStore.find((info) => info.id === req.body.id);
  if (req.body.author) book.author = req.body.author;
  if (req.body.name) book.name = req.body.name;
  res.send("Patched Successfuly!");
});

// Put Request
app.put("/books", (req, res) => {
  const book = BookStore.find((info) => info.id === req.body.id);
  book.author = req.body.author;
  book.name = req.body.name;
  res.send("Changes made successfuly!");
});

// Delete request
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = BookStore.findIndex((info) => info.id === id);
  BookStore.splice(index, 1);
  res.send(`User with id: ${id} has been deleted.`);
});

// Getting the specific data
app.get("/books", (req, res) => {
  // so the specific data can be found by using req.query.
  console.log(req.query);
  // From the above console.log() you can confirm the given data to the query for getting specific data
  const book = BookStore.filter((info) => info.author === req.query.author);
  res.send(book);
});

// Normal Get method
app.get("/book", (req, res) => {
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
