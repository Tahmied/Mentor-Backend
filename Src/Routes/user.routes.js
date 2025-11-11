import { Router } from "express";
import { loginCheck, loginUser, logoutUser, registerUser } from "../Controllers/User.controllers.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', findUser ,logoutUser)
router.get('/logincheck', loginCheck)

export default router