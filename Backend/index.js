import e from "express";
import cors from "cors"
import "dotenv/config";
import connectDB from "./db/index.js";
// import cookieParser from "cookie-parser";
import userRouter from "./routes/auth.route.js"
import crypto from "crypto"

const app = e();

app.use(e.urlencoded({extended: true}))
app.use(cors())
app.use(e.json())
// app.use(cookieParser())

app.use("/api/v1/users" , userRouter)



//connecting db
connectDB();



const PORT = process.env.PORT

app.listen(process.env.PORT, ()=>{
    console.log("app is listening to port " , PORT);
    
})