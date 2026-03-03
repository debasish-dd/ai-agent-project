
import { Router } from "express";
import { getUsers, login, logoutUser, signup, updateUser, verifyUser } from "../controllers/user.controller.js";
import isLogin from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , isLogin , logoutUser);
router.patch("/update-user", isLogin, updateUser)
router.get("/get-users", isLogin, getUsers)
router.post("/verify" , verifyUser)

router.get("/check-auth", isLogin, (req, res) => {
  res.status(200).json({ message: "User is authenticated", success: true, user: req.user });
});


export default router