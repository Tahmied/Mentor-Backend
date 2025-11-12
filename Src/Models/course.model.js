import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    thumbnail: {
        type: String, 
        required: [true, 'Thumbnail URL is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        default: 0
    },
    duration: {
        type: String, 
        required: [true, 'Duration is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessons: [lessonSchema] 
}, {
    timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);