import { Router } from "express";
import { loginCheck, loginUser, logoutUser, registerUser } from "../Controllers/User.controllers.js";

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/logincheck', loginCheck)

export default router