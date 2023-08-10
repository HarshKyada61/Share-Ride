import app from "./app.js";
import "./db/mongoose.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import OfferedRide from "./model/offeredRide.js";
import Ride from "./model/Rides.js";
import socketHnadler from "./socket/socket.js";

dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Listning...... at ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

io.on("connection", (socket) => socketHnadler(io, socket));
