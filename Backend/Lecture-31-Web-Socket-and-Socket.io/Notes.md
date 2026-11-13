# **Lecture 31: WebSocket and Socket.IO**

## **1. Introduction: Why Do We Need WebSocket?**

Before understanding WebSocket, we need to understand a problem with the traditional way browsers and servers communicate.

Imagine that you are using a chatting application. Your friend sends you a message.

**Question:** How does your browser know that your friend has sent you a new message?

With a traditional HTTP request-response approach, your browser generally has to request the server to check for new messages.

For example:

1. Your browser sends a request to the server: "Do I have any new messages?"
2. The server checks for new messages.
3. The server responds: "No new messages."
4. A few seconds later, your browser sends another request.
5. Your friend sends a message.
6. Your browser eventually requests again and receives that message.

This approach is inefficient for applications that need frequent, real-time communication.

### **What problems does WebSocket solve?**

WebSocket allows the client and server to establish a persistent, two-way communication connection.

Once the connection is established:

- The client can send messages to the server.
- The server can send messages to the client without waiting for a new HTTP request.
- Both sides can communicate independently.
- The connection can remain open for as long as it is useful and supported.

## **Traditional HTTP vs WebSocket**

**Traditional HTTP polling**

**Browser**

**Server**

Request: Any new messages?

**Browser**

**Server**

Response: No new messages.

The browser repeats this process.

**WebSocket**

**Browser**

**Server**

Persistent, two-way connection

Either side can send data whenever needed.

## **2. Applications That Need Real-Time Communication**

WebSocket is useful when an application needs data to move between the client and server with minimal delay.

Examples include:

### **2.1 Live Chat Applications**

