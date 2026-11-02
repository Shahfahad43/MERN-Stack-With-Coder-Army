# Lecture 30: AI Agents — Build a Weather Agent from Scratch

## 1. What Is an AI Agent?

An AI agent is a software system that uses an AI model to understand a goal, decide what action is needed, use tools to gather information or perform tasks, and continue until it reaches a stopping condition.

A normal chatbot primarily responds to messages. An agent can do more: it can decide that it needs external information, call a tool, examine the result, and use that result to answer the user.

For example, suppose you ask:

> What is the weather in Islamabad today?

A basic LLM might explain weather concepts, but it cannot reliably know the live weather from its training alone.

An AI weather agent can:

1. Understand your question.
2. Identify the city and date.
3. Request current weather data from a weather API.
4. Read the API response.
5. Ask the LLM to explain the weather.
6. Return the final answer.

That is the central idea of this lecture.

## 2. What Are We Building?

We are building a terminal-based weather AI agent using Gemini, JavaScript, Node.js, and an external weather API.

## Our agent's workflow

1\. User

"What is the weather in Islamabad?"

2\. Gemini LLM

Extracts the city and date, then chooses the next step.

3\. Weather tool

Calls the external weather API.

4\. Weather API response

Returns temperature, conditions and other data.

5\. Gemini LLM

Interprets the returned data and prepares the report.

6\. Final answer

A readable weather report for the user.

The important point is that Gemini does not fetch the weather directly in this code. Your JavaScript program fetches the weather, and Gemini interprets the request and the returned information.

## 3. Prerequisites: What You Need to Understand

You do not need to be a professional programmer to understand this project. Start with these concepts.

| Concept               | Simple meaning                                                         |
| --------------------- | ---------------------------------------------------------------------- |
| JavaScript            | The language used to write the agent's logic                           |
| Node.js               | Runs JavaScript outside the browser                                    |
| Package               | Reusable code written by other developers                              |
| API                   | A way for one software system to request data or services from another |
| LLM                   | A model that understands and generates language                        |
| Prompt                | Instructions and information sent to an LLM                            |
| JSON                  | A structured format for representing data                              |
| `async/await`         | A way to write code that waits for asynchronous operations             |
| Environment variables | Configuration values stored outside the source code                    |
| Loop                  | Code that repeats while a condition remains true                       |

### Three types of work happen in this project

- AI work: Understand the user's question and generate a weather report.
- JavaScript work: Manage history, call functions, parse JSON and control the workflow.
- External service work: Obtain real weather data from a weather API.

Understanding these responsibilities will help you build agents for other purposes later, such as searching documents, analyzing expenses, or answering university-related questions.

## 4. Project Setup: Install the Required Packages

Create a new project folder and open it in your terminal.

```
mkdir weather-ai-agent
cd weather-ai-agent
npm init -y
```

The command `npm init -y` creates a `package.json` file. This file describes your Node.js project and records its dependencies.

Install the packages:

```
npm install @google/genai dotenv readline-sync
```

### What does each package do?

`@google/genai`

Google's JavaScript SDK for communicating with Gemini models.

`dotenv`

Loads environment variables from a `.env` file into `process.env`.

`readline-sync`

Reads the user's input from the terminal.

The project uses Node.js's built-in `fetch()` function to make HTTP requests. Recent Node.js versions provide it without installing another package.

Check your installed version:

```
node --version
npm --version
```

Use a currently supported Node.js version with built-in `fetch()`.

### Create the environment file

Create a file named `.env` in your project folder:

```
API_KEY=your_gemini_api_key
WEATHER_API=your_weather_api_endpoint
```

These values are placeholders; replace them with your actual configuration.

- `API_KEY` is your Gemini API key.
- `WEATHER_API` is the base endpoint expected by your chosen weather service.

The code also expects that the weather endpoint accepts a city appended to the URL and returns JSON. The exact URL structure depends on the weather provider, so the original code cannot work with an arbitrary weather API without adapting the request.

Create a `.gitignore` file:

```
node_modules/
.env
```

Security rule: Never publish your API keys in GitHub or expose them in frontend JavaScript.

## 5. Understand the Overall Code Structure

Your original code is written in one JavaScript file. We will first understand the exact structure, then examine each section line by line.

```
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const readlineSync = require("readline-sync");

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

const chatHistory = [];
```

These lines prepare the environment for the agent.

The remaining code has two main functions:

- `getWeather(location)` — retrieves weather data.
- `chatWithAgent()` — manages the conversation and controls the agent's decisions.

The program starts with:

```
chatWithAgent();
```

This starts the entire process.

## 6. Step One: Import Packages and Initialize Gemini

Let's break down the first part of the code.

### 6.1 Import Gemini's SDK

```
const { GoogleGenAI } = require("@google/genai");
```

What does this mean?

`require()` loads code from a package installed in your project.

The `@google/genai` package provides Google's tools for sending requests to Gemini.

The curly braces mean we are extracting the `GoogleGenAI` export from that package.

Think of the SDK as a ready-made connection between your JavaScript code and Google's AI service. You do not have to write the HTTP communication with Gemini from scratch.

### 6.2 Load dotenv

```
const dotenv = require("dotenv");
dotenv.config();
```

The first line imports the `dotenv` package.

The second line reads your `.env` file and makes its values available through `process.env`.

For example, if `.env` contains:

```
API_KEY=abc123
```

Then your Node.js program can access it using:

