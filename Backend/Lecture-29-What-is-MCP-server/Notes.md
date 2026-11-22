# **Lecture 29: What Is MCP Server?**

## **1. What is MCP?**

**MCP stands for Model Context Protocol.**

MCP is an open standard that allows AI applications to connect with external tools, data sources, and services in a consistent way.

Think of MCP as a **bridge between an AI application and external resources**.

For example, an AI assistant may need to:

- Get current weather information.
- Search the internet.
- Read files from your computer.
- Query a database.
- Interact with another application.

An LLM alone cannot automatically perform all these tasks. It needs access to external tools or services. MCP provides a standardized way for applications to make those connections.

**Official documentation:** [Model Context Protocol – Introduction](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro?utm_source=chatgpt.com)

## **2. What Does Providing Context to an LLM Mean?**

First, understand the word **context**.

Context means the relevant information that helps an LLM understand what the user is talking about and produce a suitable answer.

Imagine this conversation:

**User:** What is the capital of Pakistan?

**AI:** The capital of Pakistan is Islamabad.

**User:** What is its population?

**AI:** Islamabad has a population of ...

In the second question, the user says **"its"** instead of repeating "Islamabad."

How does the LLM understand what "its" refers to?

Because the application provides relevant previous conversation messages as context.

### **What can context contain?**

1. **Current message:** What the user is asking right now.
2. **Previous messages:** Earlier questions and answers that help understand the current question.
3. **System instructions:** Rules that guide how the model should respond.
4. **External information:** Data retrieved from APIs, databases, files, or other tools.

For example:

```
const chatHistory = [
  {
    role: "user",
    parts: [{ text: "What is the capital of Pakistan?" }]
  },
  {
    role: "model",
    parts: [{ text: "Islamabad." }]
  },
  {
    role: "user",
    parts: [{ text: "What is its population?" }]
  }
];
```

When the application sends this history to the model, the model can understand the conversation instead of treating every question as a completely new one.

**Important:** Context does not necessarily mean sending every conversation the user has ever had. Applications decide which relevant information to provide, depending on their memory and context-management systems.

## **3. How Does ChatGPT Answer Questions About Live Information?**

This is an important question.

Suppose you ask:

> What is the weather in Pakistan right now?

You might think:

- The LLM was trained on a large amount of data.
- But weather changes every minute.
- Its training data cannot contain the current weather.
- So how can it answer?

The answer is that **the AI application can retrieve fresh information from an external source while answering your question.**

Let's understand the process.

### **Step 1: User asks a question**

```
User:
What is the weather in Islamabad right now?
```

### **Step 2: The LLM understands the request**

The model identifies that the user wants current weather information.

It may interpret the request as:

```
{
  "intent": "get_weather",
  "location": "Islamabad",
  "date": "today"
}
```

This is an example of structured intent and data.

- `intent`: What action or information is needed?
- `location`: Where is the weather required?
- `date`: For which date?

### **Step 3: The application calls an external tool**

The application uses the extracted information to call a weather API.

For example:

```
AI Application
      |
      v
Weather API
      |
      v
Current weather data
```

The weather API might return:

```
{
  "city": "Islamabad",
  "temperature": 25,
  "condition": "Cloudy",
  "humidity": 60
}
```

This information comes from the external weather service, not from the LLM's training data.

### **Step 4: The application provides the result to the LLM**

The application sends the retrieved weather information back to the model.

Now the model has:

- The original user question.
- The relevant conversation history.
- The latest weather information.

### **Step 5: The LLM generates the final answer**

The LLM converts the retrieved data into understandable language.

For example:

```
The current weather in Islamabad is cloudy,
with a temperature of 25°C and humidity of 60%.
```

**Complete process**

**1. User asks a question**

"What is the weather in Islamabad?"

**2. LLM understands the intent**

Intent: get_weather, Location: Islamabad

**3. Application calls weather API**

Requests current weather data

**4. Weather API returns data**

Temperature, condition, humidity, etc.

**5. LLM generates the final response**

