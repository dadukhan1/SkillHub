import { Server } from "socket.io";
import http from "http";

export let io: Server | null = null;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  return io;
};