```
process.env.API_KEY
```

The value is read at runtime rather than being hardcoded directly into the program.

### 6.3 Import terminal input functionality

```
const readlineSync = require("readline-sync");
```

This package lets the program ask a question and wait for the user to type an answer in the terminal.

Later, we use:

```
const userQuestion =
  readlineSync.question("How can I help you? ");
```

The program displays:

```
How can I help you?
```

If the user types:

```
What is the weather in Islamabad?
```

That text is stored in the variable `userQuestion`.

### 6.4 Create the Gemini client

```
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});
```

This creates a Gemini client.

Let's understand the parts:

- `GoogleGenAI` is the class provided by the SDK.
- `new` creates an instance of that class.
- `apiKey` provides the credential needed to authenticate with Google's service.
- `process.env.API_KEY` retrieves the key from your environment.

You can now use `ai` to send requests to a Gemini model.

### 6.5 Create chat history

```
const chatHistory = [];
```

This creates an empty array.

An array is a collection that stores multiple values in order.

Initially:

```
chatHistory = [];
```

After adding a user message and a model response, it could contain:

```
[
  {
    role: "user",
    parts: [{ text: "What is the weather in Islamabad?" }]
  },
  {
    role: "model",
    parts: [{ text: "{\"weather_details_needed\":true}" }]
  }
]
```

The actual model response in your code would normally contain the complete JSON instruction output, not the shortened illustrative text above.

Why do we need chat history?

The agent uses history to provide previous messages to Gemini. In this example, history is also how the program supplies the weather data to Gemini after retrieving it.

One limitation: `chatHistory` is a global in-memory array, so all questions during this process share the same history. It is not automatically saved to a database, and it disappears when the process stops.

## 7. Step Two: Build the Weather Tool

Now examine the first function:

```
async function getWeather(location) {
  const weatherInfo = [];

  for (const { city, date } of location) {
    if (date.toLowerCase() == "today") {
      const response = await fetch(
        process.env.WEATHER_API + `${city}`
      );

      const data = await response.json();
      weatherInfo.push(data);
    } else {
      const response = await fetch(
        process.env.WEATHER_API + `${city}` + `&d${date}`
      );

      const data = await response.json();
      weatherInfo.push(data);
    }
  }

  return weatherInfo;
}
```

This function is the agent's weather tool. It is ordinary JavaScript code, not an LLM.

### 7.1 What is a function?

A function is a reusable block of code that performs a task.

For example:

```
function add(a, b) {
  return a + b;
}

const result = add(5, 3);
console.log(result); // 8
```

Instead of writing the addition logic repeatedly, you define it once and call it whenever needed.

Our weather function follows the same idea, but its task is to fetch data from an external service.

### 7.2 Why is the function `async`?

```
async function getWeather(location)
```

The `async` keyword allows a function to use `await` and return a Promise.

An external API request takes time. The program must wait for the service to respond before it can use the result.

For example, this request:

```
const response = await fetch(url);
```

means:

1. Start the HTTP request.
2. Wait for the response.
3. Continue to the next statement after the response is available.

`await` does not freeze the entire Node.js runtime; it suspends the current asynchronous function while the request is pending.

### 7.3 What is the `location` parameter?

```
async function getWeather(location)
```

The parameter `location` receives the data passed to the function.

In this program, Gemini is expected to return an array like this:

```
[
  { city: "Islamabad", date: "today" },
  { city: "London", date: "2026-11-20" }
]
```

The function can then request weather information for each requested city and date.

The name `location` is slightly misleading because the array contains both cities and dates. A name such as `weatherRequests` would describe the data more clearly.

### 7.4 Create an array to store weather results

```
const weatherInfo = [];
```

This array starts empty.

As the function retrieves weather information, each result is added to it.

For example, after retrieving data for two cities, it might contain:

```
[
  { city: "Islamabad", temperature: 28 },
  { city: "London", temperature: 12 }
]
```

These objects are illustrative. A real weather API will return the fields defined by its own response format.

### 7.5 Understand the `for...of` loop

```
for (const { city, date } of location)
```

This line performs two tasks.

First, `for...of` iterates through each element of the `location` array.

Second, `{ city, date }` uses object destructuring to extract the properties named `city` and `date`.

For example, if the current element is:

```
{
  city: "Islamabad",
  date: "today"
}
```

Then the variables have these values:

```
city = "Islamabad";
date = "today";
```

The loop repeats for each element.

Example:

```
const cities = [
  { city: "Islamabad", date: "today" },
  { city: "London", date: "today" }
];

for (const { city, date } of cities) {
  console.log(city, date);
}
```

Output:

```
Islamabad today
London today
```

### 7.6 Check whether the date is today

```
if (date.toLowerCase() == "today")
```

The code checks whether the date equals `"today"`.

The method `.toLowerCase()` converts text to lowercase. This means `"TODAY"`, `"Today"`, and `"today"` all become `"today"`.

The `==` operator checks for equality, with type conversion in some cases. In JavaScript, `===` is generally preferred when comparing values because it avoids implicit type conversion.

A cleaner version is:

```
if (date.toLowerCase() === "today")
```

If the date is today, the function makes a request using the city.

### 7.7 Fetch data from the weather API

```
const response = await fetch(
  process.env.WEATHER_API + `${city}`
);
```

Let's separate this expression.

