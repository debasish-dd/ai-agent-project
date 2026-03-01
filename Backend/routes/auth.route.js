
import { Router } from "express";
import { getUsers, login, logoutUser, signup, updateUser } from "../controllers/user.controller.js";
import isLogin from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , isLogin , logoutUser);
router.patch("/update-user", isLogin, updateUser)
router.get("/users", isLogin, getUsers)


export default router