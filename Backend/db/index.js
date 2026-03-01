import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log("database connected succesfully!!");
        })
        .catch((err) => {
            console.error("error while connecting with database ->", err);
            process.exit(1);
        });
};

export default connectDB;
