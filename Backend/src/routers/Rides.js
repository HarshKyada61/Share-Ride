import express from "express";
import auth from "../middleware/auth.js";
import Ride from "../model/Rides.js";
import OfferedRide from "../model/offeredRide.js";
import Requests from "../model/Requests.js";

const router = new express.Router();

//Add Ride Data
router.post("/Share-Ride/TakeRide", auth, async (req, res) => {
  let ride = new Ride(req.body);
  ride.user = req.user;
  try {
    await ride.save();
    res.status(201).send(ride._id);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//get rides of user
router.get("/Share-Ride/GetRide", auth, async (req, res) => {
  const user = req.user._id;
  try {
    const rides = await Ride.find({ user: user });
    res.status(200).send(rides);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//get CurrentRide of user
router.get("/Share-Ride/currentRide", auth, async (req, res) => {
  const user = req.user._id;
  try {
    let currentRide = await Ride.findOne({ user: user, Status: {$nin:['cancelled','Completed']} });
    if (!currentRide) {
      currentRide = await OfferedRide.findOne({
        user: user,
        Status: {$nin:['cancelled','Completed']},
      });
    }

    res.status(200).send(currentRide);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//updateRide
router.patch("/Share-Ride/updateTakenRide/:id", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params["id"]);
    const updates = Object.keys(req.body);
    updates.forEach((update) => (ride[update] = req.body[update]));
    await ride.save();

    if(req.body.Status === 'cancelled'){
        const requests = await Requests.find({OwnRide:req.params["id"],Status:'Requested'}) 
        requests.forEach(async (request) => {
          request.Status = "Withdrawed";
          await request.save();
        });
      }
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//get All rides to pickup
router.get("/Share-Ride/ridesToPickup/:id", auth, async (req, res) => {
  try{
    const rides = await Ride.find({OfferedRide:req.params["id"], Status:{$in:['Started','Booked']}}).populate('user')
    res.status(200).send(rides)
  }catch(e){
    console.log(e);
    res.status(400).send(e.message);
  }
})

router.post("/Share-Ride/validateOTP", auth,async (req, res) => {
  
    const ride_id = req.body.ride
    const ride = await Ride.findById(ride_id);
    const enteredOTP = req.body.enteredOTP

    if(ride.OTP != enteredOTP){
      res.status(406).send('Invalid OTP')
    }
    else{
      ride.OTP = null;
      ride.Status = 'Started'
      await ride.save();
      res.status(200).send()
    }
} )

export default router;
