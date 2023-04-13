import express from 'express';
import User from '../model/user.js';
import auth from '../middleware/auth.js'

const router = new express.Router()

//user Signup
router.post('/Share-Ride/Signup', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save();
        const token = await user.generateToken()
        res.status(201).send({token,user});
    }
    catch(e){
        console.log(e.message);
        res.status(400).send(e.message)
    }
})

//user Login
router.post('/Share-Ride/Login', async (req, res) => {
   
    try{
        const user = await User.findByCredentials(req.body.Email, req.body.Password);
        const token = await user.generateToken()
        res.status(201).send({token,user});
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//get User Details
router.get('/Share-Ride/Profile',auth, async(req, res) => {
    const user = req.user;
    try{
        res.status(200).send(user)
    }
    catch{
        res.status(500).send
    }
})


export default router