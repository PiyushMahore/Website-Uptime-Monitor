import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"

const verifyJwt = asyncHandler(async (req, _, next) => {
    const authorization = req.get("authorization");
    const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    const token = req.cookies?.accessToken || bearer;
    if (!token) throw new apiError(401, "Authentication required");

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN, { algorithms: ["HS256"] });
    } catch {
        throw new apiError(401, "Invalid or expired access token");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) throw new apiError(401, "Invalid access token");
    req.user = user;
    next();
})

export default verifyJwt