[Direct Message I Daily UI Design by Ecem Karademir Güven on Dribbble](https://images.openai.com/static-rsc-4/MgSuMoTfiGAijH5r1KkZ7vttMFzIBCn-Q9gikSEsxG3zKC5gzWqsicecWVOFFUJlF7BwTilISqnhWLq-DJ4ZmB33WUWSlOdfXr3UsSFOAwLNldD7zbMPKESPv_YTOXbI_Z7dQG8FSX1Pt0U7_zh8vsOGYFhFCZ8Lu8Lyd6ZVupw?purpose=inline)

[dribbble.com](https://dribbble.com/shots/22189957-Direct-Message-I-Daily-UI-Design?utm_source=chatgpt.com)

Suppose Fahad sends a message to his friend.

Without a real-time communication mechanism, the friend's browser may need to keep requesting the server to check for new messages.

With WebSocket, the server can push the new message to the friend's connected browser immediately.

### **2.2 Live Notifications**

For example:

- Someone likes your post.
- Someone comments on your picture.
- You receive a new email notification.
- Your order status changes.

The server can send the notification to the connected client without waiting for the client to request it.

### **2.3 Multiplayer Games**

[Firefall Beta Log 07](https://images.openai.com/static-rsc-4/5kVTtZ5hythygx495ai_9VOgV_X-7h2YTIrv7QeuEZVqtK6sHwZVCNCjnzRZtIf6U6-u9I19ogn4ny96ifvccKbQru3F45t8LLQdlkgBrwFXSpnXflCjHJyBjzJLOLVQkeNdXsbMQ0lGU9Dp8YPOTliEfb3hkJ0qYuYxWNNigRU?purpose=inline)

[rumble.com](https://rumble.com/v6fwar1-firefall-beta-log-07.html?utm_source=chatgpt.com)

Imagine a multiplayer game where several players are moving simultaneously.

The server needs to distribute information such as:

- Player positions.
- Player movements.
- Game events.
- Scores.
- Actions performed by other players.

Repeated HTTP requests would be inefficient for this kind of frequent communication.

### **2.4 Live Dashboards and Stock Prices**

[Buy ROKT ETF – ROKT ETF Quote Today & Investment Insights - Public.com](https://images.openai.com/static-rsc-4/ueBNpZCc6AE1teNLR6Fi01ddRKKEi3thmWUTAovAE9ovAkDjcDSDwFWXigsZswiNO_OWSqtV1qaTtBJfgYh3Ksv1-yCdV95FbKpd1MzA1tRmwP2mFvHijrkFreNRYMSvqEvwGS1UOv5aH6r_fIB9Ao-RmTQWRRFF8x0jGpHntCM?purpose=inline)

[public.com](https://public.com/stocks/rokt?utm_source=chatgpt.com)

A dashboard might need to display changing information:

- Stock prices.
- Server CPU usage.
- Website visitors.
- Live sales.
- Sensor measurements.

WebSocket can deliver updates as they become available.

### **2.5 Other Applications**

| Application           | Why real-time communication matters       |
| --------------------- | ----------------------------------------- |
| Collaborative editors | Users see each other's changes            |
| Live sports scores    | Score updates arrive quickly              |
| Delivery tracking     | Vehicle location changes are communicated |
| Online support        | Customers and agents exchange messages    |
| IoT applications      | Devices send sensor readings              |
| Live auctions         | Bids and prices update quickly            |

**Important:** WebSocket is not the only way to build real-time applications. Server-Sent Events (SSE), polling, and other technologies can also deliver updates. The right choice depends on whether communication needs to be one-way or two-way, how frequently data changes, and the application's requirements.

## **3. Understanding HTTP: How Did Communication Work Before WebSocket?**

To understand why WebSocket was introduced, we need to understand HTTP.

### **3.1 What Is HTTP?**

HTTP stands for **Hypertext Transfer Protocol**.

It is a communication protocol that allows a client, such as a browser, to communicate with a server.

For example, when you visit:

```
https://example.com
```

Your browser sends an HTTP request to the server.

The server processes that request and sends back an HTTP response.

A simple request-response flow:

```
Browser  ------ HTTP Request ------>  Server
Browser  <----- HTTP Response ------  Server
```

The traditional HTTP model is based on the client initiating requests. The server sends responses to those requests.

### **3.2 HTTP/1.0: A New Connection for Each Request**

In the common HTTP/1.0 behavior, each request generally used a separate TCP connection.

For example:

```
Request 1:
Browser -------- TCP Connection -------- Server
Browser <------- HTTP Response --------- Server
                 Connection closes

Request 2:
Browser -------- New TCP Connection ---- Server
Browser <------- HTTP Response --------- Server
                 Connection closes
```

This could create unnecessary overhead because establishing a TCP connection takes time and network resources.

However, an important correction:

HTTP/1.0 did not technically require every connection to close. Persistent connections could be supported through extensions such as `Connection: keep-alive`. The default behavior was generally non-persistent.

### **3.3 What Is a TCP Connection?**

TCP stands for **Transmission Control Protocol**.

It is a transport-layer protocol that provides reliable, ordered delivery of data between two endpoints.

Before two TCP endpoints exchange data, they normally establish a connection through a process called the **three-way handshake**.

## **4. TCP Three-Way Handshake**

The three-way handshake establishes a TCP connection between a client and a server.

It involves three messages:

1. SYN
2. SYN-ACK
3. ACK

## **TCP three-way handshake**

**Client**

Browser

**Server**

**SYN**

I want to establish a connection.

**Waiting**

**Waiting**

**SYN-ACK**

I received your request, and I am ready too.

**ACK**

I acknowledge your response.

**Connected**

TCP connection established

### **Step-by-step explanation**

**Step 1: SYN**

The client sends a SYN packet to the server.

It means:

> I want to establish a TCP connection with you.

**Step 2: SYN-ACK**

The server responds with SYN-ACK.

It means:

> I received your request, and I also acknowledge the connection.

**Step 3: ACK**

The client sends an ACK packet.

It means:

> I received your response.

Now the TCP connection is established, and both sides can exchange data.

### **Why is it called a three-way handshake?**

Because three messages are exchanged to establish the connection.

**Important distinction:** The TCP handshake establishes a TCP connection. It does not itself establish an HTTP or WebSocket application session. Those protocols operate above TCP.

## **5. HTTP/1.1: Persistent Connections**

HTTP/1.1 improved the connection-management problem.

It introduced persistent connections as the default behavior.

This means the client and server can reuse the same TCP connection for multiple HTTP requests and responses.

The relevant HTTP header is:

```
Connection: keep-alive
```

For example:

```
Browser -------- TCP Connection -------- Server
        Request 1 ----------------------->
        <----------------------- Response 1

        Request 2 ----------------------->
        <----------------------- Response 2

        Request 3 ----------------------->
        <----------------------- Response 3
```

Instead of creating a new TCP connection for every request, the same connection can be reused.

### **Does HTTP/1.1 keep the connection open forever?**

No.

A persistent connection is not necessarily a permanent connection.

It can close for several reasons:

1. The client requests that the connection be closed.
2. The server decides to close an idle connection.
3. A proxy or load balancer closes it.
4. The network fails.
5. The server restarts or encounters an error.
6. A configured connection timeout is reached.

For example, a server might close an idle connection after a certain period if no requests are being made.

The timeout is not a universal HTTP/1.1 rule. It depends on the server and the network infrastructure.

### **Important: HTTP/1.1 is still request-response**

This is the main limitation relevant to our lecture.

Even if the TCP connection remains open, the server normally sends an HTTP response in response to a client request.

A persistent TCP connection does not automatically give the server permission to send arbitrary new HTTP responses whenever it wants.

For example:

```
Client: Any new messages?

Server: No.

Client: Any new messages?

Server: No.

Client: Any new messages?

Server: Yes, here is your friend's message.
```

This leads us to the next concept.

## **6. Polling: How Can We Check for New Messages?**

Polling means repeatedly requesting the server to check whether new information is available.

There are two important approaches:

- Short polling.
- Long polling.

### **6.1 Short Polling**

In short polling, the client sends requests at regular intervals.

Example:

```
setInterval(async () => {
  const response = await fetch("/messages");
  const messages = await response.json();

  console.log(messages);
}, 3000);
```

Here:

- `setInterval()` runs a function repeatedly.
- `3000` means 3000 milliseconds, or 3 seconds.
- Every three seconds, the browser asks the server for messages.

**Short polling**

1. Client asks for new messages.
2. Server responds: No new messages.
3. Client waits three seconds.
4. Client asks again.
5. Server responds with new messages if available.

**Problem:** If no new messages are available, many requests are wasted.

For example, if the user receives a message one second after the previous poll, they may wait almost two more seconds before seeing it.

Short polling has two major disadvantages:

- Unnecessary requests consume server and network resources.
- Updates are delayed until the next polling interval.

### **6.2 Long Polling**

Long polling improves this situation.

Instead of immediately responding when no new data is available, the server keeps the HTTP request open and waits for new data or a timeout.

Example:

```
Client: Do I have new messages?

Server: I will wait.

        (Connection/request remains pending)

Friend sends a message.

Server: Yes! Here is the new message.

Client: Receives the response.

Client: Starts another request.
```

The client starts another request after receiving the response.

### **How long polling works**

1. The client sends an HTTP request.
2. The server checks whether new data is available.
3. If data exists, the server immediately responds.
4. If data does not exist, the server waits.
5. When data becomes available, the server responds.
6. If a timeout occurs, the server responds or closes the request.
7. The client sends another request.

## **Short polling vs long polling**

**Short polling**

Repeated requests at fixed intervals.

Request

Response

Wait

Request

Response

Wait

**Long polling**

The request remains pending until data or a timeout.

Request sent

Waiting for new data

Response sent when data arrives

New request starts

### **What is the disadvantage of long polling?**

Long polling can reduce unnecessary requests, but it still has limitations:

- The client must send another request after receiving a response.
- Many concurrent clients can create many pending HTTP requests.
- The server must manage those pending requests.
- It is not as natural for continuous two-way communication as WebSocket.

**Remember:** Long polling does not mean the TCP connection will remain open forever. The HTTP request is held open for a limited period, and the client reconnects or requests again.

## **7. HTTP Streaming: Sending Data in Chunks**

Another technique is HTTP streaming.

In normal request-response communication, the server sends a response and finishes it.

With HTTP streaming, the server can send a response progressively in multiple chunks instead of waiting until all the data is ready.

For example:

```
Client sends one request
        |
        v
Server starts response
        |
        v
Chunk 1: "Hello"
        |
        v
Chunk 2: "How are"
        |
        v
Chunk 3: "you?"
        |
        v
Response ends
```

The client receives the data progressively.

### **Real-life example: AI text generation**

When you ask an AI model a question, the answer may appear word by word or in small chunks.

The server does not necessarily wait until the complete answer is generated. It can stream the response as it becomes available.

### **Is HTTP streaming the same as WebSocket?**

No.

| HTTP streaming                        | WebSocket                                       |
| ------------------------------------- | ----------------------------------------------- |
| Uses an HTTP response stream          | Uses a WebSocket connection                     |
| Usually one-way from server to client | Two-way communication                           |
| Client initiates the request          | Either side can send messages                   |
| Useful for progressive responses      | Useful for continuous interactive communication |

HTTP streaming can be useful when the server needs to send data progressively but does not need an independent two-way communication channel.

## **8. What Is WebSocket?**

WebSocket is a communication protocol that provides **full-duplex communication over a single connection**.

Let's understand the important terms.

### **8.1 Full-duplex communication**

Full-duplex means both sides can send and receive data independently at the same time.

For example:

- You send a message to your friend.
- Your friend sends a message to you.
- Both messages can travel independently without one side having to wait for the other to initiate a new HTTP request.

Compare:

| Communication type | Meaning                                            |
| ------------------ | -------------------------------------------------- |
| Simplex            | Data travels in one direction only                 |
| Half-duplex        | Both sides can communicate, but not simultaneously |
| Full-duplex        | Both sides can communicate simultaneously          |

WebSocket provides full-duplex communication.

### **8.2 Persistent connection**

After the WebSocket connection is established, it can remain open so both sides can exchange multiple messages.

It is not necessary to establish a new connection for every message.

### **8.3 WebSocket URLs**

WebSocket uses two URL schemes:

| Scheme   | Meaning                          |
| -------- | -------------------------------- |
| `ws://`  | WebSocket without TLS encryption |
| `wss://` | WebSocket over TLS encryption    |

Examples:

```
ws://example.com/socket
wss://example.com/socket
```

In production, `wss://` is generally preferred because it encrypts communication.

## **9. How Is a WebSocket Connection Established?**

WebSocket commonly starts with an HTTP request called the **WebSocket handshake**.

This is important: WebSocket does not simply replace HTTP from the beginning. In the traditional WebSocket opening handshake, the client begins with an HTTP request asking to upgrade the connection.

### **Step 1: Client sends an HTTP upgrade request**

The browser sends a request similar to this:

```
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: random-generated-value
Sec-WebSocket-Version: 13
```

Let's understand the important headers:

- `Upgrade: websocket` — asks to switch the connection to WebSocket.
- `Connection: Upgrade` — indicates that the connection is requesting an upgrade.
- `Sec-WebSocket-Key` — a generated value used in the handshake.
- `Sec-WebSocket-Version: 13` — identifies the WebSocket protocol version.

### **Step 2: Server accepts the upgrade**

If the server supports WebSocket and accepts the request, it responds with:

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: generated-value
```

The status code `101` means:

**Switching Protocols.**

The server has accepted the protocol upgrade.

### **Step 3: WebSocket communication begins**

After the handshake succeeds, the connection is used for WebSocket communication.

The client and server can exchange WebSocket frames without making a new HTTP request for each message.

## **WebSocket handshake**

**Browser**\
**Server**

**1. HTTP Upgrade Request**

GET /chat, Upgrade: websocket

**2. Server Response**

101 Switching Protocols

Connected

**3. WebSocket communication**

Client ↔ Server

### **What happens to the TCP connection?**

The WebSocket handshake normally upgrades the existing TCP connection. It does not establish a completely new TCP connection after the HTTP handshake.

This is one reason the transition is efficient.

### **9.1 How does a WebSocket connection close?**

WebSocket has its own closing handshake.

1. One side sends a WebSocket Close control frame.
2. The other side responds with a Close frame.
3. The WebSocket connection is considered closed.
4. The underlying transport connection is then closed.

This is different from TCP's own connection termination process.

### **TCP four-way termination**

TCP commonly uses a four-segment termination sequence involving FIN and ACK flags.

A simplified example:

```
Client                       Server
  |                            |
  | -------- FIN ------------> |
  | <------- ACK ------------- |
  | <------- FIN ------------- |
  | -------- ACK ------------> |
  |                            |
  TCP connection closed
```

The exact sequence can vary, and TCP can also use simultaneous close.

**Important distinction:**

- TCP three-way handshake: establishes a TCP connection.
- WebSocket opening handshake: upgrades an HTTP connection to WebSocket.
- WebSocket closing handshake: closes the WebSocket session.
- TCP termination: closes the underlying TCP connection.

Do not confuse these four processes.

## **10. What Is Socket.IO?**

Socket.IO is a JavaScript library that enables real-time, bidirectional, event-based communication between clients and servers.

Official documentation: [Socket.IO Documentation](https://socket.io/docs/v4/?utm_source=chatgpt.com).

It is commonly used for:

- Live chat applications.
- Notifications.
- Multiplayer games.
- Live dashboards.
- Collaborative applications.

### **Why do we need Socket.IO if WebSocket already exists?**

WebSocket is a communication protocol. It provides the underlying two-way communication mechanism.

Socket.IO is a library built to make real-time communication easier to develop and manage.

It provides additional features such as:

1. Automatic reconnection.
2. Event-based messaging.
3. Rooms.
4. Namespaces.
5. Broadcasting.
6. Acknowledgements.
7. Connection-state recovery in supported configurations.
8. Fallback to HTTP long polling when WebSocket cannot be used.

### **Important: Socket.IO is not WebSocket**

This is one of the most important distinctions in this lecture.

Socket.IO is not simply another name for WebSocket.

They are different protocols and APIs.

A regular WebSocket client cannot directly communicate with a Socket.IO server, and a Socket.IO client cannot directly communicate with an ordinary WebSocket server.

Socket.IO can use WebSocket as its transport, but it adds its own communication protocol and features.

### **Comparison**

| WebSocket                              | Socket.IO                                               |
| -------------------------------------- | ------------------------------------------------------- |
| Communication protocol                 | Real-time communication library                         |
| Provides two-way communication         | Provides two-way communication with additional features |
| No built-in automatic reconnection API | Automatic reconnection support                          |
| No built-in rooms                      | Rooms are supported                                     |
| No built-in event-based API            | Event-based API                                         |
| No built-in HTTP long-polling fallback | Supports HTTP long-polling fallback                     |
| Lightweight protocol                   | Additional functionality and protocol overhead          |

## **11. Why Does Socket.IO Support HTTP Long Polling?**

Your lecture mentions that some browsers or network environments may not support WebSocket or may block it.

Let's understand this.

### **Problem 1: Older browser support**

Some old browsers may not support WebSocket.

If an application relies exclusively on WebSocket, those browsers may not be able to connect.

### **Problem 2: Firewalls and proxies**

Some corporate networks, proxies, or firewalls restrict WebSocket connections.

For example, a network may allow normal HTTP requests but block WebSocket upgrades.

### **Socket.IO's solution: Transport fallback**

Socket.IO supports multiple transports.

The main ones are:

- HTTP long polling.
- WebSocket.
- WebTransport in supported configurations.

A typical Socket.IO connection begins with HTTP long polling by default and may upgrade to WebSocket when possible.

This means the application can continue working even if WebSocket is unavailable, provided a supported alternative transport is available.

## **Socket.IO transport selection**

**Socket.IO client attempts connection**

**Can WebSocket be used?**

Yes

**WebSocket**

Upgrade and use WebSocket transport.

No

**HTTP long polling**

Continue using supported polling transport.

**Important correction:** Socket.IO does not magically make WebSocket work in a browser or network that blocks it. Instead, it can use another supported transport, such as HTTP long polling.

Also, WebSocket is supported by modern browsers. The fallback is especially useful for restrictive networks, proxies, or environments where the WebSocket connection cannot be established.

### **What about WebTransport?**

WebTransport is a newer web communication technology built on HTTP/3 and QUIC.

It supports communication patterns including:

- Bidirectional streams.
- Unidirectional streams.
- Unreliable datagrams.

It can be useful for applications that need flexible, low-latency communication.

However, WebTransport is not simply another name for WebSocket, and it is not universally supported in every browser or network environment.

Socket.IO has introduced WebTransport support in its newer versions, subject to compatibility and configuration.

## **12. Understanding Socket.IO Events**

Now let's move from theory to coding.

One of Socket.IO's most important features is **event-based communication**.

In traditional HTTP, we commonly work with routes:

```
GET /users
POST /messages
GET /products
```

In Socket.IO, communication is organized around events.

For example:

```
socket.emit("send_message", "Hello!");
```

This means:

> Send an event named `send_message` with the data `"Hello!"`.

On the server:

```
socket.on("send_message", (message) => {
  console.log(message);
});
```

This means:

> Whenever this socket receives the `send_message` event, execute this function.

### **Two important methods**

`emit()`

Sends an event.

`on()`

Listens for an event.

| Method                    | Responsibility                                           |
| ------------------------- | -------------------------------------------------------- |
| `socket.emit()`           | Send an event                                            |
| `socket.on()`             | Listen for an event                                      |
| `io.emit()`               | Send an event to all connected sockets                   |
| `socket.broadcast.emit()` | Send an event to all other sockets, excluding the sender |

### **Understand the difference**

```
socket.emit("hello", "Hi");
```

Sends an event to the particular socket.

```
io.emit("hello", "Hi");
```

Sends an event to all connected sockets.

```
socket.broadcast.emit("hello", "Hi");
```

Sends an event to all connected sockets except the socket that sent the event.

## **13. Build a Basic Socket.IO Server**

Let's build the foundation of a real-time application.

### **Step 1: Create a project**

```
mkdir socket-chat
cd socket-chat
npm init -y
```

Install the packages:

```
npm install express socket.io
```

For the browser client, we can use Socket.IO's served client script.

### **Step 2: Create&#x20;**`server.js`

```
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server);

app.use(express.static("public"));

// Listen for socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### **Understand the code line by line**

**1. Import Express**

```
const express = require("express");
```

Express is used to create HTTP routes and serve static files.

**2. Import HTTP**

```
const http = require("http");
```

Node.js provides a built-in HTTP module.

We need an HTTP server because Socket.IO attaches itself to the underlying HTTP server.

**3. Import Socket.IO's Server class**

```
const { Server } = require("socket.io");
```

This imports the server-side Socket.IO class.

**4. Create the Express application**

```
const app = express();
```

This creates the Express application.

**5. Create the HTTP server**

```
const server = http.createServer(app);
```

This creates a Node.js HTTP server using the Express application as its request handler.

Why do we need this?

Because Socket.IO needs access to the actual HTTP server to handle its connection requests and protocol upgrades.

**6. Attach Socket.IO**

```
const io = new Server(server);
```

This creates a Socket.IO server and attaches it to the HTTP server.

Here:

- `server` is the HTTP server.
- `io` is the Socket.IO server instance.

**7. Serve frontend files**

```
app.use(express.static("public"));
```

This tells Express to serve static files from a folder named `public`.

**8. Listen for connections**

```
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});
```

This is one of the most important lines.

Whenever a client successfully connects to the Socket.IO server, the `"connection"` event is triggered.

The callback receives a `socket` object representing that particular connection.

`socket.id` gives that connection its Socket.IO identifier.

**9. Listen for disconnection**

```
socket.on("disconnect", () => {
  console.log("A user disconnected:", socket.id);
});
```

When that client disconnects, the `"disconnect"` event is triggered.

The server can then perform cleanup or update its online-user state.

## **14. What Is a Socket ID?**

When a client connects to a Socket.IO server, the server assigns a unique identifier to that connection.

Example:

```
socket.id
```

Possible output:

```
aBcD1234EfGh5678
```

This identifier is called the **Socket ID**.

It helps the server identify a particular active connection.

### **Why does every browser tab get a different Socket ID?**

Imagine you open the same chat website in three tabs.

## **One user, three connections**

**Same browser**

User logged into three tabs

**Tab 1**

Socket A

**Tab 2**

Socket B

**Tab 3**

Socket C

**Socket.IO Server**

Three separate socket connections

Each tab establishes its own connection with the server.

Therefore, each connection has its own Socket ID.

### **Important correction: Is a Socket ID a combination of IP address and port number?**

No.

A Socket.IO ID is an identifier generated and managed by Socket.IO. It is not simply a combination of the client's IP address and port number.

At the network level, a TCP connection is identified using information such as:

- Source IP address.
- Source port.
- Destination IP address.
- Destination port.
- Transport protocol.

This combination is commonly called a network five-tuple.

But Socket.IO's `socket.id` is a separate application-level identifier.

Also, a Socket ID is not a permanent user ID. It may change after reconnection.

### **Socket ID vs User ID**

| Socket ID                             | User ID                          |
| ------------------------------------- | -------------------------------- |
| Identifies a connection               | Identifies an authenticated user |
| Usually temporary                     | Usually persistent               |
| One user can have multiple socket IDs | One user has one account ID      |
| Changes after a new connection        | Normally remains the same        |

**Real-life example:**

Suppose a user logs in from three browser tabs.

```
const userId = "user-101";

const socketIds = [
  "socket-A",
  "socket-B",
  "socket-C"
];
```

All three connections belong to the same user.

This distinction is essential when building private messaging applications.

## **15. Build a Live Chat Using Socket.IO**

Now we can use the concepts we have learned to build a basic chat application.

Our requirements:

1. Multiple users can connect.
2. Users can send messages.
3. Other connected users receive the messages.
4. The sender should not receive their own message through the broadcast event.

### **Step 1: Create the frontend**

Create this folder structure:

```
socket-chat/
│
├── server.js
├── package.json
│
└── public/
    └── index.html
```

Inside `public/index.html`:

```
<!DOCTYPE html>
<html>
<head>
  <title>Socket.IO Chat</title>
</head>
<body>
  <h1>Live Chat</h1>

  <input id="message" placeholder="Write a message..." />
  <button id="send">Send</button>

  <ul id="messages"></ul>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();

    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");
    const messages = document.getElementById("messages");

    sendButton.addEventListener("click", () => {
      const message = messageInput.value.trim();

      if (!message) return;

      socket.emit("send_message", message);

      messageInput.value = "";
    });

    socket.on("receive_message", (message) => {
      const li = document.createElement("li");
      li.textContent = message;

      messages.appendChild(li);
    });
  </script>
</body>
</html>
```

### **Understand the frontend code**

**1. Connect to Socket.IO**

```
const socket = io();
```

The Socket.IO client establishes a connection with the server.

Because the page is served by the same server, `io()` automatically uses the current origin.

**2. Get the input element**

```
const messageInput = document.getElementById("message");
```

This retrieves the HTML input element.

**3. Listen for button clicks**

```
sendButton.addEventListener("click", () => {
```

When the user clicks Send, the callback executes.

**4. Read the message**

```
const message = messageInput.value.trim();
```

- `.value` reads the text.
- `.trim()` removes extra whitespace at the beginning and end.

**5. Send an event**

```
socket.emit("send_message", message);
```

This sends an event called `"send_message"` to the server.

The message is the data attached to that event.

**6. Listen for incoming messages**

```
socket.on("receive_message", (message) => {
```

Whenever the server sends a `"receive_message"` event, this callback runs.

**7. Display the message**

```
const li = document.createElement("li");
li.textContent = message;

messages.appendChild(li);
```

This creates a new list item and displays the received message.

Using `textContent` rather than `innerHTML` helps prevent message text from being interpreted as HTML.

### **Step 2: Add the server-side message handling**

Inside `server.js`, add this code within the existing connection handler:

```
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (message) => {
    socket.broadcast.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
```

### **Understand&#x20;**`socket.broadcast.emit()`

This is an important concept.

```
socket.broadcast.emit("receive_message", message);
```

It sends the message to every other connected socket, excluding the socket that sent it.

Imagine three users:

## **Broadcast example**

**User A**

Sender

**User B**

Receiver

**User C**

Receiver

**User A sends: "Hello everyone!"**

**User A**

Does not receive the broadcast

**User B**

Receives message

**User C**

Receives message

### **Difference between&#x20;**`io.emit()`**&#x20;and&#x20;**`socket.broadcast.emit()`

| Code                      | Who receives the message?                   |
| ------------------------- | ------------------------------------------- |
| `socket.emit()`           | The particular socket                       |
| `io.emit()`               | All connected sockets, including the sender |
| `socket.broadcast.emit()` | All connected sockets except the sender     |

**Important:** The sender can still display their own message locally. `socket.broadcast.emit()` only means that the server does not send the broadcast event back to that sender.

This is useful for building a chat interface where the sender displays their own message immediately and the server distributes it to everyone else.

### **Step 3: Run the application**

```
node server.js
```

Open:

```
http://localhost:3000
```

Open the same website in two or three browser tabs.

Send a message from one tab. The other connected tabs should receive it.

## **16. What Are Rooms in Socket.IO?**

Now imagine that your chat application has hundreds of users.

You do not want every user to receive every message.

For example:

- Fahad wants to chat with his university team.
- Another group wants to discuss a project.
- Another group wants to discuss cybersecurity.

If every message is broadcast globally, unrelated users will receive messages they should not see.

We need a way to group sockets.

This is where **Socket.IO rooms** are useful.

A room is a logical channel that sockets can join.

Only sockets that belong to a particular room receive events sent to that room.

### **Example**

Imagine three rooms:

## **Chat rooms**

**Room: MERN-TEAM**

Fahad

Ali

Ahmed

**Room: CYBERSECURITY**

Hassan

Usman

**Room: AI-PROJECT**

Fahad

Maryam

Fahad can belong to more than one room at the same time.

If someone sends a message to `MERN-TEAM`, only the sockets in that room receive the message.

### **16.1 How to join a room**

```
socket.join("MERN-TEAM");
```

This adds the current socket connection to the room named `"MERN-TEAM"`.

### **16.2 How to send a message to a room**

```
io.to("MERN-TEAM").emit(
  "receive_message",
  "Hello MERN team!"
);
```

This sends the event to all sockets in the room, including the sender if the sender is a member.

### **16.3 How to send a message to everyone else in the room**

```
socket.to("MERN-TEAM").emit(
  "receive_message",
  "Hello team!"
);
```

This sends the event to the room, excluding the current socket.

### **16.4 How to leave a room**

```
socket.leave("MERN-TEAM");
```

This removes the current socket from that room.

### **Complete room example**

Server:

```
io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);

    console.log(
      `${socket.id} joined room ${roomId}`
    );
  });

  socket.on("send_room_message", ({ roomId, message }) => {
    socket.to(roomId).emit(
      "receive_room_message",
      message
    );
  });
});
```

Frontend:

```
const socket = io();

socket.emit("join_room", "MERN-TEAM");

socket.emit("send_room_message", {
  roomId: "MERN-TEAM",
  message: "Hello team!"
});

socket.on("receive_room_message", (message) => {
  console.log(message);
});
```

### **Understand the flow**

1. The client connects.
2. The client emits `"join_room"`.
3. The server receives the room ID.
4. The server calls `socket.join(roomId)`.
5. The socket becomes a member of that room.
6. When a message is sent to the room, its members receive the event.

**Important security rule:** Do not blindly trust a room ID supplied by the frontend. In a real application, the server must verify that the authenticated user is allowed to join that room.

## **17. Building a Private Messaging System**

Now we come to one of the most important real-world uses of Socket.IO.

Suppose Fahad wants to send a private message to Ali.

The message should be delivered only to Ali's active connections, not to every connected user.

How can the server identify Ali?

### **First, understand the difference between a user and a connection**

A user is an account in your application.

A connection is a particular browser tab, device, or client session connected to the server.

For example:

```
Ali's user ID: user-101

Ali's active connections:
    Tab 1 → socket-A
    Tab 2 → socket-B
    Mobile → socket-C
```

Ali is one user, but he has three active Socket.IO connections.

If you send a private message only to one socket ID, Ali may see it in one tab but not in the other tabs.

We need to associate a user ID with all their active socket connections.

### **17.1 Why not use the phone number?**

Your lecture suggests identifying the person using a phone number and Socket ID.

The better design is:

- Use a stable user ID from your authentication system.
- Associate that user ID with their active socket connections.
- Use the user ID to determine which connections should receive the message.

A phone number can be used as a login identifier, but it should not be treated as the primary internal identity for messaging.

Never trust a user ID or phone number supplied by the frontend without verifying the user's authentication.

### **17.2 How can Socket.IO help?**

Socket.IO provides a useful feature: every socket automatically joins a room named after its own Socket ID.

You can also make each authenticated user join a room named after their user ID.

For example:

```
socket.join(userId);
```

Now all of Ali's active connections can join:

```
Room: user-101

Members:
    socket-A
    socket-B
    socket-C
```

To send a private message to Ali:

```
io.to("user-101").emit(
  "private_message",
  "Hello Ali!"
);
```

Every socket connected to the `user-101` room receives the event.

This is a much cleaner approach than manually maintaining an array of Socket IDs in a simple application.

### **17.3 Complete private messaging example**

Server-side example:

```
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Demonstration only.
// Replace this with real authentication middleware.
io.on("connection", (socket) => {
  socket.on("register_user", (userId) => {
    // Do not trust a userId sent by the client
    // in a real application.
    socket.join(userId);
  });

  socket.on(
    "private_message",
    ({ receiverId, message }) => {
      io.to(receiverId).emit(
        "private_message",
        message
      );
    }
  );
});

server.listen(3000);
```

This demonstrates the room-based delivery mechanism, but it is **not secure production code** because the client is allowed to choose its own user ID and the recipient room.

In a real application:

1. Authenticate the user when the socket connects.
2. Verify their identity on the server.
3. Obtain the user ID from the verified authentication data.
4. Join the verified user to their own room.
5. Verify that the sender is permitted to message the recipient.
6. Store the message in a database.
7. Deliver the message to the recipient's user room.

### **17.4 A better authenticated design**

The following is a simplified pattern showing where authentication belongs:

```
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    // Verify the token using your authentication logic.
    const user = await verifyToken(token);

    socket.data.userId = user.id;

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  // Join the room using the verified identity.
  socket.join(`user:${userId}`);

  socket.on("private_message", async ({ receiverId, message }) => {
    // Validate the message and authorize this operation.
    // Save it to your database before delivery.

    io.to(`user:${receiverId}`).emit("private_message", {
      senderId: userId,
      message
    });
  });
});
```

`verifyToken()` is an illustrative function; you must implement it using your actual authentication system.

### **17.5 How the private messaging architecture works**

## **Private message delivery**

**Fahad**

Authenticated user: user-201

**Socket.IO Server**

Checks sender identity and recipient permissions

**Ali's user room**

user:101

**Ali**

Browser tab 1

**Ali**

Browser tab 2

**Ali**

Mobile

All active connections in Ali's user room can receive the private message.

**Important:** Socket.IO rooms help deliver messages to connected clients. They do not automatically store messages or guarantee that an offline user will receive a message later. For that, you need persistent message storage and a delivery strategy.

## **18. How Does Socket.IO Manage Multiple Users?**

Let's understand what happens when several users connect to your server.

Suppose:

- Fahad connects.
- Ali connects.
- Ahmed connects.

The server receives a separate connection event for each client.

```
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
});
```

Possible terminal output:

```
Connected: socket-A
Connected: socket-B
Connected: socket-C
```

Socket.IO maintains the active socket connections and provides methods to communicate with them.

### **What happens when a user disconnects?**

When a client disconnects:

```
socket.on("disconnect", () => {
  console.log("Disconnected:", socket.id);
});
```

Socket.IO automatically removes the disconnected socket from its rooms.

You generally do not need to manually remove it from every room.

However, if you maintain your own user-to-socket mapping, you must also update that mapping.

### **What if a user reconnects?**

A new connection normally receives a new Socket ID.

For example:

```
Before disconnection:
user-101 → socket-A

After reconnection:
user-101 → socket-B
```

The user's account ID remains the same, but the connection identifier changes.

This is why you should not use a Socket ID as a permanent user identity.

## **19. What Happens If the Server Has Multiple Instances?**

This is an important concept for scalable applications.

Suppose your application becomes popular, and you run two Node.js servers:

```
                 Load Balancer
                 /           \
                /             \
          Server A           Server B
             |                  |
        Socket Clients     Socket Clients
```

Now imagine:

- Fahad is connected to Server A.
- Ali is connected to Server B.
- Fahad sends a message using `io.emit()` on Server A.

Will Ali automatically receive it?

**Not necessarily.**

Each Socket.IO server instance manages its own connected sockets by default.

Server A does not automatically know about sockets connected to Server B.

### **Solution: Socket.IO adapters**

An adapter allows multiple Socket.IO server instances to coordinate their communication.

For example, a Redis adapter can distribute events between multiple server instances through Redis Pub/Sub.

```
             Load Balancer
              /          \
             /            \
        Server A         Server B
             \            /
              \          /
                Redis
             Pub/Sub Adapter
```

Now, an event emitted by one server can be distributed to sockets connected to other servers.

This is useful when your application grows and runs across multiple processes or machines.

**Important:** An adapter helps distribute real-time events. It is not automatically a permanent message database.

## **20. Does Socket.IO Guarantee That Every Message Is Delivered?**

Not automatically.

This is an important distinction when developing a real chat application.

Suppose Fahad sends a message to Ali, but Ali loses internet connectivity at that moment.

The message may not reach Ali's browser through the active socket connection.

Socket.IO provides useful mechanisms such as acknowledgements, reconnection, and connection-state recovery, but you should not assume that every message will be delivered exactly once under all failure conditions.

### **How can we make a reliable chat application?**

A practical design is:

1. Save the message in a database.
2. Assign the message a unique ID.
3. Send the message to the recipient's active connections.
4. Let the recipient acknowledge receipt.
5. Store delivery status if required.
6. When the recipient reconnects, retrieve undelivered messages from the database.

For example, a message record could look like:

```
{
  _id: "message-123",
  senderId: "user-201",
  receiverId: "user-101",
  message: "Hello Ali!",
  status: "sent",
  createdAt: new Date()
}
```

Possible message statuses:

| Status    | Meaning                                     |
| --------- | ------------------------------------------- |
| Sent      | Message accepted by the application         |
| Delivered | Message reached the recipient's application |
| Read      | Recipient opened or read the message        |

The exact meaning of each status should be defined by your application.

### **What are acknowledgements?**

Socket.IO allows a client or server to acknowledge an event.

Example:

```
socket.emit(
  "send_message",
  { message: "Hello!" },
  (response) => {
    console.log(response);
  }
);
```

The receiver can acknowledge the event:

```
socket.on("send_message", (data, callback) => {
  console.log(data.message);

  callback({
    success: true
  });
});
```

The callback lets the sender know that the receiver's handler acknowledged the event.

But remember: an acknowledgement does not automatically mean the message was permanently saved or read. You must define what the acknowledgement represents.

## **21. WebSocket vs Socket.IO vs HTTP: Complete Comparison**

| Feature                          | HTTP polling                  | Long polling                       | WebSocket            | Socket.IO                  |
| -------------------------------- | ----------------------------- | ---------------------------------- | -------------------- | -------------------------- |
| Client requests                  | Repeatedly                    | Repeatedly after responses         | Initial handshake    | Initial connection         |
| Server pushes updates            | Through responses to requests | When pending request receives data | Yes                  | Yes                        |
| Two-way communication            | Request-response              | Request-response                   | Yes                  | Yes                        |
| Persistent communication channel | Not necessarily               | Pending request temporarily        | Yes                  | Yes, through its transport |
| Automatic reconnection           | Application-managed           | Application-managed                | Application-managed  | Built in                   |
| Rooms                            | No built-in support           | No built-in support                | No built-in support  | Built in                   |
| Broadcasting                     | Application-managed           | Application-managed                | Application-managed  | Built in                   |
| Fallback transports              | Not applicable                | It is itself a technique           | No built-in fallback | Yes                        |

## **22. Important Misconceptions**

### **Misconception 1: HTTP/1.1 keeps the connection open forever.**

Incorrect. Persistent connections can be closed by clients, servers, intermediaries, or network failures.

### **Misconception 2: HTTP/1.1 allows the server to send any message whenever it wants.**

Incorrect. Ordinary HTTP remains request-response. Persistent TCP connections do not automatically provide independent server push.

### **Misconception 3: WebSocket and Socket.IO are the same.**

Incorrect. WebSocket is a protocol. Socket.IO is a library with its own protocol and additional features.

### **Misconception 4: Every Socket.IO connection represents a different user.**

Incorrect. One user can have multiple connections, such as multiple tabs and devices.

### **Misconception 5: Socket ID is the user's IP address and port.**

Incorrect. Socket.IO generates an application-level connection ID. It is not a combination of IP address and port.

### **Misconception 6: Broadcasting and rooms are the same.**

Incorrect.

- Broadcasting sends events to a group of sockets.
- Rooms define a group of sockets that can be targeted.

### **Misconception 7: Socket.IO automatically saves messages.**

Incorrect. It provides communication features, not a permanent chat database.

### **Misconception 8: WebSocket is always better than HTTP.**

Incorrect. If your application only needs to retrieve information occasionally, normal HTTP is usually simpler and more appropriate.

## **23. Interview Questions and Answers**

**Q1. What is WebSocket?**

WebSocket is a communication protocol that enables full-duplex communication between a client and server over a persistent connection.

**Q2. Why do we need WebSocket?**

It allows the server to send data to connected clients without waiting for them to initiate a new HTTP request. It is useful for live chat, notifications, multiplayer games, and live dashboards.

**Q3. What is the difference between HTTP and WebSocket?**

HTTP follows a request-response model. WebSocket establishes a persistent, two-way communication connection.

**Q4. What is the TCP three-way handshake?**

It is the process used to establish a TCP connection through SYN, SYN-ACK, and ACK messages.

**Q5. What is the WebSocket handshake?**

It is the process in which a client sends an HTTP Upgrade request and the server accepts it using status code `101 Switching Protocols`.

**Q6. What is the difference between TCP handshake and WebSocket handshake?**

The TCP handshake establishes the underlying transport connection. The WebSocket handshake upgrades an HTTP connection to the WebSocket protocol.

**Q7. What is HTTP/1.1 persistent connection?**

It allows multiple HTTP requests and responses to reuse the same TCP connection instead of creating a new connection for every request.

**Q8. What is short polling?**

The client sends requests repeatedly at fixed intervals to check for new data.

**Q9. What is long polling?**

The client sends a request, and the server keeps it pending until new data becomes available or a timeout occurs. The client then sends another request.

**Q10. What is HTTP streaming?**

It allows the server to send response data progressively in chunks rather than waiting for the complete response.

**Q11. What is full-duplex communication?**

It means both sides can send and receive data independently at the same time.

**Q12. What is Socket.IO?**

Socket.IO is a JavaScript library that provides real-time, event-based, bidirectional communication between clients and servers.

**Q13. Is Socket.IO the same as WebSocket?**

No. Socket.IO has its own protocol and API. It can use WebSocket as a transport but also supports other transports.

**Q14. Why does Socket.IO support long polling?**

It provides an alternative transport when WebSocket cannot be established because of browser, proxy, firewall, or network limitations.

**Q15. What is a Socket ID?**

It is a unique identifier for a particular Socket.IO connection.

**Q16. Why does every browser tab have a different Socket ID?**

Each tab normally establishes its own independent Socket.IO connection.

**Q17. What is the difference between a Socket ID and a User ID?**

A Socket ID identifies an active connection, while a User ID identifies an account in the application.

**Q18. What is&#x20;**`socket.emit()`**?**

It sends an event to a particular socket.

**Q19. What is&#x20;**`io.emit()`**?**

It sends an event to all connected sockets.

**Q20. What is&#x20;**`socket.broadcast.emit()`**?**

It sends an event to all connected sockets except the sender.

**Q21. What are Socket.IO rooms?**

Rooms are logical groups of sockets. They allow the server to send events to selected groups instead of broadcasting to everyone.

**Q22. How can you send a private message to a user logged in from multiple tabs?**

Authenticate the user, make all their active sockets join a room associated with their stable user ID, and emit the private message to that room.

**Q23. What is a Socket.IO adapter?**

An adapter coordinates communication between Socket.IO server instances, allowing events to be distributed across multiple servers.

**Q24. Does Socket.IO guarantee permanent message delivery?**

No. For reliable messaging, applications should persist messages in a database and implement delivery acknowledgements and offline-message retrieval.

## **24. Practical Projects to Build**

To make these concepts permanent, build the following projects in order.

[Build a Professional Real-Time Chat App with Docker, Flask, and Socket.IO - DEV Community](https://images.openai.com/static-rsc-4/Dx-sqiNJ3oGTeBf4hlyFBgbjEGgWKYMxG3IED0zsJymOUt2TV_uFYKqnnxDgOG_ycK8ZnPiIALjLbrCu_JBiHaafVutl_WqfbUIe2L4WleyyaLQwOnWhahYaPspuF7b6DaXIGfXGNLoX66NFsdCZH_3Ioi1P1LxsQW3U-svf5M8?purpose=inline)

**Project 1: Basic Live Chat**

- Connect multiple browser tabs.
- Send and receive messages.
- Use `socket.emit()` and `socket.broadcast.emit()`.
- Show online connection events.

[Team Chats by Ionut Zamfir on Dribbble](https://images.openai.com/static-rsc-4/rDNiKgme9nckoSYVCCPAvd6aUzyHK2CZBJSlBhpJ32xIZHzSSqi3wtp-ctgQHETPQ2DUrRqiQQFz5IJ0nVGgd8Z6MJtfMkA_CzSWqRTYfSZF8YrszSRdPO34rFVnjpi6kaVScWYKjz8zwYk-b7kx_2L3pSVym7hw1ROvVwD9Nwk?purpose=inline)

**Project 2: Group Chat Rooms**

- Create rooms with unique IDs.
- Join and leave rooms.
- Send messages to specific rooms.
- Prevent unauthorized room access.

[Direct Message prompt | UI design by Aarohi Patil on Dribbble](https://images.openai.com/static-rsc-4/-FDIY1zQQvU6NbhXDZWLwCUL-enuScAcXLcWsX0eFwrS305NBfunqSoZ-MNVPuN7y52EqAE9DKlewEsCuyv1c7NDA8yZREJ8AvkE-Cor1AQkk4DuH9d1GxOU7XooniwQVwK3Jc6QO7ESjEn98k-4uo4Wh40DNnj9gMPrWnkHBgA?purpose=inline)

**Project 3: Private Messaging**

- Add user authentication.
- Associate users with socket connections.
- Support multiple tabs per user.
- Store messages in MongoDB.
- Add sent, delivered, and read states.

[Task Management Dashboard by FalconThought for FalconThought - UX/UI Design Agency on Dribbble](https://images.openai.com/static-rsc-4/wK_yH6d422Z6OsMONZHoltzoayGchntHL66GzWzCrQl4GoW1TNtxlqnS9Zynojk6oKp4t6S0HQqMj6mJPuyOS6DynYLQQE5s3345-fNkIObVSDzWbxZxUF_W892ZiYTIgqjqsSHW9Lcj8aW_EHJ2nVS7gu93UKougw2mOnxNaKw?purpose=inline)

**Project 4: Real-Time Collaborative Application**

- Multiple users work on the same task board.
- Broadcast changes to room members.
- Synchronize state.
- Handle disconnections and reconnections.

## **25. Final Revision Notes**

## **The complete picture**

1. **HTTP** is a request-response protocol.
2. **HTTP/1.0** commonly used a separate connection for each request.
3. **HTTP/1.1** introduced persistent connections as the default.
4. **Short polling** repeatedly asks the server for updates.
5. **Long polling** keeps an HTTP request pending until data or a timeout.
6. **HTTP streaming** delivers response data in chunks.
7. **WebSocket** provides persistent, full-duplex communication.
8. **Socket.IO** provides events, rooms, broadcasting, reconnection, and transport fallback.
9. **Socket ID** identifies a connection, not a permanent user.
10. **Rooms** group sockets for targeted communication.
11. **User rooms** allow private messages to reach a user's multiple active connections.
12. **Database persistence** is necessary for reliable offline message delivery.

### **Official documentation and further reading**

1. [WebSocket.org](https://websocket.org/?utm_source=chatgpt.com) — WebSocket fundamentals, examples, and explanations.
2. [Socket.IO v4 Documentation](https://socket.io/docs/v4/?utm_source=chatgpt.com) — Server, client, events, rooms, and broadcasting.
3. [Socket.IO Rooms](https://socket.io/docs/v4/rooms/?utm_source=chatgpt.com) — Room-based communication.
4. [Using Socket.IO with Multiple Nodes](https://socket.io/docs/v4/using-multiple-nodes/?utm_source=chatgpt.com) — Scaling across multiple server instances.
5. [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API?utm_source=chatgpt.com) — Browser-side WebSocket concepts.
6. [MDN WebTransport API](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API?utm_source=chatgpt.com) — Understanding WebTransport.

**The most important concept to remember:** WebSocket solves the problem of continuous two-way communication. Socket.IO builds a convenient application-level system on top of real-time transports, making it easier to manage users, events, rooms, and reconnections.
