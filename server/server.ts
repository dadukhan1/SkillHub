/** @format */

import app from "./app";
import "dotenv/config";
import http from "http";
import { initSocketServer } from "./sockerServer";

const server = http.createServer(app);

initSocketServer(server);

server.listen(process.env.PORT, () => {
  console.log("Server is running on port : ", process.env.PORT);
});
