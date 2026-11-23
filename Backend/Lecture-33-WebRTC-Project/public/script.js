// ====== Getting Elements ======
// Videos
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Incoming call alert
const incomingCall = document.getElementById("incomingCall");
const acceptBtn = document.getElementById("acceptBtn");
const rejectBtn = document.getElementById("rejectBtn");

// Controls
const startBtn = document.getElementById("startBtn");
const callBtn = document.getElementById("callBtn");
const hangupBtn = document.getElementById("hangupBtn");

let localStream;
let pc;
let currentOffer = null;
let pendingCandidates = [];
const socket = io();

const iceServers = {
  iceServers: [
    {
      urls: "stun:global.stun.twilio.com:3478",
    },
    {
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
      username:
        "08dbef406508df8e839385c0b18945c4247508bcdc81eabbdde1fcfe6d4540a3",
      credential: "QasuJGIGQGikfLzogOJwrNVDpNrG4YtjjpzXtHCdVQw=",
    },
  ],
};

// ====== Signaling listeners ======
socket.on("offer", handleIncomingOffer);
socket.on("answer", handleAnswer);
socket.on("candidate", handleCandidate);
socket.on("reject", handleReject);

// ====== Helpers ======
function setupPeer() {
  pc = new RTCPeerConnection(iceServers);

  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) {
      socket.emit("candidate", candidate);
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log("ICE state:", pc?.iceConnectionState);
  };

  return pc;
}

async function flushPendingCandidates() {
  while (pc && pendingCandidates.length) {
    const c = pendingCandidates.shift();
    try {
      await pc.addIceCandidate(new RTCIceCandidate(c));
    } catch (err) {
      console.error("addIceCandidate (flush) error:", err);
    }
  }
}

function resetState() {
  if (pc) {
    pc.close();
    pc = null;
  }
  remoteVideo.srcObject = null;
  pendingCandidates = [];
  currentOffer = null;
  incomingCall.classList.add("hidden");
}

// ====== 1. Start Camera ======
startBtn.onclick = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });
    localVideo.srcObject = localStream;
    callBtn.disabled = false;
    startBtn.disabled = true;
  } catch (err) {
    console.error("Camera error:", err);
    alert("Could not access camera/microphone. Please check permissions.");
  }
};

// ====== 2. Incoming call (receiver) ======
function handleIncomingOffer(offer) {
  currentOffer = offer;
  incomingCall.classList.remove("hidden");
}

// ====== 3. Start Call (caller) ======
callBtn.onclick = async () => {
  if (!localStream) {
    alert("Start your camera first.");
    return;
  }

  callBtn.disabled = true;
  hangupBtn.disabled = false;

  setupPeer();

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", pc.localDescription);
  } catch (err) {
    console.error("Offer error:", err);
  }
};

// ====== 4. Accept incoming call (receiver) ======
acceptBtn.onclick = async () => {
  if (!currentOffer) return;

  incomingCall.classList.add("hidden");
  hangupBtn.disabled = true; // enable once PC is ready

  if (!localStream) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      localVideo.srcObject = localStream;
      startBtn.disabled = true;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not start camera for the call");
      currentOffer = null;
      return;
    }
  }

  setupPeer();
  hangupBtn.disabled = false;

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  try {
    await pc.setRemoteDescription(currentOffer);
    await flushPendingCandidates();
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", answer);
  } catch (err) {
    console.error("Answer error:", err);
  }

  currentOffer = null;
};

// ====== 5. Reject incoming call ======
rejectBtn.onclick = () => {
  currentOffer = null;
  incomingCall.classList.add("hidden");
  socket.emit("reject");
};

function handleReject() {
  console.log("Call rejected by peer");
  resetState();
  hangupBtn.disabled = true;
  callBtn.disabled = false;
}

// ====== 6. Handle answer (caller) ======
async function handleAnswer(answer) {
  if (!pc) return;
  try {
    await pc.setRemoteDescription(answer);
    await flushPendingCandidates();
  } catch (err) {
    console.error("setRemoteDescription (answer) error:", err);
  }
}

// ====== 7. Handle ICE candidates ======
function handleCandidate(candidate) {
  if (pc && pc.remoteDescription && pc.remoteDescription.type) {
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
      console.error("addIceCandidate error:", err),
    );
  } else {
    pendingCandidates.push(candidate); // buffer
  }
}

// ====== 8. End Call ======
hangupBtn.onclick = () => {
  resetState();

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
    localVideo.srcObject = null;
  }

  hangupBtn.disabled = true;
  callBtn.disabled = true;
  startBtn.disabled = false;
};

// ====== Cleanup ======
window.onbeforeunload = () => {
  socket.disconnect();
  if (pc) pc.close();
};
