import { Router } from "express";
import { createCourse, getAllCourses, getCourseById } from "../Controllers/Course.controllers.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.get('/getAllCourses', getAllCourses)
router.get('/:courseId', getCourseById)
router.post('/addCourse', findUser, createCourse)

export default router