import express from "express";
import dotenv from "dotenv";
import connectdb from "./utils/db.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import appointment from "./routes/appointmentRoutes.js"

dotenv.config({});
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
connectdb();

app.use("/user", userRouter);
app.use("/images",express.static("uploads"))
app.use("/appointment",appointment)
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
