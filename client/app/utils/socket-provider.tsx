"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL!;

export const socket = io(ENDPOINT, {
  transports: ["websocket"],
  autoConnect: false,
});

export default function SocketProvider() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });
  }, []);

  return null;
}
