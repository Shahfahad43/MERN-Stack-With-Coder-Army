// Method 1:
// const sum = require("./today/mul");
// const mul = require("./today/sub");
// const sub = require("./today/sum");

// Method 2:
const { sum, mul, sub } = require("./today/index");
// Even if you don't mention the name of index.js, it will run because because by default it takes this one.
// Otherwise it will throw an error.

sum(2, 4);
mul(2, 4);
sub(2, 4);

console.log("I am first.");
