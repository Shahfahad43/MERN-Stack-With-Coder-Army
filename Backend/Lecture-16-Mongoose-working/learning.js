import mongoose from "mongoose";

// Getting Schema
import { Schema } from "mongoose";

async function main() {
  // Database can be created just by giving it a name at the end after the / i.e. Bookstore
  await mongoose.connect(
    "mongodb+srv://Shah_Fahad:Fahad123@learningbackend.f4z4wux.mongodb.net/Bookstore",
  );

  const userSchem = new Schema({
    name: String,
    age: Number,
    city: String,
    gender: String,
  });

  // Creating Collection
  const User = mongoose.model("User", userSchem);

  // How to add different users to the collection of the database
  // Creating a new user
  // const user1 = new User({
  //   name: "Shah",
  //   age: 20,
  //   city: "ICT",
  //   gender: "male",
  // });

  // // Saving the new user inside the collection
  // await user1.save();

  // The above step can be done in one step
  // await User.create({ name: "Ali", city: "Mumbai", gender: "male" });

  // You can insert multiple enteries as well
  //   await User.insertMany(
  //     { name: "Ahmad", city: "New York", age: 20 },
  //     { name: "Hamza", age: 22, city: "Paris" },
  //   );

  // The results can be seen by refreshing the cluster.

  // The data inside the collection can be found but make sure to comment the above code to prevent duplicate data enteries.
  //   const result = await User.find({});
  //   console.log("Data in User: ", result);

  // You can find a user using specific data as well
  const result = await User.find({ name: "Shah" });
  console.log(result);
}

main()
  .then(() => console.log("Connected Successfuly!"))
  .catch((err) => console.log(err));
