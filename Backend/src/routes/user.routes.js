import { Router } from "express";
import { getCurrentUser, getUserWebUrls, logIn, logOut, signUp, updateUserDetails } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/verifyJwt.middleware.js";

const userRoute = Router()

userRoute.route("/signup").post(upload.single("coverImage"), signUp)

userRoute.route("/login").post(logIn)

userRoute.route("/logout").post(verifyJwt, logOut)

userRoute.route("/current-user").get(verifyJwt, getCurrentUser)

userRoute.route("/update-user").patch(verifyJwt, upload.single("profilePicture"), updateUserDetails)

userRoute.route("/get-web-urls").get(verifyJwt, getUserWebUrls)

export {userRoute}