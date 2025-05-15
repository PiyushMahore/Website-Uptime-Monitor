import mongoose, { Schema } from "mongoose";

const webUrlSchema = new Schema(
    {
        Urls: {
            type: String,
            required: true,
        },
        notificationType: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        statusCode: {
            type: Number,
        },
        incidents: {
            type: Number,
            default: 0
        },
        statusCodes: []
    },
    {
        timestamps: true
    }
)

export const WebUrl = mongoose.model("WebUrl", webUrlSchema)
