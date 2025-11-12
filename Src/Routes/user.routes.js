import { Router } from "express";
import { checkExistingUser, getUserProfile, loginCheck, loginUser, logoutUser, registerUser, updateUserProfile, userDetails } from "../Controllers/User.controllers.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', findUser ,logoutUser)
router.get('/logincheck', loginCheck)
router.get('/me', findUser, userDetails)
router.post('/checkExistingUser', checkExistingUser)

router.get('/profile', findUser, getUserProfile)
router.post('/update-profile', findUser, updateUserProfile)

export default router