import OfferedRide from "../model/offeredRide.js";
import Requests from "../model/Requests.js";
import Ride from "../model/Rides.js";

const socketHnadler = (io, socket) => {
  socket.on("rideOffered", async (ride) => {
    socket.data.id = ride;
    let offeredRide = await OfferedRide.findById(ride)
      .populate("vehicle")
      .populate("user")
      .exec();
    let Rides = await Ride.find({ Status: "Searching" });
    Rides.forEach(async (ride) => {
      if (checkSubset(offeredRide.Route, ride.Route)) {
        const sockets = await io.fetchSockets();
        sockets.forEach((socket) => {
          if (ride._id == socket.data.id) {
            socket.emit("matchedRideFound", {
              id: offeredRide._id,
              Driver: offeredRide.user.Name,
              VehicleNo: offeredRide.vehicle.VehicleNo,
              Vehicle: offeredRide.vehicle.ModelName,
            });
          }
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

  socket.on("ridetake", async (ride) => {
    socket.data.id = ride;
  });

  socket.on("rideRequested", async (ride, requestedRide) => {
    let request = await Requests.findOne({
      OwnRide: ride,
      RequestedRide: requestedRide,
      Status: "Requested",
    })
      .populate("user")
      .populate("RequestedTo")
      .populate("RequestedRide")
      .populate("OwnRide")
      .exec();

    const sockets = await io.fetchSockets();
    sockets.forEach((socket) => {
      if (
        request.RequestedRide._id == socket.data.id &&
        request.RequestedRide.Status !== "Full"
      ) {
        socket.emit("requestedRides", request);
      }
    });
  });

  socket.on("acceptRide", async (request) => {
    const req = await Requests.findById(request);
    const offeredRide = await OfferedRide.findById(req.RequestedRide)
      .populate("vehicle")
      .populate("user")
      .exec();
    const allRequests = await Requests.find({
      RequestedRide: req.RequestedRide,
    });
    const ride = await Ride.findById(req.OwnRide);
    const sockets = await io.fetchSockets();
    sockets.forEach(async (socket) => {
      if (req.OwnRide == socket.data.id) {
        socket.emit("requestAccepted", offeredRide, ride.OTP, ride.Status);
      }
      if (offeredRide.Status === "Full") {
        const Rides = await Ride.find({ Status: "Searching" });
        Rides.forEach(async (ride) => {
          if (checkSubset(offeredRide.Route, ride.Route)) {
            const sockets = await io.fetchSockets();
            sockets.forEach((socket) => {
              if (ride._id == socket.data.id) {
                socket.emit("rideIsFull", {
                  id: offeredRide._id,
                  Driver: offeredRide.user.Name,
                  VehicleNo: offeredRide.vehicle.VehicleNo,
                  Vehicle: offeredRide.vehicle.ModelName,
                });
              }
            });
          }
        });

        allRequests.forEach((request) => {
          if (
            JSON.stringify(request.OwnRide) !== JSON.stringify(req.OwnRide) &&
            socket.data.id == request.OwnRide
          ) {
            socket.emit("requestDeclined");
          }
        });
      }
    });
  });

  socket.on("declineRide", async (request) => {
    let req = await Requests.findById(request);
    const sockets = await io.fetchSockets();
    const ride = await Ride.findById(req.OwnRide);
    sockets.forEach((socket) => {
      if (req.OwnRide._id == socket.data.id) {
        socket.emit("requestDeclined");
      }
    });
  });

  socket.on("otpVerified", async (rideId) => {
    const ride = await Ride.findById(rideId);
    const sockets = await io.fetchSockets();
    sockets.forEach((socket) => {
      if (rideId == socket.data.id) {
        socket.emit("otpVerifiedSuccess", ride.Status);
      }
    });
  });
};

export default socketHnadler;
