// npm i bcrypt

const bcrypt = require("bcrypt");

const password = "Shah@123";

async function hashPass() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  // to compare the password:
  const ans = await bcrypt.compare(password, hashed);
  console.log(ans);

  // It will show true if both of them are same otherwise will throw false.

  //   console.log(hashed);
  //   console.log(salt);
}

hashPass();
