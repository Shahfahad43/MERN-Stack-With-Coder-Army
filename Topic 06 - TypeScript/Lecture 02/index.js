"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Type Inference -> Automatic Type Detection
let Name = "Fahad";
let age = 21;
// When type is not determined.
let value;
value = 10;
value = "Ali";
value = true;
// Now behaves exactly like JavaScript
// unknown
let data = "Hello";
// data.toUpperCase(); -> Error
if (typeof data === "string") {
    console.log(data.toUpperCase());
}
// Non primitive data types
let arr = [1, 2, 3, 4];
let strArr = ["Shah", "Ali", "Ahmad"];
let mixedArr = ["Shah", 20];
mixedArr = [21, "Shah", "Ali", 20];
// Objects
let info;
info = {
    Name: "Shah Fahad",
    age: 21,
    balance: 1000,
    ID: 12345,
};
// Note: You have to give data to all those variables which you have assigned to the first one otherwise it will throw an error.
console.log(info);
let user1 = {
    Name: "Shah",
    age: 21,
};
let user2 = {
    Name: "Ali",
    age: 20,
};
// Hence interface is emergible and diiferent values can be give to it now.
let user3 = {
    Name: "Shah",
    age: 20,
};
//# sourceMappingURL=index.js.map