- `process.env.WEATHER_API` contains the base URL.
- `${city}` inserts the city name into a template string.
- `+` joins the strings.
- `fetch()` sends the HTTP request.
- `await` waits for the response.

Suppose the configured base URL is:

```
https://example.com/weather?city=
```

And `city` is `"Islamabad"`.

The resulting URL becomes:

```
https://example.com/weather?city=Islamabad
```

This example URL is illustrative, not a real weather endpoint.

Important limitation: The URL construction depends on your weather provider's API format. Some APIs require an API key, coordinates, a different date parameter, or a different endpoint entirely.

### 7.8 Convert the response into JSON

```
const data = await response.json();
```

The HTTP response contains a body. If the service returns JSON, `.json()` reads and parses that body into a JavaScript value, often an object.

For example, a service might return:

```
{
  "city": "Islamabad",
  "temperature": 28,
  "condition": "Sunny"
}
```

After parsing, JavaScript can access its properties:

```
console.log(data.city);
console.log(data.temperature);
```

Output:

```
Islamabad
28
```

Notice that `fetch()` and `response.json()` are two separate asynchronous operations: first the response arrives, then its body is read and parsed.

### 7.9 Add the result to the array

```
weatherInfo.push(data);
```

The `.push()` method adds a value to the end of an array.

After the first API request, `weatherInfo` contains one result. After the second, it contains two.

This preserves the results for every requested city.

### 7.10 What does the `else` branch do?

```
else {
  const response = await fetch(
    process.env.WEATHER_API + `${city}` + `&d${date}`
  );

  const data = await response.json();
  weatherInfo.push(data);
}
```

This branch runs when the date is not `"today"`.

The intended idea is to ask the weather API for a date-specific forecast or historical result.

However, there is a likely bug in this URL construction:

```
`&d${date}`
```

It produces a string such as:

```
&d2026-11-20
```

Many APIs would expect a parameter such as `&date=2026-11-20`, but the correct format depends on the provider. The lecture code does not establish which API is being used, so we cannot assume that this parameter is valid.

Also, not every weather API can provide arbitrary future dates. Some provide only a limited forecast window, while others provide historical data through separate endpoints.

### 7.11 Return all the results

```
return weatherInfo;
```

The function returns the array after processing the requested locations.

For example:

```
const weather = await getWeather([
  { city: "Islamabad", date: "today" }
]);

console.log(weather);
```

The `weather` variable now contains the result returned by the weather service.

### What this function does not do

It does not:

- Understand natural language.
- Decide which city the user means.
- Generate a weather explanation.
- Know whether an API response is accurate.

It simply accepts structured input, fetches data, and returns the results.

That separation is a good software design principle: each component should have a clear responsibility.

## 8. Step Three: Read the User's Question

Now we reach the main agent function:

```
async function chatWithAgent() {
  const userQuestion =
    readlineSync.question("How can I help you? ");
```

### What happens here?

The program displays a question in the terminal and waits for input.

Suppose the user enters:

```
What is the weather in Islamabad today?
```

Then:

```
userQuestion =
  "What is the weather in Islamabad today?";
```

The variable stores the user's exact text.

At this point, the program has not called Gemini or the weather API. It has only collected the question.

### Why is this function also `async`?

Because the function later uses `await` to wait for Gemini and the weather service.

Even though terminal input here is synchronous, the rest of the function performs asynchronous operations.

## 9. Step Four: Understand the Prompt — The Instructions Given to Gemini

This is one of the most important parts of the project.

The code constructs a long prompt:

