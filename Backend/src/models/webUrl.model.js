import mongoose, {Schema} from "mongoose";

const webUrlSchema = new Schema(
    {
        Urls: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const WebUrl = mongoose.model("WebUrl", webUrlSchema)
