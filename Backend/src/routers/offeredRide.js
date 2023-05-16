import express from "express";
import auth from "../middleware/auth.js";
import OfferedRide from "../model/offeredRide.js";
import Requests from "../model/Requests.js";

const router = new express.Router();

//Add Offered Ride Data
router.post("/Share-Ride/MakeRide", auth, async (req, res) => {
  let ride = new OfferedRide(req.body);
  ride.user = req.user;
  try {
    await ride.save();
    res.status(201).send(ride._id);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//Find matching Ride
router.post("/Share-Ride/FindRide", auth, async (req, res) => {
  const route = req.body.Route;
  try {
    let Rides = await OfferedRide.find({ Status: "waiting" })
      .populate("vehicle")
      .populate("user")
      .exec();
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
    res.status(200).send(MatchedRides);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
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

//get offeredrides of user
router.get("/Share-Ride/offeredRides", auth, async (req, res) => {
  const user = req.user._id;
  try {
    const rides = await OfferedRide.find({ user: user });
    res.status(200).send(rides);
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "No rides of user." });
  }
});

//updateRide
router.patch("/Share-Ride/updateOfferedRide/:id", auth, async (req, res) => {
  try {
    const ride = await OfferedRide.findById(req.params["id"]);
    const updates = Object.keys(req.body);
    updates.forEach((update) => (ride[update] = req.body[update]));
    await ride.save();

    if(req.body.Status === 'cancelled'){
      const requests = await Requests.find({RequestedRide:req.params["id"],Status:'Requested'}) 
      requests.forEach(async (request) => {
        request.Status = "Declined";
        await request.save();
      });
    }
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

export default router;
