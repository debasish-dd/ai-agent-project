import e from "express";
import cors from "cors"
import "dotenv/config";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/auth.route.js"
import {serve} from "inngest/express" 
import { inngest } from "./inngest/client.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { onSignUp } from "./inngest/functions/on-signup.js";
import ticketRouter from "./routes/ticket.route.js"

const app = e();

app.use(e.urlencoded({extended: true}))
app.use(cors())
app.use(e.json())
app.use(cookieParser())

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/tickets" , ticketRouter)

app.use("/api/inngest" , serve({
    client: inngest,
    functions: [onSignUp, onTicketCreated]
}))


//connecting db
connectDB();



const PORT = process.env.PORT

app.listen(process.env.PORT, ()=>{
    console.log("app is listening to port " , PORT);
    
})