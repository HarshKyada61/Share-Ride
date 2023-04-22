import express from 'express';
import Vehicles from '../model/vehicles.js';
import auth from '../middleware/auth.js'

const router = new express.Router()


router.post('/Share-Ride/Add-Vehicle', auth, async (req, res) => {
    
    try{
        const vehicle = new Vehicles(req.body)
        vehicle.user = req.user._id
        await vehicle.save();
        res.status(201).send(vehicle);
    }
    catch(e){
        res.status(400).send(e.message)
    }
    
})


router.get('/Share-Ride/Vehicles',auth, async(req, res) => {
    try{
        const vehicles = await Vehicles.find({user:req.user._id})
        res.status(200).send(vehicles)
    }
    catch{
        res.status(500).send
    }
    
})

export default router