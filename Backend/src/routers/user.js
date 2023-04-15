import express from 'express';
import User from '../model/user.js';
import auth from '../middleware/auth.js'

const router = new express.Router()

//user Signup (create user)
router.post('/Share-Ride/Signup', async (req, res) => {
    let user = await User.findOne({$or:[{Email: req.body.Email, isDeleted: true},{MobileNo: req.body.MobileNo, isDeleted: true}]})
    if(!user){
        user = new User(req.body)
    }
    else{
        const updates = Object.keys(req.body)
        updates.forEach((update) => user[update] = req.body[update]);
        user.isDeleted = false;
    }
    try{
        await user.save();
        const token = await user.generateToken()
        res.status(201).send({token,user});
    }
    catch(e){
        // console.log(e.message);
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


//delete user
router.delete('/Share-Ride/DeleteUser', auth, async(req, res) => {
    
    try{
        req.user['isDeleted'] = true;
        req.user['tokens'] = [];
        await req.user.save()   
        res.status(200).send()

    }catch(e){
        res.status(400).send(e)
    }
})

export default router