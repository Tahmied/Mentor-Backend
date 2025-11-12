import { Router } from "express";
import { createCourse, getAllCourses, getCourseById, getMyCourses, updateCourse } from "../Controllers/Course.controllers.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.put('/updateCourse/:courseId', findUser, updateCourse)
router.get('/getAllCourses', getAllCourses)
router.get('/my-courses', findUser, getMyCourses)
router.get('/:courseId', getCourseById)
router.post('/addCourse', findUser, createCourse)


export default router