import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "node:crypto";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            unique: true,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profilePicture: {
            type: String
        },
        webSiteUrls: [{
            type: Schema.Types.ObjectId,
            ref: "WebUrl"
        }],
        refreshToken: {
            type: String
        },
        resetOtpHash: { type: String, select: false },
        resetOtpExpiresAt: { type: Date, select: false },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.resetOtpHash;
                delete ret.resetOtpExpiresAt;
                delete ret.__v;
                return ret;
            }
        }
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.methods.changePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIREY || process.env.ACCESS_TOKEN_EXPIRY || "15m"
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIREY || process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    )
}

userSchema.methods.hashRefreshToken = function (token) {
    this.refreshToken = crypto.createHash("sha256").update(token).digest("hex");
}

export const User = mongoose.model("User", userSchema);
