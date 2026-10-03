const express = require("express");
const { parse } = require("node:path");
const app = express();
app.use(express.json());

const FoodMenu = [
  { id: 1, name: "Pizza", category: "nonveg", price: 13 },
  { id: 2, name: "Sushi", category: "nonveg", price: 19 },
  { id: 3, name: "Caesar Salad", category: "nonveg", price: 10 },
  { id: 4, name: "Burrito", category: "nonveg", price: 10 },
  { id: 5, name: "Pad Thai", category: "nonveg", price: 13 },
  { id: 6, name: "Falafel Wrap", category: "veg", price: 9 },
  { id: 7, name: "Butter Chicken", category: "nonveg", price: 15 },
  { id: 8, name: "Greek Salad", category: "veg", price: 9 },
  { id: 9, name: "Ramen", category: "nonveg", price: 14 },
  { id: 10, name: "Veggie Burger", category: "veg", price: 11 },
  { id: 11, name: "Croissant", category: "veg", price: 4 },
  { id: 12, name: "Pho", category: "nonveg", price: 12 },
  { id: 13, name: "Tacos", category: "nonveg", price: 10 },
  { id: 14, name: "Paella", category: "nonveg", price: 17 },
  { id: 15, name: "Kimchi Fried Rice", category: "nonveg", price: 12 },
];

const AddToCart = [];

// Get Request
app.get("/user", (req, res) => {
  res.send(FoodMenu);
});

// For the Admin
// Post Request
app.post("/admin", (req, res) => {
  FoodMenu.push(req.body);
  res.send("Data added successfuly");
});

// Delete Request
app.delete("/admin/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = FoodMenu.findIndex((info) => info.id === id);
  if (index === -1) res.send("Food not found");
  FoodMenu.splice(index, 1);
  res.send("Data Deleted!");
});

// Patch Request
app.patch("/admin/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const food = FoodMenu.find((info) => info.id === id);
  if (!food) res.status(404).send("Didn't find the data");
  if (req.body.name !== undefined) food.name = req.body.name;
  if (req.body.category !== undefined) food.category = req.body.category;
  if (req.body.price !== undefined) food.price = req.body.price;
  res.send("Data updated successfuly!");
});

// Normal User
app.post("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const food = FoodMenu.find((info) => info.id === id);
  AddToCart.push(food);
  res.send("User added food item to the cart!");
  console.log(AddToCart);
});

app.delete("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const food = AddToCart.find((info) => info.id === id);
  if (!food) res.send("The food wasn't found");
  AddToCart.splice(food, 1);
  res.send("Item deleted successfuly from the cart.");
});

app.get("/dummy", (req, res) => {
  try {
    // JSON.parse("Invalid json");
    throw new Error("Error");
    res.send("Hello Coder!");
  } catch {
    res.send("Error Occured!");
  }
});

app.listen(4000, () => {
  console.log("Listening at 4000!");
});
