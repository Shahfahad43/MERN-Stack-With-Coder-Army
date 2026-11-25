require("dotenv").config();
console.log("cwd:", process.cwd());
console.log("MONGO:", process.env.MONGODB_CONNECT_STR);
