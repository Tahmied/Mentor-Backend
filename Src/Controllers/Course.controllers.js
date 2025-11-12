import { Course } from "../Models/course.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

export const createCourse = asyncHandler(async (req, res) => {
    const { title, description, thumbnail, price, duration, category, lessons } = req.body;
    const instructorId = req.user?._id

    const instructor = req.user
    
    if (instructor.isInstructor !== true) {
        instructor.isInstructor = true
        await instructor.save({ validateBeforeSave: false })
    }
    if (!instructorId) {
        throw new ApiError(401, 'User not authenticated')
    }

    if (!title || !description || !thumbnail || !price || !duration || !category) {
        throw new ApiError(400, 'All course detail fields are required');
    }

    if (!lessons || !Array.isArray(lessons)) {
        throw new ApiError(400, 'Lessons are required');
    }

    const newCourse = await Course.create({
        title,
        description,
        thumbnail,
        price,
        duration,
        category,
        lessons,
        instructor: instructorId
    });

    return res.status(201).json(
        new ApiResponse(201, newCourse, 'Course created successfully')
    );
});

export const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({})
        .populate('instructor', 'fullName dpPath')

    const formattedCourses = courses.map(course => ({
        _id: course._id,
        title: course.title,
        category: course.category,
        thumbnail: course.thumbnail,
        price: course.price,
        lessons: course.lessons.length,
        instructor: course.instructor

    }));

    return res.status(200).json(
        new ApiResponse(200, formattedCourses, 'Courses fetched successfully')
    );
});

export const getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) {
        throw new ApiError(400, 'Course ID is required');
    }

    const course = await Course.findById(courseId)
        .populate('instructor', 'fullName dpPath');

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }
    return res.status(200).json(
        new ApiResponse(200, course, 'Course details fetched successfully')
    );
});

export const getMyCourses = asyncHandler(async (req, res) => {
    const instructorId = req.user?._id

    if (!instructorId) {
        throw new ApiError(401, 'User not authenticated');
    }
    const courses = await Course.find({ instructor: instructorId })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, courses, 'User\'s courses fetched successfully')
    );
});

export const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    if (!courseId) {
        throw new ApiError(400, 'Course ID is required');
    }

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    if (course.instructor.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to edit this course');
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedCourse) {
        throw new ApiError(500, 'Failed to update the course');
    }
    return res.status(200).json(
        new ApiResponse(200, updatedCourse, 'Course updated successfully')
    );
});
