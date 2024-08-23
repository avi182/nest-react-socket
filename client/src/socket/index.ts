import { io } from "socket.io-client";

const SOCKET_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

export const socket = io(SOCKET_BASE_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
