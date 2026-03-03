import { Router } from "express";
import isLogin from "../middlewares/auth.middleware.js";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controller.js";

const router = Router();
router.use(isLogin);
router.post("/create-ticket" , createTicket);
router.get("/get-tickets" , getTickets);
router.get("/get-ticket/:id" , getTicket); 

export default router;
