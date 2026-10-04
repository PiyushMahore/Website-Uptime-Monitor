import crypto from "node:crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { WebUrl } from "../models/webUrl.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import mailAlert from "../utils/emailAlert.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
};

const setTokenCookies = (res, tokens) => res
    .cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

const generateAccessAndRefreshToken = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.hashRefreshToken(refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

const signUp = asyncHandler(async (req, res) => {
    const fullName = typeof req.body.fullName === "string" ? req.body.fullName.trim() : "";
    const userName = typeof req.body.userName === "string" ? req.body.userName.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const mobileNumber = typeof req.body.mobileNumber === "string" ? req.body.mobileNumber.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!fullName || !userName || !email || !mobileNumber || !password) throw new apiError(400, "Full name, username, email, mobile number, and password are required");
    if (password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) throw new apiError(400, "Password must be at least 8 characters long and include a letter and a number");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new apiError(400, "Enter a valid email address");
    if (await User.exists({ $or: [{ userName }, { email }, { mobileNumber }] })) {
        throw new apiError(409, "Email, mobile number, or username is already in use");
    }

    let profilePicture = "";
    if (req.file?.path) {
        const uploaded = await uploadToCloudinary(req.file.path);
        if (!uploaded) throw new apiError(502, "Profile image upload failed");
        profilePicture = uploaded.url;
    }

    const user = await User.create({ fullName, userName, email, mobileNumber, password, profilePicture });
    const tokens = await generateAccessAndRefreshToken(user);
    setTokenCookies(res, tokens);
    return res.status(201).json(new apiResponse(201, user, "Account created"));
});

const logIn = asyncHandler(async (req, res) => {
    const credential = typeof req.body.loginCredintial === "string" ? req.body.loginCredintial.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!credential || !password) throw new apiError(400, "Username/email and password are required");
    const user = await User.findOne({ $or: [{ userName: credential }, { email: credential.toLowerCase() }] });
    if (!user || !(await user.changePassword(password))) throw new apiError(401, "Invalid username/email or password");
    const tokens = await generateAccessAndRefreshToken(user);
    setTokenCookies(res, tokens);
    return res.status(200).json(new apiResponse(200, user, "Logged in successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) throw new apiError(401, "Refresh token is required");
    let decoded;
    try { decoded = jwt.verify(token, process.env.REFRESH_TOKEN, { algorithms: ["HS256"] }); }
    catch { throw new apiError(401, "Invalid or expired refresh token"); }
    const user = await User.findById(decoded._id);
    const storedHash = user?.refreshToken && /^[a-f\d]{64}$/i.test(user.refreshToken) ? Buffer.from(user.refreshToken, "hex") : Buffer.alloc(32);
    const suppliedHash = crypto.createHash("sha256").update(token).digest();
    const refreshTokenValid = crypto.timingSafeEqual(storedHash, suppliedHash) && Boolean(user?.refreshToken);
    if (!refreshTokenValid) throw new apiError(401, "Refresh token has been revoked");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const rotated = await User.updateOne(
        { _id: user._id, refreshToken: user.refreshToken },
        { $set: { refreshToken: crypto.createHash("sha256").update(refreshToken).digest("hex") } }
    );
    if (rotated.modifiedCount !== 1) throw new apiError(401, "Refresh token has already been rotated");
    const tokens = { accessToken, refreshToken };
    setTokenCookies(res, tokens);
    return res.status(200).json(new apiResponse(200, {}, "Session refreshed"));
});

const logOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    return res.clearCookie("refreshToken", cookieOptions).clearCookie("accessToken", cookieOptions)
        .status(200).json(new apiResponse(200, {}, "Logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new apiResponse(200, req.user, "User fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { password, newPassword, fullName, mobileNumber, userName, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) throw new apiError(404, "User not found");

    if (newPassword !== undefined) {
        if (typeof newPassword !== "string" || typeof password !== "string") throw new apiError(400, "Current and new passwords must be strings");
        if (!password || !(await user.changePassword(password))) throw new apiError(401, "Current password is incorrect");
        if (newPassword.length < 8 || !/[a-z]/i.test(newPassword) || !/\d/.test(newPassword)) throw new apiError(400, "New password must be at least 8 characters long and include a letter and a number");
        user.password = newPassword;
        user.refreshToken = undefined;
    }
    for (const [field, value] of [["fullName", fullName], ["mobileNumber", mobileNumber], ["userName", userName]]) {
        if (typeof value === "string" && value.trim()) user[field] = value.trim();
    }
    if (typeof email === "string" && email.trim()) user.email = email.trim().toLowerCase();
    if (req.file?.path) {
        const uploaded = await uploadToCloudinary(req.file.path);
        if (!uploaded) throw new apiError(502, "Profile image upload failed");
        user.profilePicture = uploaded.url;
    }
    await user.save();
    return res.status(200).json(new apiResponse(200, user, "User details updated"));
});

const getUserWebUrls = asyncHandler(async (req, res) => {
    const urls = await WebUrl.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(new apiResponse(200, [{ userWebSites: urls, totalWebSites: urls.length }], "Websites fetched successfully"));
});

const generateOtp = asyncHandler(async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email) throw new apiError(400, "Email is required");
    const user = await User.findOne({ email });
    if (user) {
        const otp = crypto.randomInt(100000, 1000000).toString();
        user.resetOtpHash = crypto.createHash("sha256").update(otp).digest("hex");
        user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });
        try {
            await mailAlert(user, "Your password reset code", `Your password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`);
        } catch {
            console.error("Could not deliver a password reset code");
        }
    }
    return res.status(200).json(new apiResponse(200, {}, "If that account exists, a reset code has been sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const otp = typeof req.body.otp === "string" ? req.body.otp.trim() : "";
    const password = req.body.password;
    if (!email || !/^\d{6}$/.test(otp) || !password) throw new apiError(400, "Email, 6 digit reset code, and new password are required");
    if (typeof password !== "string" || password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) throw new apiError(400, "Password must be at least 8 characters long and include a letter and a number");
    const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpiresAt");
    const suppliedHash = crypto.createHash("sha256").update(otp).digest();
    const storedHash = user?.resetOtpHash && /^[a-f\d]{64}$/i.test(user.resetOtpHash) ? Buffer.from(user.resetOtpHash, "hex") : Buffer.alloc(32);
    const valid = user && user.resetOtpExpiresAt > new Date() && crypto.timingSafeEqual(suppliedHash, storedHash);
    if (!valid) throw new apiError(400, "Reset code is invalid or expired");
    const passwordHash = await bcrypt.hash(password, 12);
    const consumed = await User.findOneAndUpdate(
        { _id: user._id, resetOtpHash: user.resetOtpHash, resetOtpExpiresAt: { $gt: new Date() } },
        { $set: { password: passwordHash }, $unset: { refreshToken: 1, resetOtpHash: 1, resetOtpExpiresAt: 1 } },
        { new: true, runValidators: true }
    );
    if (!consumed) throw new apiError(400, "Reset code is invalid or expired");
    return res.clearCookie("refreshToken", cookieOptions).clearCookie("accessToken", cookieOptions)
        .status(200).json(new apiResponse(200, {}, "Password changed successfully"));
});

export { signUp, logIn, logOut, getCurrentUser, updateUserDetails, getUserWebUrls, generateOtp, resetPassword, refreshAccessToken };
