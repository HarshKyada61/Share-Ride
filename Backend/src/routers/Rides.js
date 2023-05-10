import express from "express";
import auth from "../middleware/auth.js";
import Ride from "../model/Rides.js";
import OfferedRide from "../model/offeredRide.js";


const router = new express.Router()

//Add Ride Data
router.post('/Share-Ride/TakeRide',auth, async(req, res) => {
    let ride = new Ride(req.body)
    ride.user = req.user
    try{
        await ride.save();
        res.status(201).send();
    }
    catch(e){
        console.log(e);
        res.status(400).send(e.message)
    }
})


export default router