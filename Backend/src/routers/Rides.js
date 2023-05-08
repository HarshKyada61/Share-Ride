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

//Find matching Ride
router.post('/Share-Ride/FindRide',auth, async(req, res) => {
    const route = req.body.Route;
    console.log(route);
    try{
        let Rides = await OfferedRide.find({Status:'waiting'})
        let MatchedRides = [];
        Rides.forEach((ride) => {
            if(checkSubset(ride.Route,route)){
                MatchedRides.push(ride)
            }
        })
        // console.log(MatchedRides);
        res.status(200).send(MatchedRides)
    }
    catch(e){
        console.log(e);
        res.status(500).send(e.message)
    }
})

let checkSubset = (parentArray, subsetArray) => {
    const isSubset = subsetArray.every((el) => {
        let pmatch=false
        parentArray.forEach((pEl) => {
            if(Math.abs(el[0] - pEl[0]) <= 0.0005 && Math.abs(el[0] - pEl[0]) <= 0.0005){
                pmatch=true
                return
            }
        })
        return pmatch
    })
    return isSubset
}

export default router