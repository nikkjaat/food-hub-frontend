import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BACKEND_URL;

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true, // ✅ Allow auto-reconnection
  reconnectionAttempts: 10, // ✅ Retry 10 times before failing
  reconnectionDelay: 2000, // ✅ Wait 2 seconds before retrying
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.io:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected from Socket.io:", reason);
  if (reason === "io server disconnect") {
    socket.connect(); // ✅ Manually reconnect if server disconnects
  }
});

export default socket;
