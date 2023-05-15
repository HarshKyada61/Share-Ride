import express from "express";
import auth from "../middleware/auth.js";
import Requests from "../model/Requests.js";
import OfferedRide from "../model/offeredRide.js";

const router = new express.Router();


//Make Request
router.post("/Share-Ride/send_request", auth, async (req, res) => {
    let request = new Requests(req.body);
    try {
        const requestedRide =  await OfferedRide.findById(req.body.RequestedRide)
        request.RequestedTo = requestedRide.user
        request.user = req.user;

        if(requestedRide.Status === 'Full'){
            throw new Error('This Ride is Full!!')
        }
      await request.save();
      res.status(201).send(request._id);
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

  //Show Requsets
  router.get("/Share-Ride/Show_Request",auth, async (req, res) => {
    try{
        let requests = await  Requests.find({RequestedTo: req.user, Status: 'Requested'})
        .populate("user")
        .populate("RequestedTo")
        .populate("OwnRide")
        .exec();
        res.status(200).send(requests)
    }
    catch{
        res.status(400).send(e.message);
    }
  })

  //update Request
  router.patch('/Share-Ride/update_Request/:id',auth, async(req,res) => {
    try{
      const request =  await Requests.findById(req.params['id'])
      const updates = Object.keys(req.body)
          updates.forEach((update) => request[update] = req.body[update]);

          const ride = await OfferedRide.findById(request.RequestedRide)
          
            ride.AvailableSeats = ride.AvailableSeats - 1
            if(ride.AvailableSeats < 1){
                ride.Status = 'Full'
            }
            await ride.save()
         
          await request.save()
          res.status(200).send()
    }
    catch(e){
      console.log(e);
      res.status(400).send(e.message)
  }
  })

  export default router
  