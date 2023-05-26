import app from "./app.js";
import "./db/mongoose.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import OfferedRide from "./model/offeredRide.js";
import Ride from "./model/Rides.js";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Listning...... at ${PORT}`);
});

io.on("connection", (socket) => {
  // console.log('A user connected');
  socket.on("rideOffered", async (ride) => {
    let offeredRide = await OfferedRide.findById(ride);
    let Rides = await Ride.find({ Status: "Searching" });
    let MatchedRides = [];
    Rides.forEach((ride) => {
      if (checkSubset(ride.Route, route)) {
        MatchedRides.push({
          id: ride._id,
          Driver: ride.user.Name,
          VehicleNo: ride.vehicle.VehicleNo,
          Vehicle: ride.vehicle.ModelName,
        });
      }
    });
  });

  let checkSubset = (parentArray, subsetArray) => {
    const isSubset = subsetArray.every((el) => {
      let pmatch = false;
      parentArray.forEach((pEl) => {
        if (
          Math.abs(el[0] - pEl[0]) <= 0.0005 &&
          Math.abs(el[0] - pEl[0]) <= 0.0005
        ) {
          pmatch = true;
          return;
        }
      });
      return pmatch;
    });
    return isSubset;
  };
});