```
const prompt = `You are a precise dual-mode AI agent...
```

A prompt is the instruction and information given to an LLM to guide its response.

Your prompt tells Gemini that it must operate in two modes.

### Mode 1: Extract the required weather details

The first mode is used when the agent needs to discover which location and date the user is asking about.

The prompt requires Gemini to return this structure:

```
{
  "weather_details_needed": true,
  "location": [
    {
      "city": "Islamabad",
      "date": "today"
    }
  ]
}
```

The fields mean:

- `weather_details_needed`: A Boolean indicating whether the agent still needs to retrieve weather data.
- `location`: An array containing the requested cities and dates.
- `city`: The location whose weather is requested.
- `date`: The date for the weather request.

The value `true` tells the program that it must retrieve the data.

### Mode 2: Generate the final weather report

After the weather data has been retrieved, Gemini should produce a different JSON structure:

```
{
  "weather_details_needed": false,
  "weather_report": "Islamabad is currently sunny with a temperature of 28°C."
}
```

Here:

- `weather_details_needed` is `false`, meaning the agent has enough information to produce its final response.
- `weather_report` contains the human-readable report.

The program uses these fields to decide what to do next.

### Why require JSON instead of normal text?

Suppose Gemini responds:

> I will check the weather in Islamabad today.

That sentence is understandable to a person, but the program cannot reliably use it to call the weather API without additional parsing.

Now suppose Gemini returns:

```
{
  "weather_details_needed": true,
  "location": [
    {
      "city": "Islamabad",
      "date": "today"
    }
  ]
}
```

The program can access the fields directly:

```
data.weather_details_needed
data.location
```

This makes the model's response easier for code to process.

However, asking for JSON does not guarantee valid JSON. The model may still produce malformed output or fields that do not match the expected structure. We will address this problem later.

### Understand the template string

The prompt uses backticks:

```
const prompt = `Instructions here
User input: ${userQuestion}`;
```

Backticks create a JavaScript template literal. Template literals allow multiline strings and interpolation using `${...}`.

If the user enters:

```
What is the weather in Islamabad?
```

Then `${userQuestion}` is replaced by that text when JavaScript constructs the prompt.

The full prompt includes the instructions and the user's question.

### Why does the prompt say `Current Year: 2026`?

```
Current Year: 2026
```

This is an instruction intended to help Gemini interpret dates such as "20th November" or "next week."

It does not retrieve the real date or guarantee correct date reasoning. Hardcoding a year also means the prompt must be updated later.

A better application obtains the current date programmatically, ideally using the relevant location's timezone when interpreting relative dates.

### A critical limitation in the original prompt

The prompt explains two modes, but it does not explicitly provide a separate, reliable mechanism that proves the weather data has already been fetched.

Instead, the code relies on the conversation history and Gemini following the instructions. That may work in a simple demonstration, but it is not a strong state-management design.

A more robust implementation should track the current workflow state in JavaScript, validate model output, and distinguish between:

- Asking for weather details.
- Retrieving the weather.
- Generating the final report.

The model should not be the sole authority on whether a tool has actually run.

## 10. Step Five: Add the Prompt to Chat History

The code now executes:

```
chatHistory.push({
  role: "user",
  parts: [{ text: prompt }],
});
```

This adds the prompt to the history array.

Let's understand each part.

### `chatHistory.push()`

Adds a new item to the end of the array.

### `role: "user"`

Identifies the message as a user-role message in Gemini's conversation format.

Here, the program puts the entire instruction prompt inside that message. It is not sending only the user's question.

### `parts: [{ text: prompt }]`

The message's text is stored inside the `parts` array.

The structure looks like this:

```
{
  role: "user",
  parts: [
    {
      text: "Instructions ... User input: What is the weather in Islamabad?"
    }
  ]
}
```

The `parts` structure allows Gemini content to contain text and, where supported, other content types.

### Why is history needed here?

The history is supplied to Gemini in the next step. After the first model response, the program will add the weather data as another message, then call Gemini again.

That is how the application gives the model the information it did not have when the original question arrived.

## 11. Step Six: The `while (true)` Loop — The Agent's Control Flow

The code contains:

```
while (true) {
  // Agent's workflow
}
```

A `while` loop repeats its body as long as its condition is true.

Since `true` is always true, this loop has no automatic stopping condition. It must exit through a statement such as `break`, or an error must interrupt execution.

Why would an agent need a loop?

Because the first response from Gemini may not be the final answer.

The process may need to happen in stages:

1. Gemini identifies the requested location and date.
2. JavaScript fetches the weather data.
3. Gemini receives the data.
4. Gemini generates the final report.
5. The program stops the loop.

The loop lets the program repeatedly call Gemini until it receives the final-response mode.

This pattern is often called an agent loop: model decision → tool execution → model decision again.

### Why not call Gemini only once?

Because the model's first response may only identify the action it needs.

The weather API call happens in your JavaScript code, not automatically inside Gemini. Once the API result is available, the model needs another opportunity to interpret that result.

The loop provides that opportunity.

## 12. Step Seven: Send the Conversation to Gemini

Inside the loop, the code calls Gemini:

```
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: chatHistory,
});
```

This is where the LLM is actually invoked.

### Understand the arguments

`ai.models.generateContent()`

This SDK method sends content to the selected Gemini model and returns a response.

`model`

```
model: "gemini-3.5-flash"
```

This specifies the model identifier.

Model identifiers can change, and the exact ID in the lecture may not be available in your account or in the current API. Check the current official Gemini documentation and select a supported model before running the project.

`contents: chatHistory`

The application sends the conversation history to the model.

This is important because the model needs to see the prompt and, on later calls, the returned weather information.

`await`

The program waits for Gemini's response before moving to the next statement.

### What happens inside Gemini?

At a high level:

1. Gemini receives the supplied messages.
2. It processes the instructions and user's request.
3. It generates a response following the requested format, if it can.
4. The SDK returns that response to your JavaScript program.

The model is not executing your `getWeather()` function. It is generating instructions in a format your program can interpret.

## 13. Step Eight: Extract and Store Gemini's Response

The next lines are:

```
const answer = response.text;
```

This extracts the text response from the SDK response object.

Because the prompt asks for JSON, the expected text might look like:

```
{
  "weather_details_needed": true,
  "location": [
    {
      "city": "Islamabad",
      "date": "today"
    }
  ]
}
```

Then the code adds the response to history:

```
chatHistory.push({
  role: "model",
  parts: [{ text: answer }],
});
```

The `role: "model"` indicates that this message came from Gemini.

After this operation, the history contains both the instruction prompt and the model's response.

### What about the commented-out lines?

```
// console.log("\nModel Response:");
// console.log(response.text);
```

Anything after `//` on a line is a comment and is not executed.

These lines would print Gemini's raw response if you removed the comment markers.

Comments are useful for debugging, but remember that model responses may contain private information, so avoid logging sensitive data in production.

## 14. Step Nine: Convert the JSON Text into a JavaScript Object

The next line is:

```
const data = JSON.parse(answer);
```

This is a critical step.

Gemini returns text. Your program needs structured JavaScript data so it can decide what to do.

### Before parsing

```
const answer = '{"weather_details_needed":true}';
```

Here, `answer` is a string. It is not yet a JavaScript object.

### After parsing

```
const data = JSON.parse(answer);
```

Now `data` is an object:

```
{
  weather_details_needed: true
}
```

The program can check:

```
data.weather_details_needed
```

which evaluates to `true`.

### Why can `JSON.parse()` fail?

If Gemini returns:

```
Here is the JSON you requested:
{"weather_details_needed": true}
```

the complete string is not valid JSON, because it contains explanatory text before the JSON object.

Then `JSON.parse(answer)` throws an error.

This is why a reliable agent should validate model output and handle parsing errors rather than assuming that the prompt always works.

## 15. Step Ten: Decide Whether to Finish or Retrieve Weather

The code prints the parsed object:

```
console.log(data);
```

Then checks:

```
if (data.weather_details_needed === false) {
  console.log(data.weather_report);
  break;
}
```

This is the agent's decision point.

### Case A: The model says `false`

If the model returns:

```
{
  weather_details_needed: false,
  weather_report: "Islamabad is sunny today."
}
```

The program prints the report:

```
Islamabad is sunny today.
```

Then:

```
break;
```

exits the loop.

The agent has finished its task.

### Case B: The model says `true`

If the model returns:

```
{
  weather_details_needed: true,
  location: [
    { city: "Islamabad", date: "today" }
  ]
}
```

The condition is false, so the `if` body is skipped.

Execution continues to:

```
const weather = await getWeather(data.location);
```

The program now calls the weather tool.

### Why use `=== false`?

It checks that the value is actually the Boolean `false`.

For example:

```
false === false // true
"false" === false // false
```

The string `"false"` is not the same as the Boolean `false`.

This distinction matters when processing model-generated JSON.

A design warning: If the model returns an unexpected value or malformed structure, the original code has no explicit fallback. A robust implementation should validate that `weather_details_needed` is a Boolean and that the expected fields exist before proceeding.

## 16. Step Eleven: Execute the Weather Tool and Return Its Data to Gemini

The next section is:

```
const weather = await getWeather(data.location);

const weatherInString = JSON.stringify(weather);

chatHistory.push({
  role: "user",
  parts: [
    {
      text: `Here is the weather details for the requested cities: ${weatherInString}`,
    },
  ],
});

console.log(weather);
```

This section connects the LLM with the external world.

### 16.1 Call the weather function

```
const weather = await getWeather(data.location);
```

The value `data.location` came from the JSON returned by Gemini.

For example:

```
[
  { city: "Islamabad", date: "today" }
]
```

The function calls the weather API and returns the resulting data.

The `await` makes the program wait until `getWeather()` finishes.

### 16.2 Convert the weather result into a string

```
const weatherInString = JSON.stringify(weather);
```

`JSON.stringify()` converts a JavaScript value into JSON text.

For example:

```
const weather = [
  {
    city: "Islamabad",
    temperature: 28,
    condition: "Sunny"
  }
];

console.log(JSON.stringify(weather));
```

Output:

```
[{"city":"Islamabad","temperature":28,"condition":"Sunny"}]
```

Why is this useful? The application wants to place the weather result inside a text message sent to Gemini.

### 16.3 Send the weather result back as context

```
chatHistory.push({
  role: "user",
  parts: [
    {
      text: `Here is the weather details for the requested cities: ${weatherInString}`,
    },
  ],
});
```

This adds the API result to the conversation history.

Notice the role is `"user"`. The program is using a user-role message to provide tool output as context to Gemini.

This can work in a simple demonstration, but it is not the clearest representation of a real tool call. When using a provider's native function-calling mechanism, the tool result should be supplied in the format that provider expects for tool responses.

### 16.4 Why does Gemini need another request?

Gemini generated the initial location and date, but the weather data only became available after JavaScript called the API.

The application must send the weather data back to the model so it can create a report based on that data.

After the new message is added, the loop repeats:

```
while (true) {
  // Send the updated history to Gemini again.
}
```

The next Gemini response should be the final report:

```
{
  "weather_details_needed": false,
  "weather_report": "The weather in Islamabad is sunny, with a temperature of 28°C."
}
```

The program prints the report and exits the loop.

### Why is the weather result printed separately?

```
console.log(weather);
```

This prints the raw API response for debugging.

The final response is printed later:

```
console.log(data.weather_report);
```

Raw API data is useful while developing the agent, but a user-facing application would generally display only the relevant, readable report.

## 17. Step Twelve: Start the Agent

At the bottom of the file:

```
chatWithAgent();
```

This calls the function and begins the process.

Run the file from your terminal:

```
node index.js
```

You should see:

```
How can I help you?
```

Enter a question, such as:

```
What is the weather in Islamabad today?
```

The program then attempts to:

1. Send the prompt to Gemini.
2. Extract the location and date.
3. Call the weather API.
4. Send the returned data to Gemini.
5. Print the final report.

This works only after you have configured a valid Gemini key, a supported model ID, and a weather API endpoint compatible with the code.

## 18. The Complete Agent Loop — A Dry Run

A dry run means walking through the program's execution step by step without needing to execute it.

Suppose the user enters:

```
What is the weather in Islamabad today?
```

## Execution trace

1. User input

   `userQuestion` stores the question as a string.

2. Prompt construction

   The program combines the user's question with instructions defining the two response modes.

3. First Gemini request

   The model returns a JSON object asking for weather data.

   ```
   {
     "weather_details_needed": true,
     "location": [
       {"city": "Islamabad", "date": "today"}
     ]
   }
   ```

