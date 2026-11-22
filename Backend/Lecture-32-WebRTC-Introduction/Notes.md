# **Lecture 32: WebRTC Introduction**

## **1. What is WebRTC?**

**WebRTC** stands for **Web Real-Time Communication**.

It is a technology that allows two or more devices to communicate with each other in real time, especially for:

- Audio calls
- Video calls
- Live communication
- Data sharing

The most important concept behind WebRTC is **Peer-to-Peer (P2P) Communication**.

### **What problem does WebRTC solve?**

Before WebRTC, live communication generally depended on a centralized server.

For example, suppose Person A wants to communicate with Person B.

**Traditional server-based communication**

**Person A**

**Server**

**Person B**

The server receives and forwards communication data.

**Problems with this approach:**

1. The server has to handle a large amount of audio and video data.
2. More server resources are required.
3. Server bandwidth costs increase.
4. It can introduce additional latency.
5. Managing large numbers of simultaneous calls becomes expensive.

### **How does WebRTC solve this?**

WebRTC allows two devices to communicate directly without continuously sending their audio and video through a central server.

This is called **Peer-to-Peer (P2P) Communication**.

**WebRTC Peer-to-Peer communication**

**Person A**

Direct P2P

**Person B**

Audio and video travel directly between peers when a direct connection is possible.

**Important:** WebRTC does not completely eliminate servers. Servers are still needed for connection setup, discovering network information, and situations where direct communication is impossible.

## **2. How Does Peer-to-Peer Communication Work?**

Let's understand this theoretically.

For Person A and Person B to communicate directly, they need to establish a connection.

For this, they need:

1. IP Address of the other device.
2. Port number of the other device.

### **What is an IP Address?**

An **IP Address** is a unique network address used to identify a device on a network.

Example:

```
Person A: 192.168.1.10
Person B: 192.168.1.20
```

### **What is a Port Number?**

A port number identifies a particular communication endpoint on a device.

For example:

```
Person A:
IP Address: 192.168.1.10
Port: 5000

Person B:
IP Address: 192.168.1.20
Port: 6000
```

The IP address identifies the device, while the port identifies the communication endpoint.

### **How do they get each other's IP addresses and port numbers?**

If both devices are connected to the same local network, such as the same Wi-Fi, they can potentially discover and communicate using their local IP addresses.

However, if Person A and Person B are connected to different networks, things become more complicated.

This is where STUN, TURN and ICE come into the picture.

## **3. Understanding Private IP and Public IP Addresses**

Before understanding STUN and TURN servers, we must understand two types of IP addresses.

### **A. Private IP Address**

A private IP address is assigned to a device inside a local network.

For example, when you connect your laptop to Wi-Fi, your router usually assigns it a private IP address.

```
Laptop: 192.168.1.10
Mobile: 192.168.1.11
```

Common private IPv4 ranges:

| Range   | Private IP addresses          |
| ------- | ----------------------------- |
| Class A | 10.0.0.0 – 10.255.255.255     |
| Class B | 172.16.0.0 – 172.31.255.255   |
| Class C | 192.168.0.0 – 192.168.255.255 |

**Why do we need private IP addresses?**

IPv4 uses 32 bits, meaning it supports approximately 4.3 billion possible addresses.

Since billions of devices connect to the internet, private addresses allow multiple devices to use the same private IP ranges inside different local networks.

### **B. Public IP Address**

A public IP address is an address used to identify a network on the public internet.

Usually, your internet service provider (ISP) assigns a public IP address to your router or network connection.

