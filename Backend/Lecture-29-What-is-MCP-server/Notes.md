# Lecture 29: What Is an MCP Server?

## 1. What is MCP?

MCP stands for Model Context Protocol.

MCP is an open protocol that provides a standard way for AI applications to connect LLMs with external tools, data sources, and services.

In simple words:

> MCP helps an AI model interact with external systems so it can retrieve information and perform actions beyond what it already knows.

For example, an LLM can generate an answer using its trained knowledge. But if you ask it to check today's weather, read a file from your computer, or query a database, it needs access to an external source. MCP provides a standardized way to connect the AI application to such sources.

Official documentation: [Model Context Protocol – Introduction](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro?utm_source=chatgpt.com)

### Why do we need MCP?

An LLM has limitations:

- Its training knowledge is not necessarily up to date.
- It cannot automatically access your private database or local files.
- It cannot directly interact with every external application.
- It cannot perform real-world actions unless the application provides suitable tools and permissions.

MCP helps bridge the gap between an LLM application and external systems.

Without external tools

User asks a question

LLM uses its existing knowledge

Generated answer

With external tools through MCP

User asks a question

LLM application identifies the required information or action

MCP connection → External tool or data source

Weather API · Database · Files · Other services

LLM receives the result and generates an answer

Important: MCP does not make an LLM smarter by itself. It provides a standardized communication method through which an AI application can access external capabilities.

## 2. What Does "Providing Context to an LLM" Mean?

Before understanding MCP, we need to understand the word context.

Context means the information surrounding a user's current question that helps the model understand what the user is talking about and produce a relevant answer.

Imagine this conversation:

User: My name is Fahad.

Assistant: Nice to meet you, Fahad.

User: What is my name?

If the model receives only the last message:

> What is my name?

It has no information about the user's name in that request.

But if the application sends the previous conversation along with the current message, the model can answer correctly.

### How is context provided?

The application sends the relevant conversation history to the model.

For example:

```
const messages = [
  {
    role: "user",
    content: "My name is Fahad."
  },
  {
    role: "assistant",
    content: "Nice to meet you, Fahad."
  },
  {
    role: "user",
    content: "What is my name?"
  }
];
```

The model receives the conversation and uses it to understand the current question.

The key concept:

- Current message = What the user is asking now.
- Previous messages = What has already been discussed.
- Context = Relevant information from the current and previous interactions, plus other information the application supplies.

This is why conversation history is important when building chat applications.

### Does an LLM automatically remember every previous conversation?

No. A typical LLM inference request does not automatically contain every previous conversation.

The application must provide the relevant history, retrieve stored information, or use a session mechanism that manages the conversation.

Also, sending the entire conversation every time is not always practical because models have a limited context window and processing more tokens can increase cost.

This connects directly to the previous lecture on managing chat history through:

- Keeping recent messages.
- Keeping selected earlier messages.
- Summarizing older conversations.

## 3. How Does ChatGPT Answer Questions About Live Information?

Consider this question:

> What is the current weather in Pakistan?

Think about it carefully.

The LLM was trained on a dataset containing information up to a particular point. It cannot reliably know the weather happening right now simply from its training data.

So how can an AI application answer this question?

It can use an external tool or service to retrieve current information.

For example, a weather service might provide an API that returns:

```
{
  "location": "Islamabad",
  "temperature": 24,
  "condition": "Cloudy",
  "humidity": 60
}
```

The LLM can then use this information to formulate a natural-language response.

### Step-by-step process

1. The user asks: "What is the current weather in Islamabad?"
2. The AI application receives the message.
3. The model determines that the user needs current weather information.
4. The application identifies an appropriate weather tool.
5. The tool sends a request to a weather API.
6. The weather API returns current weather data.
7. The result is provided back to the model.
8. The model explains the result in natural language.

## Live weather example

1\. User

"What is the current weather in Islamabad?"

2\. LLM

Understands that current weather data is required.

3\. Weather tool

Requests data from a weather API.

4\. Weather API

Returns current temperature, conditions and humidity.

5\. LLM

Uses the returned data to prepare an answer.

6\. User receives the answer

