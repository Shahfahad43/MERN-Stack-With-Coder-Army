const fs = require("fs");

fs.readFile("./data.json", "utf-8", (err, res) => {
  console.log(res);
});
// This will be executed at the end because it is asynchronous function and time taking.

const data = fs.readFileSync("./data.json", "utf-8");
console.log(data);
// Here it will be run synchronously

let a = 10;
let b = 20;

function sum(a, b) {
  console.log(a + b);
}

setTimeout(() => {
  console.log("Learning Backend");
}, 2000);

console.log(a);
sum(a, b);
console.log(b);

// Timeout is a global function which is given to Libuv and then to our file.
// console.log()
// fetch()
// setInterval()
// DOM
// All of these are available in the global funcion.
