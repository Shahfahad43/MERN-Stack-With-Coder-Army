# Lecture 28: Creating an Application Using an LLM

Generative AI · Backend Development · Frontend Development · Google Gemini API · Node.js · Express.js · Conversation History

## 1. Introduction: How Do We Create an Application Using an LLM?

In the previous lecture, we learned what an LLM is, how it processes text, how it predicts tokens, and how it generates responses.

Now we will take the next step:

How can we integrate an LLM into an actual software application?

Imagine building an AI chatbot where a user can:

- Ask questions.
- Receive AI-generated answers.
- Ask follow-up questions.
- Refer to something discussed earlier.
- Maintain a conversation without repeating the entire context.

For example:

User: Hello, my name is Fahad.

AI: Hello Fahad! How can I help you?

User: I am learning JavaScript.

AI: That's great! What topic are you studying?

User: Explain the difference between `map()` and `filter()`.

The AI should understand that the user is continuing the same conversation.

To build this application, we need more than an LLM. We need a complete application architecture consisting of a frontend, backend, an AI API, and a mechanism for maintaining conversation history.

## 2. Prerequisites for Creating an LLM Application

The basic requirements are:

1. Frontend.
2. Backend.
3. LLM API.
4. API key.
5. Required dependencies and SDK.
6. Conversation-history management.

Let's understand why each component is necessary.

### 2.1 Frontend

The frontend is the part of the application that users interact with.

It provides the interface through which users communicate with the AI.

For an AI chatbot, the frontend might contain:

- A message input field.
- A send button.
- A conversation window.
- User and AI message bubbles.
- Loading indicators.
- Error messages.

Example technologies:

- React.js
- HTML, CSS, JavaScript
- Next.js
- Tailwind CSS

The frontend collects the user's message and sends it to the backend.

### 2.2 Backend

The backend handles the application's server-side operations.

In an LLM application, it acts as the communication layer between the frontend and the AI provider.

Its responsibilities include:

- Receiving messages from the frontend.
- Identifying the user or conversation.
- Retrieving previous conversation history.
- Sending the message and relevant history to the LLM API.
- Receiving the AI-generated response.
- Updating conversation history.
- Returning the response to the frontend.

Example technologies:

- Node.js
- Express.js
- Python
- FastAPI
- Django

### 2.3 Why Can't We Depend Only on the Frontend?

This is an important architectural concept.

Suppose we integrate the Gemini API directly into a React application.

```
const response = await fetch(
  "https://example-ai-api.com",
  {
    headers: {
      Authorization: "Bearer MY_SECRET_API_KEY",
    },
  }
);
```

There is a serious security problem here.

The frontend code runs in the user's browser. Therefore, users can inspect network requests and application code.

If we place our secret API key in the frontend, someone may extract it and use it without our permission.

This can result in:

- Unauthorized API usage.
- Unexpected API costs.
- Exhaustion of API quotas.
- Abuse of our application's API account.

The solution: Keep the secret API key on the backend.

### Frontend–Backend–LLM architecture

Frontend (React.js)

Collects user messages and displays responses.

HTTP request containing user message and conversation ID

Backend (Node.js + Express)

Manages history, authentication, validation, and API calls.

Secure API request using server-side API key

LLM Provider (Google Gemini)

Processes the context and generates an answer.

AI response returns through the backend to the frontend.

Important: The frontend can communicate directly with some AI services in specially designed architectures, but secret credentials must still be protected. A backend is the usual approach for server-side API-key authentication and application-level control.

### 2.4 Responsibilities of Each Layer

| Component | Responsibility                                             |
| --------- | ---------------------------------------------------------- |
| Frontend  | User interface and displaying messages.                    |
| Backend   | Business logic, API communication, and history management. |
| LLM API   | Generating AI responses.                                   |
| Database  | Persisting users and conversations when required.          |

Real-life analogy:

Imagine a restaurant:

- Frontend = Customer placing an order.
- Backend = Waiter receiving and managing the order.
- LLM API = Kitchen preparing the food.
- Database = Restaurant's record system.

The customer does not directly enter the kitchen or access the restaurant's private records.

## 3. Getting a Free Gemini API Key

For this lecture, we are using Google's Gemini API.

Google provides a platform called Google AI Studio, which allows developers to experiment with Gemini models and obtain API keys.

### 3.1 What Is Google AI Studio?

Google AI Studio is a development environment where you can:

- Experiment with different Gemini models.
- Write prompts and test responses.
- Configure model parameters.
- Generate API keys.
- Explore examples and API integration code.