A natural-language weather report

This is the basic idea behind connecting an LLM to external tools.

## **4. What Is Intent in an AI Application?**

**Intent means the purpose behind the user's message.**

In simple words:

> What does the user actually want to do?

Consider these examples:

| User's message                   | Identified intent |
| -------------------------------- | ----------------- |
| What is the weather in Pakistan? | `get_weather`     |
| Search for React tutorials       | `search_web`      |
| Calculate 50 × 20                | `calculate`       |
| Find my PDF file                 | `search_files`    |
| Send an email to Ahmad           | `send_email`      |

The application can extract the intent and relevant data from the user's message.

### **Example: Intent and data extraction**

User asks:

```
Tell me the weather in Islamabad today.
```

The model may produce:

```
{
  "intent": "get_weather",
  "data": {
    "city": "Islamabad",
    "date": "today"
  }
}
```

The application can now understand:

- What operation is required? `get_weather`
- Which city? `Islamabad`
- Which date? `today`

**Important correction to your lecture hint:** You mentioned that one LLM might debug the message and send it to another LLM as intent and data.

This is one possible architecture, but it is not a requirement of MCP.

Usually, one LLM can understand the request and generate a structured tool call. The application then executes that tool. A second LLM is not necessary.

Also, the word you are looking for is probably **interpret or analyze**, rather than debug.

## **5. So, Where Does MCP Come Into This Process?**

Now we reach the main purpose of this lecture.

In the previous weather example, the application directly called a weather API.

But imagine you are developing an AI assistant that needs access to 20 different services:

- Weather API
- Google Drive
- Database
- File system
- GitHub
- Search engine
- Email service

If every AI application implements a different integration for every service, managing these connections becomes difficult.

This is where MCP becomes useful.

**MCP provides a standardized way for AI applications to communicate with external tools and context sources.**

Instead of every AI application implementing a completely different integration, MCP provides a common protocol.

### **Understanding MCP architecture**

MCP has three main components:

**1. MCP Host**

The AI application, such as an AI assistant or IDE.

Example: An application that uses an LLM

Communication through MCP

**2. MCP Client**

Manages communication between the host and an MCP server.

MCP protocol

**3. MCP Server**

Provides access to external tools, resources, or prompts.

Example: Weather server, database server, file server

**External Services and Data**

Weather APIs, databases, files, GitHub, etc.

Let's understand each component.

### **5.1 MCP Host**

The **Host** is the AI application that the user interacts with.

Examples:

- ChatGPT
- Claude Desktop
- An AI-powered code editor

The host manages the overall AI experience and can manage one or more MCP clients.

### **5.2 MCP Client**

The **Client** is responsible for communicating with an MCP server.

For example:

Your AI application wants to access weather information. The MCP client communicates with the weather MCP server to discover and call its available tools.

### **5.3 MCP Server**

An **MCP Server** exposes capabilities to an AI application through the MCP protocol.

For example, a weather MCP server might provide a tool called:

```
get_weather(city, date)
```

The AI application can discover that tool and request its execution.

The MCP server then communicates with the actual weather API and returns the result.

**Remember:** An MCP server does not necessarily contain an LLM. It can simply be a program that exposes tools and communicates with external services.

## **6. What Does an MCP Server Provide?**

MCP defines three important server capabilities:

| Capability | Meaning                                 | Example                 |
| ---------- | --------------------------------------- | ----------------------- |
| Tools      | Actions that the AI can execute         | Get weather, send email |
| Resources  | Data that the AI application can access | Files, database records |
| Prompts    | Reusable prompt templates               | A code-review prompt    |

### **Tools**

Tools allow the AI application to perform actions.

Example:

```
{
  name: "get_weather",
  description: "Get current weather for a city",
  inputSchema: {
    city: "string"
  }
}
```

The application can use this tool to retrieve weather information.

### **Resources**

Resources provide information that an AI application can read.

Examples:

- A document
- A database record
- A file
- Information from another data source

### **Prompts**