"It is currently 24°C and cloudy in Islamabad."

Illustrative workflow. The actual implementation may use different internal components and multiple tool calls.

### Important distinction: LLM knowledge vs external information

| LLM's trained knowledge                  | External tool data                 |
| ---------------------------------------- | ---------------------------------- |
| Learned during training                  | Retrieved when needed              |
| Can explain general concepts             | Can provide current information    |
| May become outdated                      | Depends on the external source     |
| Does not automatically know private data | Can access authorized private data |

Example:

- "What is the water cycle?" → The LLM can generally answer using its learned knowledge.
- "What is the weather right now?" → It needs a current data source.
- "What is the balance in my bank account?" → It needs authorized access to the relevant banking service.

## 4. What Is the Role of Intent?

Your lecture introduces another important concept: Intent.

Intent means the purpose behind a user's message — what the user is trying to achieve or what information they want.

An AI application should not simply look at the words in a message. It should understand the user's actual goal.

### Example: Weather question

User says:

> Tell me the current weather in Pakistan.

The application needs to identify:

- Intent: Get current weather.
- Location: Pakistan.
- Required tool: Weather service.
- Required data: Current weather conditions.

A structured representation could look like this:

```
{
  "intent": "get_weather",
  "location": "Pakistan"
}
```

Notice an important correction to the lecture's example:

```
{
  "intent": "Pakistan",
  "data": "Weather"
}
```

This is not the best structure because it mixes up the user's goal and the location. A clearer structure separates the action from its parameters.

### More examples

| User's message                | Intent               | Required information |
| ----------------------------- | -------------------- | -------------------- |
| What is the weather in Bisha? | `get_weather`        | Location: Bisha      |
| Find restaurants in Riyadh    | `search_restaurants` | Location: Riyadh     |
| Add a task to my list         | `create_task`        | Task description     |
| Show my account balance       | `get_balance`        | Authorized account   |

### Does intent identification require another LLM?

Not necessarily.

There are different ways to identify intent:

1. Same LLM: The model understands the message and decides which tool is needed.
2. Separate LLM: One model classifies the user's request, and another model handles the response.
3. Traditional code: Rules or a classifier identify certain patterns and route requests to tools.

The first approach is common in modern tool-calling systems. A separate LLM is optional, not a requirement of MCP.

## 5. What Exactly Is an MCP Server?

Now we can connect all these concepts.

An MCP server is a program that exposes tools, resources, and prompts to an AI application through the Model Context Protocol.

Think of an MCP server as a standardized bridge between an AI application and an external service.

For example, suppose you build a weather MCP server. It can expose a tool named `get_weather`.

The AI application can discover that tool, understand what arguments it requires, and request its execution when appropriate.

## MCP architecture

User

Asks a question

AI Application (MCP Host)

Contains the LLM and manages the conversation

MCP Client

Communicates with an MCP server

Weather MCP Server

Exposes the get_weather tool

Weather API

Provides current weather data

### Understanding the three main components

1\. MCP Host

The host is the AI application in which the user interacts with the model.

Examples include an AI desktop application or an AI-powered application you build yourself.

Responsibilities:

- Manages the conversation with the user.
- Uses an LLM to understand requests.
- Manages MCP client connections.
- Controls which tools and resources are available.

2\. MCP Client

The client is the component inside the host that communicates with an MCP server.

Responsibilities:

- Establishes a connection with the MCP server.
- Discovers available tools and resources.
- Sends requests to the server.
- Receives results from the server.

3\. MCP Server

The server exposes capabilities to the MCP client.

For example, a weather MCP server could expose:

```
get_weather(location)
```

When called, the server might contact a weather API and return its result.

Important: An MCP server does not have to be a remote server running on the internet. It can also run locally on the user's computer. MCP supports different ways of connecting to servers.

## 6. What Does an MCP Server Provide?

MCP defines three important server capabilities:

### A. Tools

Tools allow an AI application to perform actions.

Examples:

- Get current weather.
- Search the internet.
- Read database records.
- Create a calendar event.
- Send an email.

Example tool definition (simplified):