4. JSON parsing

   `JSON.parse(answer)` converts the JSON text into a JavaScript object.

5. Decision

   `weather_details_needed === false` evaluates to `false`, so the program does not break out of the loop.

6. Tool execution

   `getWeather(data.location)` calls the weather API and returns the data.

7. Context update

   The weather result is converted into JSON text and appended to `chatHistory`.

8. Second Gemini request

   The model receives the updated history and should generate the final weather report.

9. Finish

   If the response has `weather_details_needed: false`, the program prints the report and executes `break`.

### The agent's core logic in pseudocode

Pseudocode describes the logic without requiring exact JavaScript syntax.

```
Ask the user for a question

Send the question and instructions to the LLM

Repeat:
    Read the LLM's response

    If the LLM says it has the final answer:
        Print the answer
        Stop

    Otherwise:
        Extract the requested city and date
        Fetch the weather
        Add the weather data to the conversation
        Ask the LLM again
```

This pattern is the foundation of many tool-using agents.

## 19. Important Problems in the Original Code

The original code is useful for learning, but it should not be treated as production-ready. Understanding its limitations is part of learning how to build reliable agents.

| Problem                             | Why it matters                                       | Improvement                                     |
| ----------------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| Unsupported model ID                | The Gemini request may fail                          | Use a currently supported model ID              |
| Invalid weather URL                 | The weather API may reject the request               | Follow the provider's API documentation         |
| No HTTP status check                | Error responses may be treated as weather data       | Check `response.ok` before parsing              |
| No error handling                   | One failed request can crash the workflow            | Use `try/catch`                                 |
| `JSON.parse()` assumes valid output | Unexpected model text causes an exception            | Validate the output and handle parse failures   |
| No limit on agent loop              | The model could repeatedly request data              | Add a maximum number of iterations              |
| No input validation                 | Invalid locations and dates may be passed to the API | Validate the city, date, and returned structure |
| Global history                      | Different questions share the same history           | Use separate conversation state                 |
| All history stays in memory         | Memory and token use grow over time                  | Limit, summarize, or persist history            |
| Model controls the workflow signal  | The model may return inconsistent fields             | Track workflow state in JavaScript              |

### A subtle bug: the API request may fail silently

In the original code:

```
const response = await fetch(url);
const data = await response.json();
```

`fetch()` does not normally throw merely because the server returns an HTTP error such as `404` or `500`. It can still return a response object.

You should check:

```
if (!response.ok) {
  throw new Error(`Weather API failed: ${response.status}`);
}
```

Then parse the JSON only after confirming the response is successful.

### A second subtle bug: no limit on the loop

The original loop uses:

```
while (true)
```

It relies on Gemini eventually returning `weather_details_needed: false`.

If Gemini repeatedly returns `true`, the program could keep making requests. This can waste time, API quota, and money.

A maximum iteration count helps prevent runaway execution.

### A third subtle bug: dates are not validated

The model could return:

```
{
  "weather_details_needed": true,
  "location": [
    {"city": "", "date": "whenever"}
  ]
}
```

Even if the output is valid JSON, its contents are not necessarily valid input.

Valid JSON does not mean valid data. Always validate the structure and values before using them.

## 20. A Safer, Beginner-Friendly Version of the Agent

The following version keeps the same basic idea but improves the workflow:

- Checks HTTP errors.
- Validates the model's JSON response.
- Limits the number of agent iterations.
- Separates the original question from the weather data.
- Handles errors with `try/catch`.
- Uses a clear stopping condition.

It still depends on your weather provider's actual URL format. The function `fetchWeather()` below deliberately uses a placeholder endpoint, because the lecture does not specify a particular weather service.

### Example implementation

```
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const readlineSync = require("readline-sync");

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

const MODEL = process.env.GEMINI_MODEL;
const MAX_ITERATIONS = 3;

// 1. Fetch weather from your chosen provider.
async function fetchWeather(city, date) {
  const baseUrl = process.env.WEATHER_API;

  if (!baseUrl) {
    throw new Error("WEATHER_API is not configured.");
  }

  // Adapt this URL construction to your provider's API.
  const url = new URL(baseUrl);
  url.searchParams.set("city", city);
  url.searchParams.set("date", date);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Weather API failed with status ${response.status}`
    );
  }

  return await response.json();
}

// 2. Ask Gemini to identify the requested location and date.
async function extractWeatherRequest(question) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `
      Extract the weather request from this question.

      Return only valid JSON in this format:
      {
        "city": "city name",
        "date": "today or YYYY-MM-DD"
      }

      If the question is not a weather question,
      return {"error": "not_weather_request"}.

      User question: ${question}
    `,
  });

  return JSON.parse(response.text);
}

// 3. Ask Gemini to explain the actual weather data.
async function generateWeatherReport(question, weatherData) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `
      Answer the user's weather question using the data below.

      Do not invent weather measurements that are not provided.
      If the data is incomplete, explain the limitation.

      User question:
      ${question}

      Weather data:
      ${JSON.stringify(weatherData)}
    `,
  });

  return response.text;
}

// 4. Run the agent.
async function chatWithAgent() {
  const question = readlineSync.question(
    "How can I help you? "
  );

  try {
    const request = await extractWeatherRequest(question);

    if (request.error === "not_weather_request") {
      console.log("Please ask a weather-related question.");
      return;
    }

    if (
      typeof request.city !== "string" ||
      request.city.trim() === "" ||
      typeof request.date !== "string"
    ) {
      throw new Error("Gemini returned invalid weather details.");
    }

    const weatherData = await fetchWeather(
      request.city,
      request.date
    );

    const report = await generateWeatherReport(
      question,
      weatherData
    );

    console.log("\nWeather report:");
    console.log(report);
  } catch (error) {
    console.error("The agent could not complete the request.");
    console.error(error.message);
  }
}

