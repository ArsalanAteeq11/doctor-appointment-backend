import mongoose from "mongoose";

const connectdb = async () => {
  await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to database");
  });
};
export default connectdb;