```
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string"
      }
    },
    "required": ["location"]
  }
}
```

The definition tells the AI application:

- The tool's name.
- What the tool does.
- What information it requires.

### B. Resources

Resources provide data or information to an AI application.

Examples:

- Files.
- Database records.
- Documentation.
- Project information.

Think of resources as information the application can read and use as context.

### C. Prompts

Prompts are reusable prompt templates provided by an MCP server.

For example, a database MCP server might provide a template for explaining a database schema.

Quick comparison:

| Capability | Purpose                       | Example                   |
| ---------- | ----------------------------- | ------------------------- |
| Tools      | Perform actions               | Create a task             |
| Resources  | Provide information           | Read a document           |
| Prompts    | Provide reusable instructions | Explain a database schema |

These capabilities are distinct. A server may implement one, several, or all of them.

## 7. How Does Communication Actually Happen?

MCP is not simply a concept or a design pattern. It defines a communication protocol.

The protocol specifies how the host, client, and server exchange messages.

MCP uses JSON-RPC 2.0 as its message format. JSON-RPC defines how requests, responses, and notifications are represented.

For example, an MCP client can ask a server to list its available tools.

A simplified request looks like this:

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

The server may respond with:

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get weather for a location"
      }
    ]
  }
}
```

The client now knows that the server provides a tool called `get_weather`.

It can request the tool's execution:

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "Islamabad"
    }
  }
}
```

The server executes the tool and returns the result.

These are simplified examples of MCP messages, not a complete implementation. Actual responses contain additional protocol-defined fields.

### How does the MCP client connect to the server?

MCP supports different transport mechanisms. Two important ones are:

1\. stdio (Standard Input/Output)

- Commonly used when the MCP server runs locally.
- The host launches the server as a separate process.
- They communicate through standard input and standard output.

Example: An AI coding assistant starts a local MCP server that accesses project files.

2\. Streamable HTTP

- Used for communication with remote MCP servers.
- The client communicates with the server over HTTP.
- It supports streaming where appropriate.

Example: An AI application connects to a remotely hosted company database MCP server.

The transport determines how messages travel; the MCP protocol defines what those messages mean.

## 8. Complete Example: Building a Weather MCP Server

Let's connect everything using a practical example.

Suppose you want to build an AI assistant that can answer questions about the weather.

You have:

- Frontend: React.
- Backend: Node.js and Express.
- LLM: Gemini.
- Weather service: An external weather API.
- MCP server: A server that exposes weather functionality.

### Step 1: User sends a question

```
What is the current weather in Bisha?
```

### Step 2: LLM understands the intent

The model determines that it needs current weather information.

It identifies the required tool:

```
{
  "intent": "get_weather",
  "arguments": {
    "location": "Bisha"
  }
}
```

### Step 3: Application checks available MCP tools

The MCP client has already discovered the available tools from the weather MCP server.

For example:

```
Available tools:

1. get_weather(location)
2. get_forecast(location, days)
```

The model or application selects `get_weather`.

### Step 4: MCP client sends a request

The client sends a `tools/call` request to the MCP server, providing the location.

### Step 5: MCP server executes the tool

The server contacts the external weather API.

Simplified server-side logic:

```
async function getWeather(location) {
  const response = await fetch(
    `WEATHER_API_URL?location=${encodeURIComponent(location)}`
  );

  if (!response.ok) {
    throw new Error("Weather service failed");
  }

  return await response.json();
}
```

This is ordinary application logic illustrating what the tool might do. It is not, by itself, a complete MCP server.

### Step 6: MCP server returns the result

For example:

```
{
  "location": "Bisha",
  "temperature": 29,
  "condition": "Sunny"
}
```

### Step 7: LLM generates the final answer

The AI application gives the tool result to the model.

The model responds:

> The current weather in Bisha is 29°C and sunny.

The user receives a natural-language answer based on the external data.

## 9. MCP vs Direct API Integration

You might now have a question:

Why do we need MCP? Why can't we simply call an API from our backend?

We absolutely can.

For example, without MCP, your backend could directly call a weather API:

```
const weather = await getWeather("Bisha");
```

This works perfectly well.

