import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { WebUrl } from "../models/webUrl.model.js";
import mongoose from "mongoose";

const addWebUrl = asyncHandler(async(req, res) => {
    const { url } = req.body

    if(!url) {
        throw new apiError(400, "Url is needed")
    }

    const urlValidation = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/
    
    const validOrNot = urlValidation.test(url)

    if(validOrNot === false) {
        throw new apiError(401, "Invalid Url")
    }

    const webUrl = await WebUrl.create({Urls: url, userId: req.user?._id})

    if(!webUrl) {
        throw new apiError(500, "invalid crediantials or network connection failed")
    }

    return res
    .status(200)
    .json(new apiResponse(200, webUrl, "Website added successfully"))
})

const deleteUrl = asyncHandler(async(req, res) => {
    const {url} = req.body

    console.log(url);

    if(!url) {
        throw new apiError(404, "url is needed")
    }

    const isExist = await WebUrl.findOne({Urls: url})

    if (!isExist) {
        throw new apiError(404, "not found")
    }

    if(isExist.userId.toString() !== req.user._id.toString()){
        throw new apiError(400, "unauthorize request")
    }

    const deletation = await WebUrl.deleteOne(isExist)

    if(deletation.deletedCount !== 1) {
        throw new apiError(500, "failed to delete collection")
    }

    return res
    .status(200)
    .json(new apiResponse(200, {}, "collection delete successfully"))
})

const editUrl = asyncHandler(async(req, res) => {
    const {newUrl} = req.body
    const {urlId} = req.params
    
    if(!urlId || !newUrl) {
        throw new apiError(400, "url and urlId is not given")
    }

    const urlValidation = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/
    
    const validOrNot = urlValidation.test(newUrl)

    if(validOrNot === false) {
        throw new apiError(401, "Invalid Url")
    }

    const urlExist = await WebUrl.findById(urlId)

    if(!urlExist) {
        throw new apiError(404, "url not found")
    }

    if(urlExist.userId.toString() !== req.user._id.toString()){
        throw new apiError(400, "unauthorize request")
    }

    urlExist.Urls = newUrl

    await urlExist.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(200, urlExist, "Url Updated successfully"))
})

const getAllUrls = asyncHandler(async(req, res) => {
    const urls = await WebUrl.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "userId",
                as: "userAllWebUrls",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            userName: 1,
                            Urls: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalWebSites: {
                    $size: "$userAllWebUrls"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(new apiResponse(200, urls, "All web urls fetched successfully"))
})

export {addWebUrl, deleteUrl, editUrl, getAllUrls}
