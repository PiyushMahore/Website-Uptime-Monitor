import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"

const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new apiError(404, "Unauthorise request")
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new apiError(404, "Invalid token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new apiError(500, error.message || "Somthing went wrong while finding user")
    }
})

export default verifyJwt