[IPv4 Addressing and Subnetting Fundamentals | by Adem Dikkaya | Apr, 2026 | Medium](https://images.openai.com/static-rsc-4/D4kEV61DE_V70RdFEj3l7Nir9DfkPvDglSMraRZNVzJlT0YugmhRAXTOAhmzY0_OKVyVXw5q0orGXGbtM-F-wQMt1JmnS9Ttce3c7RaWiZvW_I3RlMBkSUlX52snTJe_8D8s2A8yQlX0gyfY8g5DC073ZNX8nCRMJxxIdQaHQcs?purpose=inline)

[medium.com](https://medium.com/%40ademdikkaya/ipv4-addressing-and-subnetting-fundamentals-c0ab59ba59ce?utm_source=chatgpt.com)

For example:

```
Laptop:
Private IP = 192.168.1.10

Mobile:
Private IP = 192.168.1.11

Router:
Public IP = 203.0.113.25
```

Both devices can share the same public IP address because the router uses **NAT (Network Address Translation)** to manage their internet connections.

### **What is NAT?**

NAT is a networking technique that translates private IP addresses and ports into public-facing IP addresses and ports.

It allows multiple devices in a private network to communicate with the internet through a public IP address.

**Problem for WebRTC:**

Person A and Person B may know their private IP addresses, but those addresses are generally not reachable directly from the public internet.

We need a way to discover the public-facing network address.

## **4. STUN Server**

Important concept

**STUN** stands for **Session Traversal Utilities for NAT**.

A STUN server helps a device discover its public-facing IP address and port as observed from outside its local network.

### **Why do we need a STUN server?**

Suppose:

```
Person A:
Private IP: 192.168.1.10
Private Port: 5000

Person B:
Private IP: 192.168.2.10
Private Port: 6000
```

Both devices are behind different routers.

They cannot simply use their private IP addresses to establish a connection over the internet.

**Solution:**

1. Person A sends a request to a STUN server.
2. The STUN server observes the public IP address and port from which the request arrived.
3. The STUN server returns this information to Person A.
4. Person A now knows its public-facing network address.
5. Person B performs the same process.

[Discussion on "Understanding WebRTC Internals (with code) : ICE, STUN, TURN, SDP and NAT — Explained" | Hashnode](https://images.openai.com/static-rsc-4/rwXiTy8AnJoZfGjcJloXdplfgTgrxWTB0nM0iydBVMeZCR8cgpsXOoFB0wwKTkt3azs2YsPn6JQGcavgPS6xfZs2m0BT-2BuE661S3F7atCEMDBSL6w6-WU_csR6eakP7SeqJBbakT6zSJAhELbWjccIdKzIXjKOUQ2X_eZgBpM?purpose=inline)

[hashnode.com](https://hashnode.com/posts/understanding-webrtc-internals-with-code-ice-stun-turn-sdp-and-nat-explained/69baadfa8c55d6eefb1aec86?utm_source=chatgpt.com)

**Important:** A STUN server helps discover network information. It does not normally carry the actual audio and video streams.

Also, STUN does not guarantee that a direct connection will work. Some NAT and firewall configurations prevent direct connections.

## **5. How Does WebRTC Know Whether Data Is Audio or Video?**

This is another important concept.

Computers transmit data in the form of binary values:

```
0 and 1
```

But how does the receiving device understand whether the incoming data represents:

- Audio?
- Video?
- Another type of data?

The answer involves **Codecs and Media Descriptions**.

### **A. What are Codecs?**

A codec is a technology used to encode and decode audio or video data.

The word codec comes from:

- Coder
- Decoder

**Why do we need codecs?**

Raw audio and video data can be very large.

Codecs help compress and encode media into a format that can be transmitted efficiently and decoded by the receiving device.

Examples:

| Media | Common codecs        |
| ----- | -------------------- |
| Audio | Opus, G.711          |
| Video | VP8, VP9, H.264, AV1 |

### **Example**

Suppose Person A is speaking through a microphone.

1. The microphone captures audio.
2. WebRTC processes the audio.
3. An audio codec such as Opus encodes the audio.
4. The encoded data is transmitted.
5. Person B receives the data.
6. The codec decodes it.
7. Person B hears the audio.

The same general process happens with video.

[VP8 vs VP9: Streaming Protocols Explained](https://images.openai.com/static-rsc-4/CIiHRYywp1raW4VwOBqa4Yy2pGO4k1LwHmNns77pBbVlfXeqtSsUs9w1CQIXKO4QFalz3cQzkQEWwJaP3rdUv7idWt9ir0jXiBokF0BYPgrNDDsfEkQC8pvQPfJK_HJpzsq8CT8fdnzSFyKA71OeLJaxzudh1Y26bd5pYemvWUw?purpose=inline)

[fastpix.io](https://www.fastpix.io/blog/vp8-vs-vp9-video-codec-differences?utm_source=chatgpt.com)

**Remember:** Codecs determine how media is encoded and decoded. They are not responsible for discovering whether a network connection is possible.

## **6. Session Description Protocol (SDP)**

**SDP** stands for **Session Description Protocol**.

SDP describes the media capabilities and parameters that two devices want to use for a communication session.

For example, it can describe:

- Whether the communication includes audio.
- Whether it includes video.
- Which codecs are supported.
- Media formats and parameters.
- Network information and transport details.

### **Why is SDP needed?**

Suppose Person A wants to start a video call with Person B.

Person A supports:

```
Audio: Opus
Video: VP8, H.264
```

Person B supports:

```
Audio: Opus
Video: H.264
```

They need to exchange their media capabilities and agree on compatible settings.

SDP helps them describe these capabilities.

### **Offer and Answer**

WebRTC commonly uses an offer/answer process.

**Person A**

Creates an SDP Offer.

Signaling Server

Transfers the offer to Person B

**Person B**

Reads the offer and creates an SDP Answer.

Answer is transferred back to Person A

**Both peers negotiate compatible media settings**

### **What is a Signaling Server?**

A signaling server helps two peers exchange the information needed to establish a WebRTC connection.

It can transfer:

- SDP Offer
- SDP Answer
- ICE Candidates

Common technologies used for signaling include:

- WebSockets
- Socket.IO
- HTTP-based communication

**Important distinction:**

WebRTC does not provide its own signaling server. Developers must implement or use a signaling mechanism.

The signaling server helps establish the connection, but it does not have to carry the actual audio and video.

## **7. TURN Server**

Important concept

**TURN** stands for **Traversal Using Relays around NAT**.

A TURN server acts as a relay when two devices cannot establish a direct peer-to-peer connection.

### **Why do we need a TURN server?**

Let's say Person A and Person B are connected to different networks.

They try to establish a direct connection using their network information.

However, some routers, firewalls, or restrictive NAT configurations prevent direct communication.

What happens then?

The TURN server provides an alternative.

Instead of communicating directly, both peers send and receive media through the TURN server.

**Communication using a TURN server**

**Person A**

**TURN Server**

Media relay

**Person B**

The TURN server relays media between the two devices.

### **STUN vs TURN**

| STUN                                 | TURN                                                    |
| ------------------------------------ | ------------------------------------------------------- |
| Discovers public-facing IP and port  | Relays media data                                       |
| Helps establish direct communication | Provides an alternative when direct communication fails |
| Usually does not carry media         | Carries media                                           |
| Generally less bandwidth-intensive   | Can consume significant bandwidth                       |

**Real-life example:**

Imagine two people trying to communicate through a closed door.

- STUN helps them discover where the door is and how their network appears externally.
- If they cannot communicate directly, TURN acts as a middleman who relays their communication.

## **8. What Happens When We Have Multiple Users in a Video Call?**

So far, we have discussed communication between two people.

But what happens when three, four, or even hundreds of people join a meeting?

Let's understand the problem.

### **The problem with Peer-to-Peer communication**

Suppose four people are participating in a video call.

In a full mesh P2P architecture, every participant sends their media directly to every other participant.

[WebRTC Architecture Basics: P2P, SFU, MCU, and Hybrid Approaches | by Mukund Iyengar | SecureMeeting | Medium](https://images.openai.com/static-rsc-4/h8pG8S5mjEy7Y9DQPsOv7oeJJR8lbXHWjIUPN30KnDXGA77lxLrTspgALEYl7xf8m8ZpZfKfMYQnUiZarDXDQPHSQvgEi1Sx9zvMAln14eYoEsKXqbHvLsVpYPQ0e5uth9Obnz3rtVUK-3lMJ-godflPdW-YUHbyrzxoH9Lp12s?purpose=inline)

[medium.com](https://medium.com/securemeeting/webrtc-architecture-basics-p2p-sfu-mcu-and-hybrid-approaches-6e7d77a46a66?utm_source=chatgpt.com)

For four participants:

- Person A sends media to B, C and D.
- Person B sends media to A, C and D.
- Person C sends media to A, B and D.
- Person D sends media to A, B and C.

Each participant needs to upload three separate streams.

### **Why is this a problem?**

1. Upload bandwidth requirements increase.
2. CPU and memory usage increase.
3. Network management becomes difficult.
4. Performance decreases as the number of participants grows.

For \\(N\\) participants, each participant maintains \\(N-1\\) connections.

The total number of peer connections is:

\\[ \frac{N(N-1)}{2} \\]

For example:

| Participants | Total connections |
| ------------ | ----------------- |
| 2            | 1                 |
| 3            | 3                 |
| 4            | 6                 |
| 10           | 45                |
| 100          | 4,950             |

This architecture does not scale well for large meetings.

**Solution:** Use a centralized media server.

## **9. SFU (Selective Forwarding Unit)**

SFU stands for **Selective Forwarding Unit**.

It is a media server architecture used in group video calls.

Instead of every participant sending media directly to every other participant, each participant sends their media to the SFU.

The SFU then forwards the received media streams to the other participants.

[P2P, SFU and MCU - WebRTC Architectures Explained](https://images.openai.com/static-rsc-4/VUdJdiotTk9ibdS1aipw3MuyqeWyEVAK3QWR7MNuns1wZBxMY8QXADh5thAZm9qBYe8GYG6ocGnwCU1t3KNd7IzAAdR9204R5mO6f0sgc4S9OaDpf7W6oG6lC3lAxz7KFjYploFkWb7AcKZQBgSeJ0cpsKrl4puI-UD8sP5WM3M?purpose=inline)

[digitalsamba.com](https://www.digitalsamba.com/blog/p2p-sfu-and-mcu-webrtc-architectures-explained?utm_source=chatgpt.com)

### **How does SFU work?**

Suppose four people join a video conference.

1. Person A sends their video stream to the SFU.
2. Person B sends their video stream to the SFU.
3. Person C sends their video stream to the SFU.
4. Person D sends their video stream to the SFU.
5. The SFU forwards the appropriate streams to the participants.

### **Upload and Download in SFU**

Let's understand this with three participants.

Each participant sends one media stream to the SFU and receives streams from the other two participants.

| Participant | Upload   | Download  |
| ----------- | -------- | --------- |
| A           | 1 stream | 2 streams |
| B           | 1 stream | 2 streams |
| C           | 1 stream | 2 streams |

Key concept

In SFU, each participant generally uploads one stream rather than uploading a separate copy to every other participant.

The SFU forwards media without normally decoding and recompressing every stream.

### **Does SFU perform compression?**

Generally, an SFU forwards encoded media streams without decoding and re-encoding them.

However, an SFU may perform operations such as:

- Selecting different video layers.
- Forwarding a lower-resolution stream.
- Changing which participants receive particular streams.

These features help manage bandwidth.

### **How can a device handle multiple video streams?**

Suppose 100 people join a meeting.

Does every participant need to display all 100 video streams?

No.

In most meetings:

- Only a few participants turn on their cameras.
- Other participants may keep their cameras off.
- The interface displays only selected participants.
- Some video streams may be received at lower resolutions.
- Participants who are not visible may have their streams paused or deprioritized.

This reduces the processing and bandwidth requirements.

**Important:** SFU helps scale group communication, but it does not eliminate bandwidth or processing costs.

## **10. SFU vs MCU**

There are two important media-server architectures used in group communication.

### **A. SFU (Selective Forwarding Unit)**

- Receives media streams from participants.
- Forwards selected streams to other participants.
- Generally does not decode and recompress every stream.
- Each participant handles the decoding and displaying of received streams.

### **B. MCU (Multipoint Control Unit)**

- Receives media streams from multiple participants.
- Decodes and combines them into one or more composite streams.
- Encodes the combined output.
- Sends the combined media back to participants.

[Achieving <100 ms Latency for Remote Control with WebRTC](https://images.openai.com/static-rsc-4/hHZGy0p-NxME1kBx461x5L1UHupj8cnPxYnhSilogHIoVDpN_aeBEbibclp7WTSt6qt98bdq3PdnmtentnfQYf80DwbLSe0dGTIa-AUrC26VVY4iw4LxaR6iNUan5UdzF_JsuMdnh5AFmV2XLqF8ntwv0bQqCMcCVJruyqOiVJs?purpose=inline)

**SFU**

Forwards individual streams.

[WebRTC Architecture Basics: P2P, SFU, MCU, and Hybrid Approaches | by Mukund Iyengar | SecureMeeting | Medium](https://images.openai.com/static-rsc-4/XrVk5knIvrP4zkiKNuUbxfiWRBIAb2td3_Bev7OnSQQJV-wyoKY0gvLroFkWcVYXPBy2I9ZKLMorZkwlZLBL_0jTSpdacyyPsW-NYXIy7rOPf2U6kKNinxnwYnkpf4Iz7h6dXRc5FpisJNtSnlRuYhJPhKUowsWoZZW6Dsz9TAw?purpose=inline)

**MCU**

Combines streams into composite media.

| Feature           | SFU                    | MCU                        |
| ----------------- | ---------------------- | -------------------------- |
| Media processing  | Mostly forwarding      | Decoding and mixing        |
| Compression       | Usually no re-encoding | Usually re-encodes         |
| Server CPU        | Generally lower        | Generally higher           |
| Client processing | More                   | Less                       |
| Scalability       | Good                   | Depends on server capacity |

## **11. Understanding Private Ports, Public Ports and TURN**

Let's connect everything we have learned.

Suppose Person A is using a laptop connected to a router.

```
Laptop:
Private IP: 192.168.1.10
Private Port: 5000

Router:
Public IP: 203.0.113.25
Public Port: 62000
```

When the laptop sends data through its router, NAT can translate its private IP and port into a public-facing IP and port.

For example:

```
Private Endpoint:
192.168.1.10:5000

        |
        | NAT Translation
        v

Public Endpoint:
203.0.113.25:62000
```

The public-facing port may be different from the private port.

### **How does TURN help?**

If direct communication is not possible, the TURN server allocates a relay address.

For example:

```
TURN Relay Address:
198.51.100.10:7000
```

The peer can use this relay address to send media through the TURN server.

**Remember these three terms:**

- Private endpoint: Local IP address and port.
- Public endpoint: Public-facing IP address and port.
- Relay endpoint: Address allocated by a TURN server.

## **12. ICE (Interactive Connectivity Establishment)**

Connects all previous concepts

**ICE** stands for **Interactive Connectivity Establishment**.

ICE is a framework used by WebRTC to discover and test possible network paths between two peers.

### **What is an ICE Candidate?**

An ICE Candidate is a possible network address and port through which a peer may be reachable.

WebRTC gathers different candidates and tries to establish a working connection.

There are three important types.

### **A. Host Candidate**

This represents the device's local network address.

Example:

```
192.168.1.10:5000
```

It is discovered from the device's network interfaces.

### **B. Server Reflexive Candidate (srflx)**

This represents the public-facing address discovered using a STUN server.

Example:

```
203.0.113.25:62000
```

### **C. Relay Candidate (relay)**

This represents an address allocated by a TURN server.

Example:

```
198.51.100.10:7000
```

### **Comparison**

| Candidate        | Obtained from           | Purpose                    |
| ---------------- | ----------------------- | -------------------------- |
| Host             | Local network interface | Direct local connectivity  |
| Server Reflexive | STUN server             | Public-facing connectivity |
| Relay            | TURN server             | Relayed connectivity       |

### **How does ICE work?**

1. Person A gathers its ICE candidates.
2. Person B gathers its ICE candidates.
3. They exchange candidates through the signaling server.
4. ICE checks possible candidate pairs.
5. It tests which paths can establish connectivity.
6. A suitable working path is selected.

[WebRTC Infrastructure Guide 2026: Signalling, SFU & Scaling at Enterprise Load](https://images.openai.com/static-rsc-4/PNt2izZF-4F25RvWy6cN5iod_qfZV88lOnHscQU3FHJZhWNea75oWQvZi7M0dvB27JMX3Ky0-QdoHwC6g4kC_bEkyx6arIAznl7LE5UbmU6leW_OrSoTIVzHhm0U3XaJaK6KvD9fOdAcrCOHWcNGO8htzWRDwVf1QmfNCImelOk?purpose=inline)

[rtcleague.com](https://rtcleague.com/blogs/webrtc-infrastructure?utm_source=chatgpt.com)

**Important:** ICE does not simply choose the first IP address it finds. It performs connectivity checks to determine which candidate pair can actually communicate.

# **13. Complete WebRTC Communication Flow**

Now let's connect all the concepts into one complete example.

Suppose Person A wants to make a video call with Person B.

## **WebRTC connection lifecycle**

1. **Media capture**

   Person A allows access to their camera and microphone.

2. **Create SDP Offer**

   Person A creates an SDP Offer describing audio, video and supported codecs.

3. **Signaling**

   The offer is sent to Person B through a signaling server.

4. **Create SDP Answer**

   Person B receives the offer and creates an SDP Answer.

5. **ICE Candidate Gathering**

   Both devices gather Host, Server Reflexive and Relay candidates.

6. **STUN and TURN**

   STUN helps discover public-facing network information. TURN provides relay addresses when necessary.

7. **Candidate Exchange**

   Both peers exchange ICE candidates through signaling.

8. **Connectivity Checks**

   ICE tests possible network paths.

9. **Connection Established**

   A suitable connection is selected.

10. **Audio and Video Transmission**

    Encoded media is transmitted between peers, normally using SRTP for secure media transport.

## **14. Technologies and Their Responsibilities**

This table is especially important for remembering the difference between each concept.

| Technology | Full form                              | Main responsibility                                 |
| ---------- | -------------------------------------- | --------------------------------------------------- |
| WebRTC     | Web Real-Time Communication            | Real-time communication                             |
| P2P        | Peer-to-Peer                           | Direct communication between devices                |
| NAT        | Network Address Translation            | Translates private and public network endpoints     |
| STUN       | Session Traversal Utilities for NAT    | Discovers public-facing address                     |
| TURN       | Traversal Using Relays around NAT      | Relays media when direct communication fails        |
| SDP        | Session Description Protocol           | Describes media capabilities and session parameters |
| ICE        | Interactive Connectivity Establishment | Finds and tests possible network paths              |
| SFU        | Selective Forwarding Unit              | Forwards media streams                              |
| MCU        | Multipoint Control Unit                | Combines media streams                              |
| Codec      | Coder-Decoder                          | Encodes and decodes media                           |

# **15. Practical Project: Building a WebRTC Video Calling Application**

After understanding the theory, you can build a simple video-calling application using JavaScript.

**Example technology stack:**

- Frontend: React
- Backend: Node.js + Express
- Signaling: Socket.IO
- Real-time communication: WebRTC
- STUN/TURN: STUN server and TURN service

### **Basic architecture**

[The basics of building a peer to peer video call: A guide for devs | WebRTC flow | Sendbird](https://images.openai.com/static-rsc-4/zsO0IwmD0aKGdj3sDEO4kRuMRXGKgk9r3j1sfZg5bJgakpXmD3khHEMSMzVEGPmGzB3mFHk96BLwWqvEGC8X9bo1GK-q19orVgE4iCyoYVscPo3WlOvoWpRP1kpbz77240d64YCyrkprTxvt7Nail1NL1B_L_gJ94JFIcRrK2_E?purpose=inline)

[sendbird.com](https://sendbird.com/developer/tutorials/the-basics-of-building-a-peer-to-peer-video-call?utm_source=chatgpt.com)

### **Important WebRTC JavaScript APIs**

| API                                     | Purpose                      |
| --------------------------------------- | ---------------------------- |
| `navigator.mediaDevices.getUserMedia()` | Access camera and microphone |
| `RTCPeerConnection`                     | Establish a peer connection  |
| `createOffer()`                         | Create an SDP Offer          |
| `createAnswer()`                        | Create an SDP Answer         |
| `setLocalDescription()`                 | Set local SDP information    |
| `setRemoteDescription()`                | Set remote SDP information   |
| `addIceCandidate()`                     | Add a received ICE Candidate |

### **Small code example**

Accessing the camera and microphone:

```
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
});
```

Creating a peer connection:

```
const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
});
```

Adding audio and video tracks:

```
stream.getTracks().forEach((track) => {
  peerConnection.addTrack(track, stream);
});
```

This is only the beginning. A complete application also needs signaling, SDP exchange, ICE candidate exchange, remote media handling and appropriate error handling. A production application should also configure a reliable TURN service.

# **16. Common Misconceptions**

**1. Does WebRTC mean there is no server?**

No. WebRTC still uses servers for signaling and sometimes STUN, TURN or media forwarding.

**2. Does STUN transmit audio and video?**

No. STUN helps discover public-facing network information.

**3. Does TURN establish direct communication?**

No. TURN relays media through a server.

**4. Does SDP establish the network connection?**

No. SDP describes the session and media capabilities. ICE handles network path discovery and connectivity checks.

**5. Does SFU compress every video stream?**

No. An SFU generally forwards encoded streams without decoding and re-encoding them.

**6. Is WebRTC only for video calling?**

No. It also supports audio communication and real-time data channels.

# **17. Interview Questions and Answers**

### **Q1. What is WebRTC?**

WebRTC is a technology that enables real-time audio, video and data communication between devices, commonly using peer-to-peer connections.

### **Q2. Why do we need STUN?**

STUN helps a device discover its public-facing IP address and port when it is behind NAT.

### **Q3. What is the difference between STUN and TURN?**

STUN helps discover network information, while TURN relays media when a direct connection cannot be established.

### **Q4. What is SDP?**

SDP describes the media capabilities and parameters of a communication session, including supported codecs and media types.

### **Q5. What is ICE?**

ICE is a framework that gathers and tests possible network paths to establish a connection between peers.

### **Q6. What is an ICE Candidate?**

An ICE Candidate is a possible IP address and port through which a device may be reachable.

### **Q7. Why is SFU used?**

SFU is used in group video calls to forward media streams efficiently without requiring every participant to establish a separate connection with every other participant.

### **Q8. What is the difference between SFU and MCU?**

SFU forwards individual encoded media streams, whereas MCU combines multiple media streams into composite output.

### **Q9. Does WebRTC require a signaling server?**

WebRTC does not define or provide a signaling server. An application needs a signaling mechanism to exchange SDP and ICE information.

### **Q10. What is NAT?**

NAT translates private network addresses and ports into public-facing network addresses and ports, allowing multiple devices to share internet connectivity.

# **18. Final Revision: Understand the Big Picture**

## **WebRTC concept map**

**WebRTC**

Real-time communication

**Signaling**

- SDP Offer
- SDP Answer
- ICE exchange

**Connectivity**

- ICE
- STUN
- TURN

**Media**

- Audio
- Video
- Codecs
- SRTP

**Group calls**

- P2P Mesh
- SFU
- MCU

## **Test Your Understanding**

Try answering these questions without looking at the notes.

**5 conceptual questions**

0/5 answered

**1. What is the primary purpose of a STUN server?**

To compress video

To discover the public-facing network address

To combine video streams

**2. When is a TURN server needed?**

When direct peer connectivity fails

Whenever a user opens a camera

To create an SDP offer

**3. What does SDP describe?**

Only the user's public IP

Media capabilities and session parameters

The number of users in a meeting

**4. What is the responsibility of ICE?**

Compress media

Test possible network paths

Forward all video streams

**5. Why is SFU useful for group calls?**

It removes the need for all servers

It forwards media streams to participants

It combines every stream into one video

Check answers

**The most important thing to remember:** WebRTC is not simply a technology that removes servers. It separates the responsibilities of signaling, network discovery, media transmission and media forwarding. Understanding these separate responsibilities is the foundation of building real-time communication applications.
