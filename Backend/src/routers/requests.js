import express from "express";
import auth from "../middleware/auth.js";
import Requests from "../model/Requests.js";
import OfferedRide from "../model/offeredRide.js";
import Ride from "../model/Rides.js";
import nodemailer from "nodemailer";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

const router = new express.Router();

//Make Request
router.post("/Share-Ride/send_request", auth, async (req, res) => {
  let request = new Requests(req.body);
  try {
    const requestedRide = await OfferedRide.findById(req.body.RequestedRide);
    request.RequestedTo = requestedRide.user;
    request.user = req.user;

    if (requestedRide.Status === "Full") {
      throw new Error("This Ride is Full!!");
    }
    await request.save();
    res.status(201).send(request._id);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Show Requsets
router.get("/Share-Ride/Show_Request/:id", auth, async (req, res) => {
  try {
    let requests = await Requests.find({
      RequestedRide: req.params["id"],
      Status: "Requested",
    })
      .populate("user")
      .populate("RequestedTo")
      .populate("OwnRide")
      .exec();
    let filteredRequests = requests.filter(
      (request) => request.OwnRide.Status === "Searching"
    );
    res.status(200).send(filteredRequests);
  } catch {
    res.status(400).send(e.message);
  }
});

//get all rides user has requested to
router.get("/Share-Ride/getRequest/:id", auth, async (req, res) => {
  try {
    let requests = await Requests.find({
      OwnRide: req.params["id"],
      Status: "Requested",
    });
    let requestedTo = [];
    requests.forEach((request) => {
      requestedTo.push(request.RequestedRide);
    });
    res.status(200).send(requestedTo);
  } catch {
    res.status(400).send(e.message);
  }
});

//update Request
router.patch("/Share-Ride/update_Request/:id", auth, async (req, res) => {
  try {
    const request = await Requests.findById(req.params["id"]);
    const updates = Object.keys(req.body);
    updates.forEach((update) => (request[update] = req.body[update]));

    if (req.body.Status === "Accepted") {
      const ride = await Ride.findById(request.OwnRide).populate("user");
      if (ride.Status !== "Searching") {
        throw new Error("This Ride is not available");
      }
      ride.OfferedRide = request.RequestedRide;
      ride.Status = "Booked";
      ride.OTP = Math.floor(Math.random() * 9000 + 1000);
      await ride.save();

      // sendMessage(ride.OTP)
      sendMail(ride.user.Email, ride.OTP);

      await request.save();

      const offeredride = await OfferedRide.findById(request.RequestedRide);
      offeredride.AvailableSeats = offeredride.AvailableSeats - 1;
      if (offeredride.AvailableSeats < 1) {
        offeredride.Status = "Full";
        const declineRequests = await Requests.find({
          RequestedRide: offeredride._id,
          Status: "Requested",
        });
        declineRequests.forEach(async (request) => {
          request.Status = "Declined";
          await request.save();
        });
      }
      await offeredride.save();
      console.log(ride);
      res.status(200).send(ride);
    } else {
      const request = await Requests.findById(req.params["id"]);
      const updates = Object.keys(req.body);
      updates.forEach((update) => (request[update] = req.body[update]));
      await request.save();
      res.status(200).send();
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

const sendMail = async (email, OTP) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let message = {
    to: email,
    subject: "Your OTP for Next Ride",
    html: `<p>Your OTP For Next Ride is ${OTP}</p>`,
  };

  const info = await transporter.sendMail(message).catch((e) => {
    console.log(e);
  });
};

//Send SMS
// const sendMessage = (OTP) => {
//   client.messages
//     .create({
//        body: `Your OTP For Next Ride is ${OTP}`,
//        from: '+15075965338',
//        to: '+919510937198'
//      })
//     .then(message => console.log(message.sid));
// }

export default router;
