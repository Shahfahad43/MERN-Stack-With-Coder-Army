"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let account = {
    name: "Shah Fahad",
    age: 21,
    id: 1234,
};
let account2 = {
    name: "Shah Fahad",
    age: 21,
    // Here if I am not declaring the id so it will not give any error
};
let account3 = {
    name: "Shah Fahad",
    // Here if I am not declaring other variables, it won't give any error.
};
// Making all ther properties required
let account4 = {
    // Here You have to declare all the properties
    name: "Shah Fahad",
    fName: "Tahir Ali",
    id: 1234,
    gender: "male",
};
// The use of Readonly to make the properties immutable
let account5 = {
    name: "Shah Fahad",
    age: 21,
    id: 1234,
};
const arr = [
    {
        name: "Ali",
        age: 21,
        id: 123,
    },
    {
        name: "kashif",
        age: 21,
        id: 123,
    },
    {
        name: "faraz",
        age: 21,
        id: 123,
    },
    {
        name: "ahmad",
        age: 21,
        id: 123,
    },
];
// Functions
function add(a, b) {
    return a + b;
}
console.log(add(12, 34));
// Optional parameters
function data(name) {
    console.log(`Hello ${name || "Guest"}`);
}
console.log(data("Shah"));
console.log(data());
// default parameter
function greet(msg = "Hello") {
    console.log(msg);
}
console.log(greet());
// Arrow Functions
let info = (firstName, secondName) => {
    return firstName + " " + secondName;
};
console.log(info("Shah", "Fahad"));
// Rest parameter
let result = (...numbers) => {
    return numbers.reduce((a, b) => {
        return a + b;
    });
};
console.log(result(12, 23, 34, 45));
// example 2
let sum = (...nums) => {
    let total = 0;
    console.log(nums.forEach((a) => {
        total += a;
    }));
    return total;
};
console.log(sum(12, 34, 45));
const placeOrder = (order, callback) => {
    const amount = order + 10;
    callback(amount);
};
placeOrder(10, (amount) => {
    console.log(amount);
});
// Classes
class Bank {
    name;
    age;
    id;
    constructor(name, age, id) {
        this.name = name;
        ((this.age = age), (this.id = id));
    }
}
const per1 = new Bank("Shah", 21, 1234);
console.log(per1);
//# sourceMappingURL=first.js.map