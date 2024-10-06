import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js"
import mailAlert from "../utils/emailAlert.js"
import mongoose from "mongoose";

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (_id) => {
    if (!_id) return null;

    const user = await User.findById(_id);

    if (!user) {
        throw new apiError(404, "user not found")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

const signUp = asyncHandler(async (req, res) => {
    const { fullName, mobileNumber, userName, email, password } = req.body

    if ([fullName, mobileNumber, userName, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(401, "Incomplete user details");
    }

    const alreadyExist = await User.findOne({
        $or: [{ mobileNumber }, { userName }, { email }]
    })

    if (alreadyExist) {
        throw new apiError(400, "this email, mobile number or username already exist")
    }

    const filePath = req.file?.path

    let uploadProfilePicture = null;

    if (filePath) {
        uploadProfilePicture = await uploadToCloudinary(filePath)
        if (!uploadProfilePicture) {
            throw new apiError(500, "somthing went wrong while uploading image")
        }
    }

    const user = await User.create({ fullName, mobileNumber: `+91${mobileNumber}`, userName, email, password, profilePicture: uploadProfilePicture?.url || "" })

    if (!user) {
        throw new apiError(500, "unable to signUp")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new apiResponse(200, user, "User signUp sucessfully"))
})

const logIn = asyncHandler(async (req, res) => {
    const { loginCredintial, password } = req.body

    if (!loginCredintial || !password) {
        throw new apiError(401, "invalid crediantials")
    }

    const correctOrNot = await User.findOne({
        $or: [{ userName: loginCredintial }, { email: loginCredintial }]
    })

    if (!correctOrNot) {
        return res
            .status(200)
            .json(new apiResponse(200, "user not found", "user not found"))
    }

    const passwordCheck = await correctOrNot.changePassword(password)

    if (passwordCheck === false) {
        return res
            .status(400)
            .json(new apiResponse(400, "Password is Wrong", "Your given password is incorrect"))
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(correctOrNot._id)

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new apiResponse(200, correctOrNot, "user logged in successfully"))
})

const logOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        })

    return res
        .status(200)
        .clearCookie("refreshToken", cookieOptions)
        .clearCookie("accessToken", cookieOptions)
        .json(new apiResponse(200, [], "log out successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
        throw new apiError(404, "User not found or somthing went wrong")
    }

    return res
        .status(200)
        .json(new apiResponse(200, user, "user fetched successfully"))
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { password, newPassword, fullName } = req.body
    const profilePicture = req.file?.path

    if (!newPassword && !fullName && !profilePicture) {
        return res.status(200).json(new apiResponse(200, {}, "nothing to update"))
    }

    const user = await User.findById(req.user._id)

    if (password && newPassword) {
        const passwordCheck = await user.changePassword(password)
        if (passwordCheck === false) {
            throw new apiError(401, "password is wrong")
        }
        user.password = newPassword || user.password
    }

    user.fullName = fullName || user.fullName

    let proPicture = null;

    if (req.file?.path) {
        const picPath = req.file.path;
        const upload = await uploadToCloudinary(picPath)
        if (!upload) {
            throw new apiError(500, "failed to update profile picture")
        }
        proPicture = upload.url
    }

    user.profilePicture = proPicture || user.profilePicture

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new apiResponse(200, user, "user details updated successfully"))
})

const resetPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new apiError(400, "email is required to changePassword")
    }

    if (!password) {
        throw new apiError(400, "password is required")
    }

    const user = await User.findOne({ email: email })

    if (!user) {
        throw new apiError(400, "Invalid crediantials")
    }

    user.password = password

    await user.save()

    return res
        .status(200)
        .json(new apiResponse(200, user, "Password changed successfully"))
})

const getUserWebUrls = asyncHandler(async (req, res) => {
    const webUrls = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "weburls",
                localField: "_id",
                foreignField: "userId",
                as: "userWebSites",
                pipeline: [
                    {
                        $project: {
                            Urls: 1,
                            userId: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalWebSites: {
                    $size: "$userWebSites"
                }
            }
        }
    ])

    return res
        .status(200)
        .json(new apiResponse(200, webUrls, "web Urls fetched successfully"))
})

const generateOtp = asyncHandler(async (req, res) => {
    const { email, message, subject } = req.body;

    if (!email) {
        throw new apiError(401, "email is not provided")
    }

    const user = await User.findOne({ "email": email })

    if (!user) {
        return res
            .status(404)
            .json(new apiResponse(404, "User Not Found Tith This Email"))
    }

    const alert = await mailAlert(user, subject, message)

    if (!alert) {
        throw new apiError(500, "Somthing went wrong while sending alert")
    }

    return res
        .status(200)
        .json(new apiResponse(200, alert, "Alert send Successfully"))
})

export { signUp, logIn, logOut, getCurrentUser, updateUserDetails, getUserWebUrls, generateOtp, resetPassword }
