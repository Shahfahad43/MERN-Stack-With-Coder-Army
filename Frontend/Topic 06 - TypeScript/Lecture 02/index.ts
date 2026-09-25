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
let data: unknown = "Hello";
// data.toUpperCase(); -> Error

if (typeof data === "string") {
  console.log(data.toUpperCase());
}

// Non primitive data types

let arr: number[] = [1, 2, 3, 4];
let strArr: string[] = ["Shah", "Ali", "Ahmad"];

let mixedArr: (string | number)[] = ["Shah", 20];

mixedArr = [21, "Shah", "Ali", 20];

// Objects
let info: { Name: string; age: number; balance: number; ID: number };

info = {
  Name: "Shah Fahad",
  age: 21,
  balance: 1000,
  ID: 12345,
};
// Note: You have to give data to all those variables which you have assigned to the first one otherwise it will throw an error.
console.log(info);

// type vs interface
type user = {
  Name: string;
  age: number;
};

let user1: user = {
  Name: "Shah",
  age: 21,
};

let user2: user = {
  Name: "Ali",
  age: 20,
};

interface main {
  Name: string;
}

interface main {
  age: number;
}

// Hence interface is emergible and diiferent values can be give to it now.

let user3: main = {
  Name: "Shah",
  age: 20,
};