Prompts are reusable templates that help applications perform particular tasks.

For example, an MCP server could provide a reusable code-review prompt.

## **7. Weather Example: Direct API vs MCP**

Let's compare the two approaches.

**Without MCP**

AI Application

Weather API integration written specifically for the application

Weather API

**With MCP**

AI Application

MCP Client

Weather MCP Server

Weather API

The important difference is that MCP standardizes communication between the AI application and the server.

MCP does not magically provide weather information. The weather MCP server still needs access to a real weather data source.

## **8. Is MCP the Same as an API?**

No. They are related, but they solve different problems.

| API                                            | MCP                                                               |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| Allows software systems to communicate         | Standardizes how AI applications connect to tools and context     |
| Defines endpoints and request/response formats | Defines a common protocol for AI host-client-server communication |
| Can be used by any application                 | Designed around AI application integration                        |
| Example: Weather API                           | Example: Weather MCP server exposing a weather tool               |

An MCP server can use an ordinary API internally.

For example:

```
AI Application
      |
      v
MCP Client
      |
      v
Weather MCP Server
      |
      v
Weather API
      |
      v
Weather Data
```

MCP is not a replacement for every API. It provides a standardized integration layer.

## **9. Important Concepts to Remember**

1. **LLM:** A language model that understands and generates text.
2. **Context:** Relevant information provided to the model to help it understand a request.
3. **Intent:** The purpose behind the user's message.
4. **Tool calling:** The process through which an AI application requests an external action.
5. **MCP:** A protocol that standardizes communication between AI applications and external capabilities.
6. **MCP Host:** The application that manages the AI experience.
7. **MCP Client:** The component that communicates with MCP servers.
8. **MCP Server:** A program that exposes tools, resources, and prompts.
9. **External API:** A service that provides data or functionality to an application.

### **Common misconceptions**

- MCP is not an LLM.
- MCP is not itself a weather API or search engine.
- An MCP server does not have to contain another LLM.
- Intent extraction is not the same thing as MCP.
- You can connect an LLM directly to an API without MCP.
- MCP makes integrations more standardized; it does not automatically make every external service available.

## **10. Interview Questions and Answers**

**Q1. What is MCP?**

MCP stands for Model Context Protocol. It is an open standard that allows AI applications to connect with external tools, resources, and services.

**Q2. Why do we need MCP?**

To standardize how AI applications communicate with external tools and data sources, making integrations easier to develop and maintain.

**Q3. What are the three main components of MCP architecture?**

MCP Host, MCP Client, and MCP Server.

**Q4. What is the responsibility of an MCP server?**

It exposes capabilities such as tools, resources, and prompts to an AI application through the MCP protocol.

**Q5. Can an MCP server work without an LLM?**

Yes. An MCP server can be an ordinary program that exposes tools and communicates with external services.

**Q6. How can an AI answer questions about live weather?**

The AI application can call an external weather API or an MCP server connected to that API, retrieve current data, and provide it to the LLM to generate an answer.

**Q7. Is MCP a replacement for APIs?**

No. MCP can use APIs internally. It standardizes how AI applications interact with external capabilities.

**Q8. What is the difference between a tool and a resource in MCP?**

A tool performs an action, while a resource provides data that an AI application can access.

## **11. Test Your Understanding**

Try answering these questions without looking at the notes.

**Knowledge check**

0/4 answered

**1. What does MCP stand for?**

Model Communication Program

Model Context Protocol

Machine Context Process

**2. Which component communicates with an MCP server?**

MCP Client

Weather API

LLM training system

**3. Does an MCP server necessarily contain an LLM?**

Yes, always

No, it can be an ordinary program

**4. Where does current weather information come from?**

Only the LLM's training data

An external data source such as a weather API

The MCP protocol itself

Check answers

**Practical learning task:** Build a small weather MCP server that exposes a `get_weather` tool. Connect it to an MCP-compatible AI client and observe how the AI discovers and calls the tool.

That will help you understand MCP much better than memorizing its definition.