However, imagine that you have multiple AI applications and multiple external services.

Without a common protocol, you may need to write separate integrations for every application and service.

MCP provides a standardized way for compatible AI applications to discover and communicate with external capabilities.

| Direct API integration                           | MCP                                                        |
| ------------------------------------------------ | ---------------------------------------------------------- |
| Your application integrates with an API directly | Your application connects through an MCP client and server |
| You define your own integration structure        | MCP defines a common protocol                              |
| Integrations may differ between applications     | Compatible clients can reuse MCP servers                   |
| You manage tool discovery yourself               | Servers can expose discoverable tools                      |
| Useful for simple, specific integrations         | Useful for reusable AI tool integrations                   |

Important: MCP does not replace APIs. An MCP server often calls ordinary APIs internally. MCP standardizes how the AI application accesses that functionality.

## 10. MCP vs Function Calling

These two concepts are related, but they are not the same.

### Function calling

Function calling is a capability provided by an LLM platform that allows a model to request that an application execute a function.

For example, Gemini might produce a tool call requesting:

```
{
  "name": "get_weather",
  "args": {
    "location": "Bisha"
  }
}
```

Your application receives this request, executes the function, and sends the result back to the model.

### MCP

MCP is a protocol for connecting AI applications to external tools and data sources.

It standardizes how tools are exposed, discovered, and called across compatible applications.

### How do they work together?

LLM

Decides it needs weather information

Function / Tool call

Requests get_weather(location: "Bisha")

MCP Client

Sends the request using the MCP protocol

MCP Server

Executes the weather tool

Weather API

Returns current weather data

The distinction is:

- Function calling: How the model requests a function to be executed.
- MCP: How the AI application communicates with external tool providers through a standard protocol.

An application can use function calling without MCP, and it can use MCP to connect to servers whose tools are then made available to an LLM.

## 11. Important Misconceptions and Corrections

### Misconception 1: MCP is an LLM.

Incorrect. MCP is a communication protocol, not an AI model.

It does not generate answers, understand language, or reason by itself. The LLM performs those tasks.

### Misconception 2: MCP stores all previous conversations.

Incorrect. MCP is not a conversation-history database.

Conversation history is generally managed by the AI application. MCP provides standardized access to external capabilities and information.

### Misconception 3: Every user message needs another LLM to identify intent.

Incorrect. One LLM can understand the user's message, identify the required tool, and request its execution. A separate intent-classification model is optional.

### Misconception 4: MCP and APIs are alternatives.

Incorrect. They work together. An MCP server can call an external API and return its result through the MCP protocol.

### Misconception 5: An MCP server must run on a remote computer.

Incorrect. MCP servers can run locally or remotely.

### Misconception 6: MCP automatically gives an AI access to everything.

Incorrect. An application must connect to an MCP server, and that server must expose the relevant capabilities. Access also depends on permissions and security controls.

## 12. Security Considerations

MCP can give AI applications access to powerful tools, such as databases, files, email, and other services.

This makes security extremely important.

Consider an MCP server with a tool:

```
delete_file(filePath)
```

If the application allows unrestricted execution, a user or malicious instruction could cause an unwanted file deletion.

Important security practices:

1. Authentication: Verify who is connecting to the server.
2. Authorization: Check which resources and tools the user is allowed to access.
3. Input validation: Validate tool arguments before executing them.
4. Least privilege: Give the server only the permissions it needs.
5. Sensitive data protection: Never expose API keys, passwords, or private information unnecessarily.
6. Human approval: Require confirmation for high-impact actions where appropriate.
7. Error handling and logging: Record failures and suspicious activity without leaking secrets.

Real-life example: A calendar MCP server may allow an AI to read events but require user confirmation before deleting an event.

## 13. Interview Questions and Answers

Q1. What is MCP?

MCP stands for Model Context Protocol. It is an open standard that allows AI applications to connect with external tools, data sources, and workflows through a common protocol.

Q2. Why do we need MCP?

Because LLMs do not automatically have access to external systems, private databases, local files, or real-time information. MCP provides a standardized way to connect AI applications to these capabilities.

