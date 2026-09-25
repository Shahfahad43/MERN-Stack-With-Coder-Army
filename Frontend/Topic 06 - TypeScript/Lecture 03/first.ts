type person = {
  name: string;
  age: number;
  id: number;
};

let account: person = {
  name: "Shah Fahad",
  age: 21,
  id: 1234,
};

// Making properties optional
type person2 = {
  name: string;
  age: number;
  id?: number; // optional
};

let account2: person2 = {
  name: "Shah Fahad",
  age: 21,
  // Here if I am not declaring the id so it will not give any error
};

// The use of partial to make all the properties optional
type person3 = {
  name: string;
  fName: string;
  id: number;
  gender: string;
};

let account3: Partial<person3> = {
  name: "Shah Fahad",
  // Here if I am not declaring other variables, it won't give any error.
};

// Making all ther properties required

let account4: Required<person3> = {
  // Here You have to declare all the properties
  name: "Shah Fahad",
  fName: "Tahir Ali",
  id: 1234,
  gender: "male",
};

// The use of Readonly to make the properties immutable
let account5: Readonly<person> = {
  name: "Shah Fahad",
  age: 21,
  id: 1234,
};
// account5.name = "Ali" => not permissible

// Array of objects
type obj = {
  name: string;
  age: number;
  id: number;
};
const arr: obj[] = [
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
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(12, 34));

// Optional parameters
function data(name?: string): void {
  console.log(`Hello ${name || "Guest"}`);
}
console.log(data("Shah"));
console.log(data());

// default parameter
function greet(msg: string = "Hello"): void {
  console.log(msg);
}
console.log(greet());

// Arrow Functions
let info = (firstName: string, secondName: string): string => {
  return firstName + " " + secondName;
};
console.log(info("Shah", "Fahad"));

// Rest parameter
let result = (...numbers: number[]): number => {
  return numbers.reduce((a: number, b: number): number => {
    return a + b;
  });
};
console.log(result(12, 23, 34, 45));

// example 2

let sum = (...nums: number[]) => {
  let total: number = 0;
  console.log(
    nums.forEach((a) => {
      total += a;
    }),
  );
  return total;
};

console.log(sum(12, 34, 45));

// callback function
type Callback = (amount: number) => void;

const placeOrder = (order: number, callback: Callback): void => {
  const amount: number = order + 10;
  callback(amount);
};

placeOrder(10, (amount) => {
  console.log(amount);
});

// Classes

class Bank {
  name: string;
  age: number;
  id: number;

  constructor(name: string, age: number, id: number) {
    this.name = name;
    ((this.age = age), (this.id = id));
  }
}

const per1 = new Bank("Shah", 21, 1234);
console.log(per1);
