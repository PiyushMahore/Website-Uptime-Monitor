import mongoose, { Schema } from "mongoose";

const checkResultSchema = new Schema({
    nameLookupTime: { type: Number, default: 0 },
    connectionTime: { type: Number, default: 0 },
    tlsHandshakeTime: { type: Number, default: 0 },
    dataTransferTime: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    statusCode: { type: Number, default: 0 },
    error: { type: String, default: "" },
    date: { type: Date, default: Date.now },
}, { _id: false });

const webUrlSchema = new Schema(
    {
        Urls: {
            type: String,
            required: true,
        },
        notificationType: {
            type: String,
            enum: ["email"],
            default: "email",
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
        statusCodes: { type: [checkResultSchema], default: [] }
    },
    {
        timestamps: true
    }
)

webUrlSchema.index({ userId: 1, createdAt: -1 });

export const WebUrl = mongoose.model("WebUrl", webUrlSchema)
