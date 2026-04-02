const questionsBank = [
  {
    question:
      "Which keyword is used to declare a block-scoped variable in JavaScript?",
    options: ["var", "let", "type", "set"],
    answer: "let",
  },
  {
    question: "What is the result of '2' + 2?",
    options: ["4", "22", "NaN", "Error"],
    answer: "22",
  },
  {
    question: "Which method is used to remove the last element from an array?",
    options: ["shift()", "unshift()", "pop()", "push()"],
    answer: "pop()",
  },
  {
    question: "How do you write a single-line comment in JavaScript?",
    options: ["", "/* */", "//", "##"],
    answer: "//",
  },
  {
    question: "Which operator is used for strict equality comparison?",
    options: ["==", "=", "===", "!=="],
    answer: "===",
  },
  {
    question: "What is the correct syntax for an arrow function?",
    options: ["function => ()", "() => {}", "=> { function }", "() -> {}"],
    answer: "() => {}",
  },
  {
    question: "Which built-in method returns the length of a string?",
    options: ["size()", "index()", "length", "count()"],
    answer: "length",
  },
  {
    question: "What does 'NaN' stand for?",
    options: [
      "Not a Number",
      "New and Next",
      "Null and None",
      "No available Name",
    ],
    answer: "Not a Number",
  },
  {
    question: "Which of these is NOT a primitive data type in JavaScript?",
    options: ["String", "Boolean", "Object", "Undefined"],
    answer: "Object",
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function:myFunction()",
      "function = myFunction()",
      "function myFunction()",
      "new Function myFunction()",
    ],
    answer: "function myFunction()",
  },
  {
    question: "Which method converts a JSON string into a JavaScript object?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.object()",
      "JSON.toObj()",
    ],
    answer: "JSON.parse()",
  },
  {
    question: "What is the default value of an uninitialized variable?",
    options: ["null", "0", "undefined", "NaN"],
    answer: "undefined",
  },
  {
    question:
      "Which array method creates a new array by performing a function on each element?",
    options: ["filter()", "map()", "forEach()", "reduce()"],
    answer: "map()",
  },
  {
    question: "How do you stop a loop from continuing to the next iteration?",
    options: ["stop", "exit", "break", "return"],
    answer: "break",
  },
  {
    question: "What is the global object in a web browser environment?",
    options: ["document", "window", "global", "screen"],
    answer: "window",
  },
  {
    question: "Which event occurs when a user clicks on an HTML element?",
    options: ["onmouseclick", "onchange", "onmouseover", "onclick"],
    answer: "onclick",
  },
  {
    question: "How do you find the minimum value between x and y?",
    options: [
      "Math.min(x, y)",
      "Math.low(x, y)",
      "min(x, y)",
      "Math.smallest(x, y)",
    ],
    answer: "Math.min(x, y)",
  },
  {
    question: "Which statement is used to handle errors in JavaScript?",
    options: ["try...catch", "if...else", "throw...error", "error...handle"],
    answer: "try...catch",
  },
  {
    question: "What does 'DOM' stand for?",
    options: [
      "Data Object Model",
      "Document Object Model",
      "Digital Object Management",
      "Document Order Model",
    ],
    answer: "Document Object Model",
  },
  {
    question:
      "Which operator is used to spread an array into individual elements?",
    options: ["...", "&&", "||", "++"],
    answer: "...",
  },
];
const form = document.querySelector("form");
const out = document.getElementById("out");

// Store the correct answers for the current session
let correctAnswersMap = {};

function randomQuestion() {
  let arr = [];
  let length = questionsBank.length;

  for (let i = 0; i < 5; i++) {
    const index = Math.floor(Math.random() * length);
    arr.push(questionsBank[index]);
    length--;
    [questionsBank[index], questionsBank[length - 1]] = [
      questionsBank[length - 1],
      questionsBank[index],
    ];
  }
  return arr;
}

const problem = randomQuestion();

problem.forEach((obj, index) => {
  const div = document.createElement("div");
  div.className = "questions";

  // Map the question name (q1, q2...) to the actual answer string
  const questionName = `q${index + 1}`;
  correctAnswersMap[questionName] = obj.answer;

  const para = document.createElement("p");
  para.innerText = `${index + 1}. ${obj.question}`;
  div.appendChild(para);

  obj.options.forEach((optionText) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = questionName;
    input.value = optionText;
    input.required = true; // Ensures user selects an option

    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${optionText}`));
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
  });

  form.appendChild(div);
});

const button = document.createElement("button");
button.innerText = "Submit";
button.type = "submit";
button.className = "submit-btn";
form.appendChild(button);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let score = 0;

  // Iterate through the user's selections
  for (let [key, value] of formData.entries()) {
    if (value === correctAnswersMap[key]) {
      score++;
    }
  }

  out.innerText = `${score} out of 5 is correct`;
  form.reset();
});
