import dotenv from 'dotenv';
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

dotenv.config({ path: './.env' })

async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { refreshToken } },
            { new: true, validateBeforeSave: false }
        );

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, `Token generation failed: ${err.message}`);
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { email, fullName, password, dpPath } = req.body
    if (!email || !password) {
        throw new ApiError('Email and password are required fields')
    }
    if (await User.findOne({ email })) {
        throw new ApiError(409, 'User already exists')
    }
    let newUser;
    try {
        newUser = await User.create({
            fullName, email, password, dpPath, isInstructor: false
        })
        res.status(200).json(
            new ApiResponse(200, { 'message': 'user registered successfully' }, 'user registered successfully')
        )
    } catch (error) {
        throw new ApiError(500, `unable to register user due to ${error}`)
    }
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.isPassCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const updatedUser = await User.findById(user._id).select('-password -trxPassword -refreshToken');

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };
    return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(200,
                {
                    user: updatedUser,
                    accessToken,
                    refreshToken
                },
                'Login successful'
            )
        );

})

export const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(400, 'Unable to find the user from tokens');
    }
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    return res
        .status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(
            new ApiResponse(200, { message: 'User logged out' }, 'User logout successfully')
        );
});

export const loginCheck = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(400, 'Unable to find the user from tokens');
    }
    return res.status(200).json(new ApiResponse(200, '', 'user is logged in'))
})

export const userDetails = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(400, 'user not found, please login again')
    }
    const data = {
        email: user.email,
        fullName: user.fullName,
        accessToken: req.token,
        dpPath: user.dpPath
    }
    return res.status(200).json(
        new ApiResponse(200, data)
    )
})

export const checkExistingUser = asyncHandler(async (req, res) => {
    const { email } = req.body
    const authHeader = req.headers['authorization'];
    console.log('received ', authHeader)
    if (!authHeader || authHeader !== `Bearer ${process.env.SERVER_SECRET}`) {
        throw new ApiError(403, 'Unauthorized request');
    }
    if (!email) {
        throw new ApiError('email must be given in body')
    }

    const user = await User.findOne({ email })
    if (user) {
        return res.status(200).json(
            new ApiResponse(200, user, 'user found')
        )
    } else {
        return res.status(400).json(
            new ApiResponse(400, {}, 'user not found')
        )
    }
})

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, 'User not authenticated, please login');
    }

    const userData = {
        email: user.email,
        fullName: user.fullName,
        dpPath: user.dpPath
    };

    return res.status(200).json(
        new ApiResponse(200, userData, 'User profile fetched successfully')
    );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, dpPath } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'User not authenticated, please login');
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (dpPath) updateData.dpPath = dpPath;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { 
            new: true, 
            runValidators: true 
        }
    ).select('-password -refreshToken'); 

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, 'Profile updated successfully')
    );
});