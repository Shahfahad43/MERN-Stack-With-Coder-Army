const mongoose = require("mongoose");

const uri = "YOUR_CONNECTION_STRING_HERE"; // Paste your full URI here

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

testConnection();
