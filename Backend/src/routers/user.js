import express from 'express';
import User from '../model/user.js';
import auth from '../middleware/auth.js'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';


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
        await sendMail(req.body.Email,'verify');
        res.status(201).send();
    }
    catch(e){
        res.status(400).send(e.message)
    }
   
})


//verify email
router.get('/Share-Ride/verify/:token',async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const { email } = decoded;

    let user = await User.findOne({Email:email})
    user.status = 'verified'
    await user.save()
    
    res.redirect('http://localhost:4200/auth')
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//send password reset mail
router.post('/Share-Ride/PasswordMail',async (req, res) => {
    let {email} = req.body
    let user = await User.findOne({Email:email})
    if(!user){
        res.status(404).send("This Email Does not Exist")
    }
    else{
        sendMail(email,'resetPassword')
        res.send({message:'email Sent'})
    }
})

//Reset Password
router.patch('/Share-Ride/ResetPassword/:token', async (req,res) => {
    const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const { email } = decoded;

    let user = await User.findOne({Email:email})
    console.log(req.body.password);
    user['Password'] = req.body.password
    await user.save()
    res.status(200).send({message:'Password Updated'})
  }catch(e){
    res.status(400).send(e.message);
  }
})

//sendmail
const sendMail = async (email,action) => {
    const token = jwt.sign({email}, process.env.KEY);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
    });

    let message= {}
    if(action==='verify'){
        message = {
            to: email,
            subject: 'Verify Email',
            html: `<p>Click <a href="http://localhost:3000/Share-Ride/${action}/${token}">here</a> to verify your email.</p>`
          }
    }
    else{
        message = {
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click <a href="http://localhost:4200/${action}/${token}">here</a> to Reset Your Password.</p>`
          }
    }

    const info = await transporter.sendMail(message).catch((e) => {
        console.log(e);
      });

}

//Update user Profile
router.patch('/Share-Ride/Profile/Update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try{
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.status(200).send()
        
    }catch(e){
        res.status(400).send(e.message)
    }
})


//user Login
router.post('/Share-Ride/Login', async (req, res) => {
   
    try{
        const user = await User.findByCredentials(req.body.Email, req.body.Password);
        if(user.status !== 'verified'){
            throw Error ('Email Verification is pending!')
        }
        const token = await user.generateToken()
        res.status(201).send({token,user});
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//user Logout
router.post('/Share-Ride/Logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    }catch(e){
        res.status(500).send()
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
        req.user['status'] = 'pending'
        await req.user.save()   
        res.status(200).send()

    }catch(e){
        res.status(400).send(e)
    }
})

export default router