import { Router } from "express";
import { createCourse, enrollInCourse, getAllCourses, getCourseById, getMyCourses, getMyEnrolledCourses, updateCourse } from "../Controllers/Course.controllers.js";
import { findUser } from "../Middlewares/auth.middleware.js";

const router = Router()

router.put('/updateCourse/:courseId', findUser, updateCourse)
router.get('/getAllCourses', getAllCourses)
router.get('/my-courses', findUser, getMyCourses)
router.get('/:courseId', getCourseById)
router.post('/addCourse', findUser, createCourse)

router.post('/:courseId/enroll', findUser, enrollInCourse)
router.get('/my-enrollments', findUser, getMyEnrolledCourses)


export default router