chatWithAgent();
```

Add a supported model identifier to your `.env` file:

```
API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_model_id
WEATHER_API=your_weather_api_endpoint
```

### What changed compared with the lecture code?

The original version lets Gemini control the workflow by returning either `weather_details_needed: true` or `false`.

The revised version uses a simpler, fixed workflow:

```
Question
   |
   v
Extract city and date
   |
   v
Validate extracted data
   |
   v
Fetch weather
   |
   v
Generate report
   |
   v
Finish
```

This version does not need an infinite loop because the task has a fixed sequence of operations.

The original loop is still valuable to study because more advanced agents may need several tool calls, intermediate decisions, or multiple rounds of reasoning. However, an agent does not need an infinite loop to be an agent.

One limitation remains: `JSON.parse(response.text)` can fail if the model returns invalid JSON. For a more robust implementation, use Gemini's supported structured-output features where appropriate, and validate the resulting fields even when structured output is enabled.

Also, the example's `URL` construction works only if the configured weather endpoint accepts the query parameters `city` and `date`. Adapt it to the provider's documented API.

## 21. The Difference Between This Agent and a Native Tool-Calling Agent

The lecture uses prompt-based tool orchestration.

It tells Gemini to return JSON that represents the next step. Your JavaScript code reads that JSON and decides whether to call the weather function.

This is a useful beginner exercise because it makes the control flow visible.

A more advanced implementation uses native function calling:

1. You define a tool such as `get_weather`.
2. You give the tool's definition to the model.
3. The model can return a structured tool-call request.
4. Your application executes the function.
5. Your application sends the tool result back in the format expected by the model.
6. The model produces a final response or requests another tool.

The major distinction is that the model is not supposed to execute the function itself. The application executes it.

| Prompt-based approach in the lecture      | Native tool calling                                    |
| ----------------------------------------- | ------------------------------------------------------ |
| Model returns JSON following instructions | Model returns a provider-supported tool-call structure |
| Application interprets custom fields      | Application processes the tool-call response           |
| Easy to understand for beginners          | More structured for production workflows               |
| Must handle prompt-format failures        | Still needs validation and error handling              |
| You design the control-flow convention    | SDK provides a standardized tool-calling mechanism     |

Neither approach removes the need for validation, authorization, or error handling.

## 22. How to Build Your Own Agent from This Pattern

Once you understand the weather agent, you can reuse its structure for other projects.

The key is to identify four things:

1. Goal: What does the user want?
2. Decision: What information or action is required?
3. Tool: Which function or external service can do it?
4. Result: How should the model use the tool's output?

For example:

## Three possible agents

[Laser Beams and AI Power the Next Era of Weather Sensing](https://images.openai.com/static-rsc-4/YJavXIxUqOdYa5tbeedsm4NaG_JoEslNXgXU35P3qpCVjNxmdGTaSC7PmvE2z678y-CwBdsa6cJQWKsY6ZEyYzDK2e8NAYyE0g6H-8zURlVKyNLYF52HmcyOvYowh93WWubpP3NosGJQBxxVofgCt98yTOux7LdOSdCU1bLnohs?purpose=inline)

Weather agent

- Goal: Answer a weather question.
- Tool: Weather API.
- Result: A weather report.

[Finding a good business laptop under ₹40,000 was hard until I saw these 10 options| Technology News](https://images.openai.com/static-rsc-4/SGEtV87frv-747LsJEsMXhHY4VXp-8lUUTYciql4rxUGcxtk49m7UZHbyULncRkYDH3g8ooDFT5Ti1nR7tpRNRp_d7z9UDepH6OsGghF9Oqr-znTY7phKwIlgzrjpmF7Odny2ddL82aFdXKTLICSluXSqEJTxKwQo9ewy-r4TPc?purpose=inline)

Code assistant agent

- Goal: Explain or investigate a code issue.
- Tool: A controlled file-reading or code-search function.
- Result: An explanation grounded in the project's files.

[Bravi a Scuola? Il Comune vi paga: al via i contributi per le superiori del paese - Corriere di Maremma](https://images.openai.com/static-rsc-4/w2K7-AxnB-2QusEnDotRRZiiT1-3YPdn08mhQ6TIMaxs7tBhX-mI5oCOoht-m9yCSrV_X5Sp1xc-1dP11lwhzXiwRAbPQDfid4LGmUznNe-cwffWuiCDMSZhvsSlKzVUN5q6BWuP0ZCp7COBD_hfhMbjg_3kEtE0shu4fse49yg?purpose=inline)

Study assistant agent

- Goal: Answer a question from course materials.
- Tool: A document-search function.
- Result: An answer based on relevant course content.

The LLM does not need to know how every tool works internally. It needs a clear description of what the tool does and what inputs it requires. Your code implements the actual operation.

## 23. Common JavaScript Concepts Used in This Project

Use this section as a quick reference when revising the code.

| Code                    | Meaning                                        |
| ----------------------- | ---------------------------------------------- |
| `require("package")`    | Imports a package                              |
| `const x = value`       | Declares a variable that cannot be reassigned  |
| `function name()`       | Defines a function                             |
| `async function`        | Defines an asynchronous function               |
| `await operation()`     | Waits for an asynchronous result               |
| `array.push(value)`     | Adds an item to an array                       |
| `for...of`              | Iterates through an iterable, such as an array |
| `{ city, date }`        | Destructures properties from an object         |
| `process.env.KEY`       | Reads an environment variable                  |
| `fetch(url)`            | Makes an HTTP request                          |
| `response.json()`       | Parses the response body as JSON               |
| `JSON.stringify(value)` | Converts a JavaScript value to JSON text       |
| `JSON.parse(text)`      | Parses JSON text into a JavaScript value       |
| `if (...)`              | Executes code conditionally                    |
| `while (...)`           | Repeats code while a condition is true         |
| `break`                 | Exits the current loop                         |
| `try/catch`             | Handles errors that occur in the `try` block   |

## 24. Interview Questions and Answers

Q1. What is an AI agent?

An AI agent is a software system that uses an AI model to interpret goals, choose actions, use tools, and work toward completing a task.

Q2. What is the difference between an LLM and an AI agent?

An LLM generates or interprets language. An AI agent combines a model with application logic, tools, and a control flow that allows it to perform tasks.

Q3. Why does the weather agent need an API?

Because the LLM's trained knowledge is not a reliable source of current weather measurements. The API provides external weather data.

Q4. Why do we use `@google/genai`?

It is Google's JavaScript SDK for communicating with Gemini models.

Q5. What is the purpose of `dotenv`?

It loads configuration values from a `.env` file into `process.env`.

Q6. What does `async` mean?

It declares an asynchronous function, which can use `await` and returns a Promise.

Q7. Why do we use `await fetch(url)`?

To wait for the HTTP response before processing it.

Q8. What is the difference between `JSON.parse()` and `JSON.stringify()`?

`JSON.parse()` converts JSON text into a JavaScript value. `JSON.stringify()` converts a JavaScript value into JSON text.

Q9. What is the purpose of `chatHistory`?

It stores messages that the application sends to the model so the model can use relevant earlier information.

Q10. Why does the original code use `while (true)`?

It repeats the model–tool–model process until the model returns `weather_details_needed: false`, which triggers `break`.

Q11. Does Gemini execute `getWeather()` itself?

No. Gemini returns structured information describing the requested city and date. JavaScript calls `getWeather()`.

Q12. Why send the weather data back to Gemini?

Because the data is obtained after the initial model request. Gemini needs to receive the result before it can produce a report based on it.

Q13. Why is validating model output necessary?

The model can return malformed JSON, missing fields, incorrect dates, or invalid values. Validation protects the application from using unexpected data.

Q14. What is the difference between an agent tool and an LLM?

The LLM interprets the request and generates language. The tool performs a defined operation, such as fetching weather data.

Q15. Why should the agent have a maximum iteration count?

To prevent repeated tool calls from continuing indefinitely, wasting resources or causing excessive API usage.

Q16. Can an agent use more than one tool?

Yes. For example, a travel agent might use weather, maps, hotel-search, and calendar tools.

Q17. Does every agent need an LLM loop?

No. Some agents follow a fixed workflow, while others need iterative decisions and multiple tool calls.

Q18. What is the main weakness of storing chat history in a global array?

All requests in that process share the same history, and the data disappears when the process stops. A multi-user application needs separate, appropriately managed conversation state.

## 25. Test Your Understanding

## Knowledge check

0 of 5 answered

1\. What actually retrieves the live weather in this project?

Gemini's training data

The JavaScript weather function calling an external API

The chatHistory array

JSON.parse()

2\. What does JSON.parse(answer) do?

Sends a request to Gemini

Converts an object into text

Converts JSON text into a JavaScript value

Fetches weather data

3\. Who executes getWeather() in the lecture code?

Gemini directly

The weather API executes the JavaScript function

Your Node.js program

The JSON parser

4\. Why is weather data added to chatHistory?

To change the API key

To provide the retrieved data to Gemini for the next response

To save it permanently to a database

To stop the loop immediately

5\. What could happen if the model never returns weather_details_needed: false?

The loop automatically stops after one request

The weather API becomes part of Gemini

The loop could continue indefinitely without a limit

JSON.parse() automatically fixes the response

Reset quiz

## 26. Final Revision Summary

Remember the responsibilities of each part:

- Gemini: Understands the question, extracts the requested weather details, and generates the report.
- Prompt: Defines the response format and the instructions for the model.
- JavaScript: Controls the workflow, validates data, calls tools, and decides when to stop.
- `getWeather()`: Fetches weather data from an external service.
- `chatHistory`: Supplies previous messages and retrieved data to Gemini.
- `JSON.parse()`: Converts the model's JSON text into a JavaScript value.
- `while` loop: Repeats the workflow when another model response is needed.
- `break`: Stops the loop when the final-response condition is met.

The key idea is that an AI agent is not merely an LLM with a prompt. It is a complete program that connects an LLM to tools and manages the sequence of actions needed to complete a task.

For further study, consult the official [Gemini API documentation](https://ai.google.dev/gemini-api/docs?utm_source=chatgpt.com) and the [Google Gen AI JavaScript SDK documentation](https://googleapis.github.io/js-genai/?utm_source=chatgpt.com). These are the appropriate references for checking current model IDs, structured output, and native function calling.
