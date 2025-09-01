import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000")

    socket.on("connect", () => {
      console.log("Connected to server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized, call connectSocket() first");
  }
  return socket;
};
