import express from 'express';
import cors from 'cors';
import userRouter from './routers/user.js'
import vehiclerouter from './routers/vehicles.js'

const app = express();
app.use(express.json());
app.use(cors());
app.use(userRouter)
app.use(vehiclerouter)


export default app