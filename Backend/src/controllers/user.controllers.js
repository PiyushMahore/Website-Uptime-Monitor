import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js"
import mongoose from "mongoose";

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async(_id) => {
    if(!_id) return null;

    const user = await User.findById(_id);

    if(!user) {
        throw new apiError(404, "user not found")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
}

const signUp = asyncHandler(async(req, res) => {
    const {fullName, mobileNumber, userName, email, password} = req.body

    if([fullName, mobileNumber, userName, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(401, "Incomplete user details");
    }

    const alreadyExist = await User.findOne({
        $or: [{mobileNumber}, {userName}, {email}]
    })

    if (alreadyExist) {
        throw new apiError(400, "this email, mobile number or username already exist")
    }

    const filePath = req.file?.path
    
    let uploadProfilePicture = null;
    
    if(filePath){
        uploadProfilePicture = await uploadToCloudinary(filePath)
        if (!uploadProfilePicture) {
            throw new apiError(500, "somthing went wrong while uploading image")
        }
    }    

    const user = await User.create({fullName, mobileNumber, userName, email, password, profilePicture: uploadProfilePicture?.url || ""})

    if(!user){
        throw new apiError(500, "unable to signUp")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new apiResponse(200, user, "User signUp sucessfully"))
})

const logIn = asyncHandler(async(req, res) => {
    const {userName, email, password} = req.body

    if((!userName && !email) || !password) {
        throw new apiError(401, "invalid crediantials")
    }

    const correctOrNot = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(!correctOrNot) {
        throw new apiError(404, "user not found")
    }

    const passwordCheck = await correctOrNot.changePassword(password)
    console.log(passwordCheck);
    

    if(passwordCheck === false) {
        throw new apiError(401, "password is wrong")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(correctOrNot._id)

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new apiResponse(200, correctOrNot, "user logged in successfully"))
})

const logOut = asyncHandler(async(req, res) => {
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

const getCurrentUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(!user) {
        throw new apiError(404, "User not found or somthing went wrong")
    }

    return res
    .status(200)
    .json(new apiResponse(200, user, "user fetched successfully"))
})

const updateUserDetails = asyncHandler(async(req, res) => {
    const {password, newPassword, fullName} = req.body
    const profilePicture = req.file?.path

    if(!newPassword && !fullName && !profilePicture) {
        return res.status(200).json(new apiResponse(200, {}, "nothing to update"))
    }

    const user = await User.findById(req.user._id)

    if(password && newPassword) {
        const passwordCheck = await user.changePassword(password)
        if(passwordCheck === false) {
            throw new apiError(401, "password is wrong")
        }
        user.password = newPassword || user.password
    }

    user.fullName = fullName || user.fullName

    let proPicture = null;

    if(req.file?.path) {
        const picPath = req.file.path;
        const upload = await uploadToCloudinary(picPath)
        if(!upload) {
            throw new apiError(500, "failed to update profile picture")
        }
        proPicture = upload.url
    }

    user.profilePicture = proPicture || user.profilePicture

    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new apiResponse(200, user, "user details updated successfully"))
})

const getUserWebUrls = asyncHandler(async(req, res) => {
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

export { signUp, logIn, logOut, getCurrentUser, updateUserDetails, getUserWebUrls }
