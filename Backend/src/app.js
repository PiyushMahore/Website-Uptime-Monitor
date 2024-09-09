import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

export const app = express()

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ limit: "20kb", extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

import { userRoute } from "./routes/user.routes.js"
import  { webUrlRoute } from "./routes/webUrl.routes.js"

app.use("/api/v1/user", userRoute)
app.use("/api/v1/webUrls", webUrlRoute)