Q3. What is an MCP server?

An MCP server is a program that exposes tools, resources, and prompts to an MCP client.

Q4. What are the three main components of MCP architecture?

- MCP Host
- MCP Client
- MCP Server

Q5. What is the difference between an MCP host and an MCP client?

The host is the AI application that manages the model and conversation. The client is the component inside the host that communicates with an MCP server.

Q6. What are tools in MCP?

Tools are executable capabilities exposed by an MCP server, such as searching the web, querying a database, or creating a calendar event.

Q7. What are resources in MCP?

Resources are data sources that provide information to an AI application, such as files, database records, or documentation.

Q8. What are prompts in MCP?

Prompts are reusable prompt templates that an MCP server can expose to an AI application.

Q9. Does MCP itself generate responses?

No. The LLM generates responses. MCP provides a standardized communication mechanism for accessing external capabilities.

Q10. How can ChatGPT answer questions about current weather?

An AI application can use a tool connected to a weather service. The service provides current data, which the LLM uses to generate a response.

Q11. What is intent?

Intent is the purpose behind a user's message — what the user wants to accomplish.

Q12. Is a separate LLM required for intent identification?

No. The same LLM can identify intent and request the appropriate tool. A separate model or traditional classifier is optional.

Q13. What protocol does MCP use for messages?

MCP uses JSON-RPC 2.0 to represent requests, responses, and notifications.

Q14. What are two important MCP transport mechanisms?

- stdio
- Streamable HTTP

Q15. What is the difference between MCP and function calling?

Function calling allows an LLM to request the execution of a function. MCP standardizes communication between AI applications and external tool providers.

Q16. Does MCP replace APIs?

No. An MCP server can call APIs internally and expose their functionality to AI applications through MCP.

Q17. Can MCP servers run locally?

Yes. They can run locally using stdio or remotely using Streamable HTTP.

Q18. Does MCP automatically maintain conversation history?

No. Conversation history is generally managed by the AI application, not by MCP itself.

## 14. Final Revision Notes

| Concept          | Remember this                                                        |
| ---------------- | -------------------------------------------------------------------- |
| MCP              | Model Context Protocol                                               |
| Purpose          | Standardized connection between AI applications and external systems |
| Context          | Relevant information supplied to help the LLM understand a request   |
| Intent           | What the user wants to accomplish                                    |
| MCP Host         | The AI application                                                   |
| MCP Client       | Communicates with MCP servers                                        |
| MCP Server       | Exposes tools, resources, and prompts                                |
| Tools            | Perform actions                                                      |
| Resources        | Provide information                                                  |
| Prompts          | Reusable prompt templates                                            |
| JSON-RPC 2.0     | Message format used by MCP                                           |
| stdio            | Common local communication transport                                 |
| Streamable HTTP  | Remote communication transport                                       |
| Function calling | Model requests execution of a function                               |
| External API     | Provides data or performs services                                   |

### Complete concept in one flow

```
User asks a question
        |
        v
AI application receives the message
        |
        v
LLM understands the context and intent
        |
        v
LLM determines that an external tool is needed
        |
        v
MCP Client communicates with MCP Server
        |
        v
MCP Server executes the requested tool
        |
        v
External API / Database / File System
        |
        v
Tool result returns to the AI application
        |
        v
LLM uses the result to generate an answer
        |
        v
User receives the final response
```

### Official learning resources

1. [MCP – Introduction](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro?utm_source=chatgpt.com) — Understand what MCP is and why it exists.
2. [MCP – Architecture](https://modelcontextprotocol.io/docs/learn/architecture?utm_source=chatgpt.com) — Understand hosts, clients, servers, and communication.
3. [MCP – Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts?utm_source=chatgpt.com) — Learn about tools, resources, and prompts.
4. [Build an MCP Server](https://modelcontextprotocol.io/docs/develop/build-server?utm_source=chatgpt.com) — Start developing your own MCP server.

The most important takeaway: An LLM is responsible for understanding and generating responses. MCP provides a standardized way for the AI application to connect that intelligence with external tools and information.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://modelcontextprotocol.io&sz=32)

Model Context Protocol