[Building Multimodal AI Application with Gemini 2.0 Pro | DataCamp](https://images.openai.com/static-rsc-4/icvqjoxspZfDUFz7eUWf1fql4UhsTX_IUQhn_ifINe794K4J34AV5yXZ4i7bwETG7gs3CuSw8c43OA61rMyq2XSOAoqdk6-h_9BDmFJSscj0IWYlNyHHrnljOx2Y9sQXCndxr5GdQ1puTgBGl4Y5dHK0zfuXIr6uXJ--wv212vA?purpose=inline)

[Google AI Studio now installable on desktop and mobile as PWA](https://images.openai.com/static-rsc-4/IskFdlzHPt5_bfA-tU7Fq2mE61B0lCovQrelW1PBGK_Gmrjh7DSLX_ZdPlhF9e6gfjnINviW1dlPv8aq0RSMrIZoDruJtDHHcPUPa9X91k-V7VmNUBLgbX46R3uxFRoxsViDVcha2zJT6VppWpzJIf5JoPHwyYClbldv6PRRhuM?purpose=inline)

5

Official website: [Google AI Studio](https://aistudio.google.com/?utm_source=chatgpt.com)

### 3.2 Steps to Obtain an API Key

1. Open Google AI Studio.
2. Sign in with your Google account.
3. Navigate to the API key section.
4. Create a new API key or select an existing eligible key.
5. Copy the generated key.
6. Store it securely on your backend.

Security rule

Never upload your API key to GitHub or place it inside frontend code.

Also, free access is subject to Google's current model availability, usage limits, quotas, and applicable terms. A free API key does not mean unlimited API requests.

### 3.3 What Is an API Key?

An API key is a credential used by an application to identify or authenticate itself when accessing an API.

For example:

```
GEMINI_API_KEY=your_secret_api_key
```

When your backend sends a request to Google's API, the SDK uses this key to authorize the request.

Think of an API key as a key to a private service. Anyone who obtains it may be able to use the associated API access, subject to its permissions and restrictions.

## 4. Getting the Code Structure From Google's Developer Platform

Google provides documentation and code examples for integrating Gemini into different programming languages.

You can use these examples instead of manually writing every API request.

The official developer documentation includes examples for:

- JavaScript / TypeScript.
- Python.
- REST API requests.
- Other supported integration methods.

Official documentation: [Gemini API Developer Documentation](https://ai.google.dev/gemini-api/docs?utm_source=chatgpt.com)

### 4.1 Why Do We Need an SDK?

SDK stands for Software Development Kit.

An SDK provides ready-made tools, functions, and libraries that make it easier to communicate with an external service.

Without an SDK, you may need to handle:

- HTTP requests.
- Authentication headers.
- Request formatting.
- Response parsing.
- Error handling.

With an SDK, many of these operations are handled by the library.

For example, Google's JavaScript SDK provides the `GoogleGenAI` class.

### 4.2 Installing the Required Dependency

For this lecture, we use:

```
npm install @google/genai
```

This installs Google's official JavaScript/TypeScript SDK for the Gemini API.

We also need Express and dotenv for our backend:

```
npm install express dotenv
```

What does each dependency do?

| Dependency      | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `@google/genai` | Communicates with Gemini models.                |
| `express`       | Creates our backend server and API routes.      |
| `dotenv`        | Loads environment variables from a `.env` file. |

## 5. The Biggest Problem: How Does the LLM Remember Previous Messages?

Now we reach one of the most important concepts of this lecture.

Imagine you have created a chatbot using the Gemini API.

You send the following message:

User: My name is Shah Fahad.

AI: Hello Shah Fahad! How can I help you?

Now you send another message:

User: What is my name?

What will happen?

If you send only the latest message to the model, it may not know your name.

Why?

Because an ordinary API request does not automatically have access to every previous request you made.

Remember what we learned in Lecture 27:

An LLM does not automatically remember every conversation. It can use previous information when that information is supplied in its current context or made available through a separate memory mechanism.

### 5.1 Understanding the Problem With an Example

Consider two independent API requests.

First API request

USER

My name is Shah Fahad.

MODEL

Hello Shah Fahad!

Second API request (without history)

USER

What is my name?

MODEL

I don't know your name from the information provided.

The model received the second request without the first conversation.

Therefore, it cannot reliably use the previous information.

### 5.2 The Solution: Maintain Conversation History

The solution is to maintain the conversation history and send the relevant previous messages along with the new message.

Instead of sending only:

```
[
  {
    role: "user",
    parts: [{ text: "What is my name?" }],
  },
]
```

We send:

```
[
  {
    role: "user",
    parts: [
      { text: "Hello, my name is Shah Fahad." },
    ],
  },
  {
    role: "model",
    parts: [
      { text: "Hello Shah Fahad! How can I help you?" },
    ],
  },
  {
    role: "user",
    parts: [
      { text: "What is my name?" },
    ],
  },
]
```

Now the model has access to the earlier information.

It can answer:

```
Your name is Shah Fahad.
```

Core concept: We are not necessarily teaching the model or changing its weights. We are providing it with the conversation context needed to generate the next response.

## 6. Understanding the Conversation History Structure

In the lecture, the following structure is used:

```
const chatHistory = [
  {
    role: "user",
    parts: [
      {
        text: "Hello, mera naam Shah Fahad hai.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Hello Shah Fahad! Main aapki backend aur frontend mein kaise madad kar sakta hoon?",
      },
    ],
  },
  {
    role: "user",
    parts: [
      {
        text: "Tell me the table of 2.",
      },
    ],
  },
];
```

Let's understand every property.

### 6.1 What Is `role`?

The `role` property identifies who sent the message.

In Gemini's `generateContent` conversation format, the common roles are:

| Role    | Meaning                             |
| ------- | ----------------------------------- |
| `user`  | Message sent by the user.           |
| `model` | Response generated by the AI model. |

For example:

```
{
  role: "user",
  parts: [{ text: "What is Node.js?" }],
}
```

This means the user sent the message.

Whereas:

```
{
  role: "model",
  parts: [{ text: "Node.js is a JavaScript runtime." }],
}
```

This means the model generated the response.

Important: Gemini uses `model` for assistant messages in this API format. Other AI providers may use different role names, such as `assistant`.

### 6.2 What Is `parts`?

The `parts` property contains the actual content of a message.

For example:

```
{
  role: "user",
  parts: [
    {
      text: "Explain JavaScript.",
    },
  ],
}
```

Here:

- `role` identifies the sender.
- `parts` contains the message content.
- `text` contains the actual text.

Why use an array for `parts` instead of a simple string?

Because a message can contain multiple types of content, depending on the model and API capabilities.

For example, a message might contain:

- Text.
- Images.
- Audio.
- Video.
- Other supported content parts.

Therefore, `parts` provides a flexible structure for representing multimodal input.

### 6.3 Why Are Messages Stored in an Array?

Because a conversation consists of multiple messages arranged in chronological order.

For example:

```
User: Hello.
AI: Hello!
User: What is JavaScript?
AI: JavaScript is a programming language.
User: Give me an example.
AI: Here is an example...
```

The array preserves the sequence of the conversation.

The order is important because the model uses the previous messages to understand the current request.

### 6.4 How Does the Conversation History Grow?

Suppose we start with an empty array:

```
const History = [];
```

The user sends:

```
Hello!
```

We add the user message:

```
History.push({
  role: "user",
  parts: [{ text: "Hello!" }],
});
```

The AI responds:

```
Hello! How can I help you?
```

We add the model response:

```
History.push({
  role: "model",
  parts: [
    { text: "Hello! How can I help you?" },
  ],
});
```

The history now looks like:

```
[
  {
    role: "user",
    parts: [{ text: "Hello!" }],
  },
  {
    role: "model",
    parts: [
      { text: "Hello! How can I help you?" },
    ],
  },
]
```

The next user message is added to the same array, followed by the model's response.

The conversation keeps growing.

## 7. Which Component Should Maintain Conversation History: Frontend or Backend?

This is an important architectural decision.

There are two possible approaches, but they have different responsibilities and security implications.

### 7.1 Approach A: Maintaining History in the Frontend

In this approach, the frontend stores the previous messages.

For example, using React state:

```
const [messages, setMessages] = useState([]);
```

Whenever the user sends a message, it is added to the state.

```
setMessages((previous) => [
  ...previous,
  {
    role: "user",
    text: message,
  },
]);
```

The frontend can then send the relevant conversation history to the backend.

Advantages:

- Easy to implement.
- The frontend already needs the messages to display the conversation.
- Suitable for simple prototypes.

Disadvantages:

- Users can modify frontend state.
- The client may send fabricated messages or excessive history.
- It is harder to enforce server-side history limits and policies.
- The frontend cannot reliably maintain shared history across devices without persistent storage.

### 7.2 Approach B: Maintaining History in the Backend

In this approach, the backend maintains the conversation history.

The frontend sends only the current message and a conversation identifier.

For example:

```
{
  conversationId: "conversation-123",
  msg: "What did we discuss earlier?"
}
```

The backend uses the conversation ID to retrieve the relevant history.

It then sends that history and the new message to Gemini.

After receiving the response, it updates the history.

Advantages:

- Better control over conversation data.
- Easier to protect API credentials.
- Easier to implement authentication and authorization.
- Easier to apply history limits and summarization.
- Can persist conversations in a database.

### 7.3 Which Approach Is Better?

Recommended for production

Maintain the authoritative conversation history on the backend.

The frontend can also maintain a local copy for displaying messages, but the backend should validate and control the history used for AI requests.

### Recommended architecture

Frontend

Displays messages and sends new user input.

Backend

Authenticates user and identifies conversation.

Database / Conversation storage

Stores and retrieves the conversation history.

Gemini API

Receives context and generates a response.

### 7.4 Important: The Backend Does Not Necessarily Need a Database

For a small demonstration, we can maintain conversation history using a normal JavaScript object.

For example:

```
const chatHistory = {};
```

This is the approach used in your lecture.

But there is an important limitation: data stored in a normal JavaScript object exists only in the running Node.js process.

If the server restarts, the data disappears.

If the application runs on multiple backend instances, each instance may have a different copy of the object.

For production applications, use persistent storage such as MongoDB, PostgreSQL, or Redis, depending on your requirements.

## 8. Managing Long Conversation History

Now imagine a user has been chatting with your AI for several hours.

The conversation contains 1,000 messages.

Should we send all 1,000 messages to Gemini every time the user sends a new question?

Not necessarily.

Remember Lecture 27: models have a limited context window.

Every message sent to the model consumes input tokens, and processing a large conversation can increase latency and API costs.

The solution is to manage conversation history intelligently.

There are two methods mentioned in the lecture.

### 8.1 Method One: Keep the Beginning and the Most Recent Messages

Instead of sending the entire conversation, we can select:

- Some messages from the beginning.
- The most recent messages from the end.

For example, imagine the conversation has 100 messages.

Instead of sending all 100:

```
Messages 1–100
```

We send:

```
Messages 1–5
+
Messages 91–100
```

### History selection

Illustrative example of a 100-message conversation.

Beginning

Keep

1

2

3

4

5

Messages 6–90 omitted

Recent messages

Keep

91

92

93

94

95

96

97

98

99

100

The selected messages are sent as context instead of the entire conversation.

Why keep the beginning?

The beginning may contain important information such as:

- User identity or preferences.
- The purpose of the conversation.
- Initial instructions.
- Important project details.

Why keep the most recent messages?

Recent messages generally contain the immediate context of the user's latest question.

For example:

```
User: I am building a shopping cart in React.

AI: You can use useState.

User: How do I remove an item?

AI: Use filter() to remove it by ID.

User: Show me the code.
```

The latest question depends heavily on the immediately preceding discussion.

Limitation: Keeping the first and last messages can still lose important information from the middle of a conversation.

For example, the user may have shared an important database schema in message 50.

If that message is removed, the AI may no longer know the schema.

### 8.2 Method Two: Summarization of Previous Conversations

This is another useful technique.

Instead of sending all previous messages, we generate a summary of the conversation and send that summary along with the most recent messages.

Suppose the conversation contains:

```
User: I am building an e-commerce application.

AI: Which technology are you using?

User: React for frontend and Node.js for backend.

AI: Which database?

User: MongoDB.

AI: What are the main features?

User: Authentication, product listing, shopping cart, and checkout.

AI: What is your current problem?

User: I am struggling with managing cart state.
```

We can summarize the important information:

```
Conversation Summary:

The user is building an e-commerce application.

Technology stack:
- Frontend: React
- Backend: Node.js
- Database: MongoDB

Main features:
- Authentication
- Product listing
- Shopping cart
- Checkout

Current problem:
The user is struggling with shopping cart state management.
```

Now, instead of sending the entire conversation, we send:

1. The conversation summary.
2. The most recent messages.
3. The latest user question.

The model can use this information to continue the discussion.

### 8.3 How Does Summarization Work?

An LLM can itself summarize the previous conversation.

The workflow is:

Long conversation history

Hundreds of messages.

Send history to summarization model

Ask it to extract important information.

Conversation summary

Important facts, decisions, preferences, and current progress.

New request + summary + recent messages

Generate the next response

### 8.4 Comparison of the Two Methods

| Feature              | Beginning + Recent Messages      | Summarization                           |
| -------------------- | -------------------------------- | --------------------------------------- |
| Implementation       | Relatively simple                | Requires a summarization process        |
| Context preservation | Keeps selected original messages | Preserves information in condensed form |
| Information loss     | Middle messages may be omitted   | Summary may omit important details      |
| Token usage          | Depends on selected messages     | Usually more compact                    |
| Best use             | Shorter conversations            | Long-running conversations              |

### 8.5 Can We Combine Both Methods?

Yes. In production, a hybrid approach is often useful.

For example:

```
System instructions
+
Conversation summary
+
Important original messages
+
Last 10 messages
+
Current user question
```

This provides more continuity without sending the entire conversation every time.

Another option is to retrieve only relevant older messages from a database based on the current question.

Important: History selection and summarization must preserve the correct chronological order and valid message structure. Do not blindly concatenate arbitrary pieces of a conversation.

## 9. Understanding the Complete Code: `index.js`

Now let's understand the code provided in the lecture, line by line.

### 9.1 Folder Structure

A simple project structure can look like this:

```
LLM-Application/
│
├── node_modules/
│
├── .env
├── .gitignore
├── package.json
│
├── index.js
└── aiAgent.js
```

Responsibilities:

| File           | Responsibility                                                  |
| -------------- | --------------------------------------------------------------- |
| `index.js`     | Express server, API route, and conversation history.            |
| `aiAgent.js`   | Gemini SDK initialization and communication with the model.     |
| `.env`         | Stores secret environment variables.                            |
| `.gitignore`   | Prevents sensitive files and dependencies from being committed. |
| `package.json` | Manages dependencies and project configuration.                 |

### 9.2 Code Explanation

Complete original lecture code:

```
const express = require("express");
const main = require("./aiAgent");

const app = express();

app.use(express.json());

// Maintaining the history
const chatHistory = {};

app.post("/chat", async (req, res) => {
  const { id, msg } = req.body;

  // If it is a new user, create history
  if (!chatHistory[id]) {
    chatHistory[id] = [];
  }

  // Getting the history of the user
  const History = chatHistory[id];

  // Giving the prompt
  const promptMsg = [
    ...History,
    {
      role: "user",
      parts: [{ text: msg }],
    },
  ];

  const answer = await main(promptMsg);

  // Storing the user question and model response
  History.push({
    role: "user",
    parts: [{ text: msg }],
  });

  History.push({
    role: "model",
    parts: [{ text: answer }],
  });

  res.send(answer);
});

app.listen(3000, () => {
  console.log("App is listening at 3000!");
});
```

### 9.3 Understanding Each Line

1\. Importing Express

```
const express = require("express");
```

We import Express to create our backend server.

Express helps us define API routes and handle HTTP requests.

2\. Importing the AI function

```
const main = require("./aiAgent");
```

We import the `main()` function from `aiAgent.js`.

This function is responsible for communicating with Gemini.

We separate the AI-related logic from the server logic to keep our code organized.

3\. Creating the Express application

```
const app = express();
```

This creates an Express application instance.

We use `app` to configure middleware, define routes, and start the server.

4\. Understanding `express.json()`

```
app.use(express.json());
```

This is middleware that parses incoming JSON request bodies.

Suppose the frontend sends:

```
{
  "id": "user-123",
  "msg": "What is JavaScript?"
}
```

Express converts the JSON request body into a JavaScript object that we can access through:

```
req.body
```

Without JSON-parsing middleware, `req.body` may be undefined for JSON requests.

5\. Creating conversation storage

```
const chatHistory = {};
```

We create an empty JavaScript object to maintain conversation history.

We use the user's ID as the key and an array of messages as its value.

For example:

```
const chatHistory = {
  "user-123": [
    {
      role: "user",
      parts: [{ text: "Hello!" }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! How can I help?" }],
    },
  ],

  "user-456": [
    {
      role: "user",
      parts: [{ text: "What is React?" }],
    },
  ],
};
```

This means each user has a separate conversation history.

### How the JavaScript object stores history

chatHistory

JavaScript object

user-123

History A

User and model messages.

user-456

History B

User and model messages.

Important: In the lecture, the variable is called `id`, but conceptually it is identifying the conversation or user. In a real application, these should usually be separate identifiers:

- `userId`: Identifies the authenticated user.
- `conversationId`: Identifies a particular conversation belonging to that user.

One user may have several conversations.

6\. Creating the POST route

```
app.post("/chat", async (req, res) => {
```

We create a POST endpoint called `/chat`.

Why POST?

Because the frontend is sending data to the backend, specifically the user's message and conversation identifier.

The `async` keyword allows us to use `await` inside the route.

7\. Extracting the request body

```
const { id, msg } = req.body;
```

This is JavaScript destructuring.

Suppose:

```
req.body = {
  id: "user-123",
  msg: "Explain Node.js",
};
```

Then:

```
id = "user-123";
msg = "Explain Node.js";
```

8\. Creating history for a new user

```
if (!chatHistory[id]) {
  chatHistory[id] = [];
}
```

We check whether the user already has a history.

If not, we create an empty array.

For example:

```
chatHistory["user-123"] = [];
```

This prevents us from trying to access or modify an undefined history.

9\. Getting the user's history

```
const History = chatHistory[id];
```

We retrieve the array belonging to the particular user.

An important JavaScript concept is involved here:

`History` references the same array stored inside `chatHistory[id]`.

It is not an independent copy.

Therefore:

```
History.push(...)
```

also modifies:

```
chatHistory[id]
```

This is possible because arrays and objects are reference types in JavaScript.

10\. Preparing the prompt

```
const promptMsg = [
  ...History,
  {
    role: "user",
    parts: [{ text: msg }],
  },
];
```

This is one of the most important lines in the entire implementation.

We create a new array containing:

1. All previous messages.
2. The latest user message.

The spread operator (`...`) expands the existing history into the new array.

Example:

```
History = [
  {
    role: "user",
    parts: [{ text: "My name is Fahad." }],
  },
  {
    role: "model",
    parts: [{ text: "Hello Fahad!" }],
  },
];
```

New message:

```
msg = "What is my name?";
```

The resulting `promptMsg` becomes:

```
[
  {
    role: "user",
    parts: [{ text: "My name is Fahad." }],
  },
  {
    role: "model",
    parts: [{ text: "Hello Fahad!" }],
  },
  {
    role: "user",
    parts: [{ text: "What is my name?" }],
  },
]
```

Why use `...History` instead of simply passing `History`?

Because we want a new array containing the previous messages and the latest message.

We do not want to add the latest message to the stored history before the API call in this particular implementation.

This also means the history is not modified by the construction of `promptMsg`.

11\. Calling the Gemini API

```
const answer = await main(promptMsg);
```

We send the complete conversation context to the `main()` function.

The function communicates with Gemini and returns the generated answer.

The `await` keyword waits until the asynchronous API operation completes.

12\. Updating conversation history

```
History.push({
  role: "user",
  parts: [{ text: msg }],
});

History.push({
  role: "model",
  parts: [{ text: answer }],
});
```

Once the model responds, we store both messages:

- The latest user message.
- The model's response.

This ensures the next request will have the complete conversation history.

Why do we store both?

Because the model needs to know what the user asked and what it answered. Otherwise, the conversation would lose its sequence and meaning.

13\. Sending the response

```
res.send(answer);
```

We return the AI-generated answer to the frontend.

The frontend can then display it inside the chat interface.

14\. Starting the server

```
app.listen(3000, () => {
  console.log("App is listening at 3000!");
});
```

This starts our Express server on port `3000`.

Our endpoint is now available at:

```
POST http://localhost:3000/chat
```

## 10. Understanding the AI Logic: `aiAgent.js`

Now let's examine the second file.

```
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main(msg) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: msg,
  });

  return response.text;
}

module.exports = main;
```

### 10.1 Loading Environment Variables

```
require("dotenv").config();
```

This loads environment variables from the `.env` file into `process.env`.

For example, our `.env` file contains:

```
GEMINI_API_KEY=your_secret_api_key
```

After loading dotenv, we can access the key using:

```
process.env.GEMINI_API_KEY
```

Why do we use environment variables?

Because we should not hardcode secret API credentials inside our source code.

### 10.2 Importing Google's SDK

```
const { GoogleGenAI } = require("@google/genai");
```

We import the `GoogleGenAI` class from the installed SDK.

This class provides methods for communicating with Gemini.

### 10.3 Creating the Gemini Client

```
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

We initialize the SDK client using our API key.

The `ai` object now provides access to the SDK's supported API methods.

### 10.4 Creating the Main Function

```
async function main(msg) {
```

We define an asynchronous function that accepts the conversation history.

The parameter `msg` contains an array of messages in Gemini's content format.

For example:

```
[
  {
    role: "user",
    parts: [{ text: "Hello!" }],
  },
  {
    role: "model",
    parts: [{ text: "Hello! How can I help?" }],
  },
  {
    role: "user",
    parts: [{ text: "Explain React." }],
  },
]
```

### 10.5 Calling `generateContent()`

```
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: msg,
});
```

This is where the actual API call happens.

Let's understand its properties:

| Property   | Purpose                                                    |
| ---------- | ---------------------------------------------------------- |
| `model`    | Specifies which Gemini model should generate the response. |
| `contents` | Contains the input message or conversation history.        |

Important correction about the model name: `gemini-3.5-flash` is the model identifier written in your lecture code, but model identifiers change over time and must exist in the API's available model list. Do not assume this particular identifier is valid. Use a currently supported model ID from the official documentation or AI Studio.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://ai.google.dev&sz=32)

Google AI for Developers+1

### 10.6 Returning the AI Response

```
return response.text;
```

The SDK returns a response object.

The `.text` property provides the generated text, which we return to `index.js`.

### 10.7 Exporting the Function

```
module.exports = main;
```

This exports the function so that another file can import and use it.

In `index.js`, we already wrote:

```
const main = require("./aiAgent");
```

This is an example of modular programming in Node.js.

## 11. Important Question: Should We Use the Same Model for Maintaining and Answering History?

The lecture suggests using the same model for processing the conversation history and generating the response.

For example:

- If we are using Google's Gemini API, we use a Gemini model.
- If we are using OpenAI's API, we use an OpenAI model.

Let's understand the reasoning.

### 11.1 Why Use the Same Provider?

The history format and API interface may differ between providers.

For example, Gemini commonly represents messages like this:

```
{
  role: "user",
  parts: [{ text: "Hello!" }],
}
```

Whereas other providers may use a structure such as:

```
{
  role: "user",
  content: "Hello!",
}
```

Therefore, we need to format the conversation according to the API we are using.

### 11.2 Do We Have to Use the Exact Same Model?

Not necessarily.

You can technically use one model to summarize a conversation and another model to answer the next question.

For example:

```
Gemini model A:
Summarizes the previous conversation.

Gemini model B:
Uses the summary and recent messages to answer the user.
```

However, using the same model and provider for a conversation can make behavior and formatting more consistent.

The actual requirement is compatibility with the API's expected conversation format, not necessarily the same exact model for every operation.

## 12. Complete Request and Response Flow

Let's connect everything we have learned.

Suppose the user sends:

```
{
  "id": "user-123",
  "msg": "My name is Fahad."
}
```

### First request

### First request

Frontend sends

`id = user-123`

`msg = My name is Fahad.`

Backend checks history

`chatHistory["user-123"]` does not exist.

Create new history

`chatHistory["user-123"] = []`

Send prompt to Gemini

User: My name is Fahad.

Gemini responds

Hello Fahad!

Update history

User message + model response.

The history now contains:

```
chatHistory["user-123"] = [
  {
    role: "user",
    parts: [{ text: "My name is Fahad." }],
  },
  {
    role: "model",
    parts: [{ text: "Hello Fahad!" }],
  },
];
```

### Second request

The user now sends:

```
{
  "id": "user-123",
  "msg": "What is my name?"
}
```

The backend finds the existing history and prepares:

```
const promptMsg = [
  ...chatHistory["user-123"],
  {
    role: "user",
    parts: [{ text: "What is my name?" }],
  },
];
```

Gemini receives both the previous conversation and the new question.

It can now answer:

```
Your name is Fahad.
```

The backend stores this new exchange as well.

The important point: The backend retrieves the previous messages and sends them again as context. The model does not automatically retrieve them from the previous HTTP request.

## 13. Problems in the Lecture Code and How to Improve It

The original code is useful for understanding the fundamentals, but it is a demonstration rather than production-ready code.

There are several important problems to understand.

### 13.1 Problem: Conversation History Is Lost When the Server Restarts

```
const chatHistory = {};
```

This object exists only in the memory of the running Node.js process.

Suppose:

1. User sends 20 messages.
2. The server stores them in `chatHistory`.
3. The server restarts.
4. The JavaScript process is recreated.

The object becomes empty again.

All previous conversations are lost.

Solution: Store history in a persistent database.

For example:

- MongoDB: Store conversations as documents or messages in collections.
- PostgreSQL: Store users, conversations, and messages in relational tables.
- Redis: Store temporary conversation state with expiration.

### 13.2 Problem: Every Backend Instance Has Its Own History

Imagine your application has two Node.js servers.

```
                 Frontend
                    |
              Load Balancer
                /       \
               /         \
          Server A     Server B
          History A    History B
```

A user's first request may go to Server A.

The second request may go to Server B.

Server B does not automatically have the history stored in Server A's JavaScript object.

Solution: Use shared storage such as Redis or a database.

### 13.3 Problem: No Validation of User Input

The original code directly accepts:

```
const { id, msg } = req.body;
```

But what if the frontend sends:

```
{
  "id": "",
  "msg": ""
}
```

Or:

```
{
  "id": "user-123",
  "msg": 12345
}
```

The backend should validate the input before processing it.

For example:

```
if (
  typeof id !== "string" ||
  typeof msg !== "string" ||
  !id.trim() ||
  !msg.trim()
) {
  return res.status(400).json({
    error: "Valid id and message are required.",
  });
}
```

### 13.4 Problem: Anyone Can Pretend to Be Another User

In the lecture:

```
const { id, msg } = req.body;
```

The backend trusts the ID sent by the frontend.

But a malicious user could change the ID and attempt to access another person's history.

For example:

```
{
  "id": "another-users-id",
  "msg": "Show me the previous conversation."
}
```

This is an authorization vulnerability.

Solution: In a real application, authenticate the user and obtain their identity from a verified server-side authentication mechanism. Do not trust an arbitrary user ID supplied in the request body.

### 13.5 Problem: No Error Handling

The original code calls:

```
const answer = await main(promptMsg);
```

But what if:

- The API key is invalid?
- The Gemini API is unavailable?
- The model identifier is incorrect?
- The user exceeds the API quota?
- The network connection fails?

The request may fail, and the server could return an unhandled error.

Use `try...catch`:

```
try {
  const answer = await main(promptMsg);

  // Continue processing.
} catch (error) {
  console.error("AI API error:", error);

  return res.status(502).json({
    error: "Unable to generate a response.",
  });
}
```

### 13.6 Problem: Concurrent Requests Can Corrupt Conversation Order

Imagine a user sends two messages very quickly:

```
Message A: Explain React.

Message B: Explain Redux.
```

Both requests may read the same history before either one finishes.

The AI responses might arrive in the wrong order or one request might overwrite the intended conversation sequence.

For production systems, serialize requests per conversation or implement appropriate locking and ordering mechanisms.

### 13.7 Problem: Conversation History Can Grow Without Limits

Every new exchange adds two more messages.

```
History.push(userMessage);
History.push(modelResponse);
```

If a user sends 1,000 messages, the array keeps growing.

Sending all of it on every request can increase:

- Token consumption.
- API costs.
- Response latency.
- Memory usage.

Solution: Apply the history-management strategies discussed earlier:

- Limit recent messages.
- Summarize older messages.
- Retrieve relevant historical messages.
- Use supported context-caching mechanisms when appropriate.

## 14. Improved Version of the Lecture Project

Here is a slightly improved version that retains the original architecture but introduces validation, error handling, a configurable model, and a response-size limit.

This is still an educational, single-process implementation. It does not solve persistent storage, authentication, or multi-server synchronization.

### 14.1 Project structure

```
LLM-Application/
│
├── .env
├── .gitignore
├── package.json
│
├── index.js
└── aiAgent.js
```

`.env`

```
GEMINI_API_KEY=your_secret_api_key
GEMINI_MODEL=your_current_supported_model
PORT=3000
```

`.gitignore`

```
node_modules/
.env
```

`aiAgent.js`

```
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main(contents) {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents,
  });

  return response.text;
}

module.exports = main;
```

`index.js`

```
require("dotenv").config();

const express = require("express");
const main = require("./aiAgent");

const app = express();

app.use(express.json({ limit: "20kb" }));

// Temporary in-memory conversation storage.
const chatHistory = {};

const MAX_MESSAGES = 20;

app.post("/chat", async (req, res) => {
  try {
    const { id, msg } = req.body;

    // Validate the request.
    if (
      typeof id !== "string" ||
      typeof msg !== "string" ||
      !id.trim() ||
      !msg.trim()
    ) {
      return res.status(400).json({
        error: "Valid id and message are required.",
      });
    }

    // Create history for a new conversation.
    if (!chatHistory[id]) {
      chatHistory[id] = [];
    }

    const history = chatHistory[id];

    // Select recent messages.
    const recentHistory = history.slice(-MAX_MESSAGES);

    // Prepare the conversation context.
    const promptMsg = [
      ...recentHistory,
      {
        role: "user",
        parts: [{ text: msg }],
      },
    ];

    // Generate the AI response.
    const answer = await main(promptMsg);

    if (!answer) {
      throw new Error("Empty response from AI model.");
    }

    // Save the user message.
    history.push({
      role: "user",
      parts: [{ text: msg }],
    });

    // Save the model response.
    history.push({
      role: "model",
      parts: [{ text: answer }],
    });

    // Keep history within the configured limit.
    if (history.length > MAX_MESSAGES) {
      history.splice(
        0,
        history.length - MAX_MESSAGES
      );
    }

    return res.json({
      answer,
    });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(502).json({
      error: "Unable to process your request.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}!`);
});
```

### 14.2 What Did We Improve?

| Improvement                  | Why?                                              |
| ---------------------------- | ------------------------------------------------- |
| Environment-based model name | Model IDs can change or become unavailable.       |
| Input validation             | Prevents invalid request data.                    |
| `try...catch`                | Handles API and server errors.                    |
| Limited JSON body size       | Reduces excessively large request bodies.         |
| Recent history selection     | Prevents unlimited conversation growth.           |
| JSON response                | Provides a structured API response.               |
| `.gitignore`                 | Prevents accidental API-key exposure through Git. |

Important limitation of this example: Keeping only the last 20 messages does not preserve information from the beginning of a conversation. If the user mentioned their name in the first message and that message is later removed, the model may forget it.

A conversation summary or persistent memory mechanism can preserve selected important details.

Also, `MAX_MESSAGES` should ideally represent complete user/model exchanges. The example uses an even number and assumes successful alternating messages.

## 15. An Alternative: Using Gemini's Built-in Chat Session

The lecture manually maintains conversation history using:

```
const chatHistory = {};
```

However, the Gemini SDK also provides a chat interface.

For example:

```
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chat = ai.chats.create({
  model: process.env.GEMINI_MODEL,
  history: [],
});

async function main(message) {
  const response = await chat.sendMessage({
    message,
  });

  return response.text;
}
```

The SDK's chat session maintains conversation turns and supplies the relevant history when sending subsequent messages.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://ai.google.dev&sz=32)

Google AI for Developers+1

But there is an important difference:

A chat session object is not automatically a persistent database.

If you restart the server or lose the session object, its in-memory history is lost unless you save and restore that history separately.

For applications with multiple users, you must also maintain separate chat sessions and ensure that each session belongs to the correct authenticated user.

The manual approach from the lecture is valuable because it teaches you exactly how conversation history works behind the scenes.

## 16. Understanding the Database Structure for a Real Application

When moving from a prototype to a production application, we should separate users, conversations, and messages.

For example, in MongoDB, we might have three collections.

### Users Collection

```
{
  _id: "user-123",
  name: "Shah Fahad",
  email: "fahad@example.com"
}
```

### Conversations Collection

```
{
  _id: "conversation-001",
  userId: "user-123",
  title: "Learning JavaScript",
  createdAt: "2026-10-31"
}
```

### Messages Collection

```
{
  conversationId: "conversation-001",
  role: "user",
  content: "What is JavaScript?",
  createdAt: "2026-10-31"
}
```

Another message:

```
{
  conversationId: "conversation-001",
  role: "model",
  content: "JavaScript is a programming language.",
  createdAt: "2026-10-31"
}
```

### Why Separate These Collections?

Because one user can have multiple conversations, and one conversation can have multiple messages.

### Database relationship

Users

One user

Conversations

One user can have many conversations.

Messages

One conversation can have many messages.

This design allows us to:

- Display all conversations belonging to a user.
- Open a particular conversation.
- Retrieve its messages.
- Delete a particular conversation.
- Continue an earlier conversation.
- Generate summaries for long conversations.

For a large application, storing individual messages separately can also make pagination and retrieval more manageable.

## 17. Testing the Application Using Postman

Once our backend is running, we need to test whether the API works correctly.

We can use Postman.

Start the server:

```
node index.js
```

Our API endpoint is:

```
POST http://localhost:3000/chat
```

### First request

Postman request

POST

`http://localhost:3000/chat`

Request body → raw → JSON

```
{
  "id": "user-123",
  "msg": "My name is Fahad."
}
```

Expected response

```
{
  "answer": "Hello Fahad! How can I help you?"
}
```

### Second request

Use the same conversation ID:

```
{
  "id": "user-123",
  "msg": "What is my name?"
}
```

Expected response:

```
{
  "answer": "Your name is Fahad."
}
```

### Third request: Test conversation isolation

Now use another ID:

```
{
  "id": "user-456",
  "msg": "What is my name?"
}
```

This user has a separate history.

The model should not know that the first user introduced himself as Fahad.

This demonstrates why maintaining separate conversation histories is important.

Testing tip: Use the same ID to continue a conversation and a different ID to create an independent conversation.

## 18. Interview Questions and Answers

### Beginner Level

Q1. What are the basic requirements for building an LLM-powered application?

A frontend, backend, LLM API, API credentials, an SDK or API integration, and a mechanism for managing conversation context.

Q2. Why do we need a backend when integrating an LLM API?

To protect secret API credentials, handle business logic, manage conversation history, authenticate users, and communicate securely with the AI provider.

Q3. What is an SDK?

A Software Development Kit provides libraries and tools that simplify integration with a service or platform.

Q4. What is Google AI Studio?

It is Google's development environment for experimenting with Gemini models and managing Gemini API keys.

Q5. What is the purpose of `@google/genai`?

It is Google's JavaScript/TypeScript SDK for communicating with Gemini models.

Q6. Why does an LLM need conversation history?

Because separate API requests do not automatically share previous conversation context. Supplying relevant history allows the model to understand follow-up questions.

### Intermediate Level

Q7. What is the difference between `user` and `model` roles in Gemini?

`user` identifies a user message, while `model` identifies a message generated by the AI.

Q8. What is the purpose of the `parts` property?

It contains message content, which can include text and other supported content types.

Q9. Why do we use a JavaScript object to maintain history?

It allows us to associate each user or conversation identifier with its own message array using key-value pairs.

Q10. What does the spread operator do in the following code?

```
const promptMsg = [
  ...History,
  newMessage,
];
```

It copies the elements of the existing history array into a new array and appends the new message.

Q11. Why do we store both user and model messages?

To preserve the complete conversation sequence so the model can understand both the user's previous questions and its previous responses.

Q12. Who should maintain conversation history: frontend or backend?

For production applications, the backend should maintain authoritative history. The frontend can maintain a local copy for displaying the conversation.

Q13. What is the difference between conversation history and model training?

Conversation history supplies contextual information during inference. Model training adjusts the model's parameters.

Q14. Why should we not use an in-memory JavaScript object for production conversation storage?

It loses data on server restarts and is not automatically shared across multiple server instances.

### Advanced Level

Q15. How can we manage long conversations without sending all messages?

Use recent-message selection, summarization, retrieval of relevant historical messages, or a hybrid approach.

Q16. What is conversation summarization?

It is the process of condensing previous messages into a smaller representation containing important information, which can be supplied to the model as context.

Q17. What is the difference between a user ID and a conversation ID?

A user ID identifies a person or account. A conversation ID identifies a particular conversation belonging to that user.

Q18. What happens if two requests arrive simultaneously for the same conversation?

They may read the same previous history and produce responses that are processed out of order. Appropriate request serialization or concurrency control is required.

Q19. Can we use one model to summarize history and another model to answer questions?

Yes. The summarization model and response-generation model do not have to be identical, provided the resulting context is compatible with the receiving model.

Q20. What is the purpose of the Gemini chat session?

It provides an SDK-managed interface for sending messages with conversation context without manually constructing the full history on every call.

Q21. Why do we need a database if the SDK can maintain chat history?

The SDK session's in-memory history is not a replacement for durable storage. A database allows conversations to survive restarts and be retrieved across devices and server instances.

Q22. What is the purpose of `dotenv`?

It loads environment variables from a `.env` file into `process.env`, allowing us to configure sensitive credentials outside the source code.

## 19. Practical Exercises

Try these exercises to make sure you understand the concepts rather than simply memorizing the code.

Test your understanding

0/5 answered

1\. Why should we keep the Gemini API key on the backend?

Because the frontend cannot send HTTP requests.

Because frontend code and network requests can expose secret credentials.

Because Gemini only works with Node.js.

2\. What happens if we send only the latest user message to a stateless generateContent request?

Gemini automatically retrieves every previous message.

Gemini retrains itself.

Earlier context is unavailable unless supplied separately.

3\. Why do we store both user and model messages?

To preserve the conversation sequence.

To increase the model's parameter count.

To avoid tokenization.

4\. What is the major limitation of const chatHistory = {}?

It cannot store arrays.

It is lost when the process restarts and is not shared automatically across servers.

It cannot use string keys.

5\. Which strategy can reduce the context sent for a long conversation?

Send every message forever.

Delete all model responses.

Summarize older messages and retain relevant recent context.

Check answersReset

## 20. Final Revision Summary

| Concept              | What to remember                                                |
| -------------------- | --------------------------------------------------------------- |
| Frontend             | Collects user messages and displays AI responses.               |
| Backend              | Handles requests, history, authentication, and AI API calls.    |
| Google AI Studio     | Provides access to Gemini experimentation and API keys.         |
| API Key              | Authenticates API requests; must be protected.                  |
| `@google/genai`      | Google's JavaScript SDK for Gemini.                             |
| `dotenv`             | Loads environment variables.                                    |
| `express.json()`     | Parses incoming JSON request bodies.                            |
| Conversation history | Previous user and model messages supplied as context.           |
| `role`               | Identifies the sender (`user` or `model`).                      |
| `parts`              | Contains the message content.                                   |
| `chatHistory = {}`   | Stores separate histories using object keys.                    |
| Spread operator      | Copies previous history elements into a new array.              |
| Summarization        | Compresses older conversations into useful context.             |
| Persistent database  | Stores conversations beyond the lifetime of the server process. |
| Context window       | Limits the amount of context the model can process.             |

### The Complete Application Architecture

## How an LLM-powered application works

1. User sends a message

   The frontend collects the user's input.

2. Backend receives the request

   Express processes the HTTP request and validates the data.

3. Identify the conversation

   The backend authenticates the user and retrieves the appropriate conversation history.

4. Prepare the context

   Select recent messages, summaries, and relevant historical information.

5. Call the LLM API

   Send the prepared context using the backend's API credentials.

6. Receive the response

   Gemini generates the answer and returns it to the backend.

7. Update conversation history

   Store the user's message and the model's response.

8. Return the answer

   The frontend displays the AI-generated response.

The most important lesson from Lecture 28: Integrating an LLM into an application is not just about calling an API. The real engineering challenge is managing communication between the frontend, backend, AI provider, and conversation storage while maintaining security, context, and scalability.

## 21. Official Documentation

Use these resources when implementing the project, especially because SDK methods and model identifiers can change.

1. Google AI Studio — [Get an API key](https://aistudio.google.com/?utm_source=chatgpt.com).
2. Gemini API Documentation — [Official API documentation](https://ai.google.dev/gemini-api/docs?utm_source=chatgpt.com).
3. @google/genai — [JavaScript SDK reference](https://googleapis.github.io/js-genai/?utm_source=chatgpt.com).
4. [Gemini API pricing and free-tier information](https://ai.google.dev/gemini-api/docs/pricing?utm_source=chatgpt.com) — Check model availability, quotas, and usage limits.&#x20;

   [image](https://www.google.com/s2/favicons?domain=https://aistudio.google.com&sz=32)

   Google AI Studio+1
