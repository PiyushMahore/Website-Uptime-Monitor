import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { WebUrl } from "../models/webUrl.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import axios from "axios";
import mailAlert from "../utils/emailAlert.js"
import textAlert from "../utils/textAlert.js";

const addWebUrl = asyncHandler(async (req, res) => {
  const { url, notificationType } = req.body;

  if (!url || !notificationType) {
    throw new apiError(400, "Url & notificationType is needed");
  }

  const urlValidation =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/;

  const validOrNot = urlValidation.test(url);

  if (validOrNot === false) {
    throw new apiError(401, "Invalid Url");
  }

  const response = await axios.get(url)

  const webUrl = await WebUrl.create({ Urls: url, notificationType: notificationType, userId: req.user?._id, statusCode: response.status });

  if (!webUrl) {
    throw new apiError(
      500,
      "invalid crediantials or network connection failed"
    );
  }

  return res
    .status(200)
    .json(new apiResponse(200, webUrl, "Website added successfully"));
});

const deleteUrl = asyncHandler(async (req, res) => {
  const { urlId } = req.body;

  if (!urlId) {
    throw new apiError(404, "urlId is needed");
  }

  const isExist = await WebUrl.findById({ _id: urlId });

  if (!isExist) {
    throw new apiError(404, "not found");
  }

  if (isExist.userId.toString() !== req.user._id.toString()) {
    throw new apiError(400, "unauthorize request");
  }

  const deletation = await WebUrl.deleteOne(isExist);

  if (deletation.deletedCount !== 1) {
    throw new apiError(500, "failed to delete collection");
  }

  return res
    .status(200)
    .json(new apiResponse(200, {}, "collection delete successfully"));
});

const editUrl = asyncHandler(async (req, res) => {
  const { newUrl, newNotificationType } = req.body;
  const { urlId } = req.params;

  if (!newUrl && !newNotificationType) {
    return res
      .status(200)
      .json(new apiResponse(200, {}, "Nothing to update"))
  }

  if (!urlId) {
    throw new apiError(400, "urlId is not given");
  }

  const urlExist = await WebUrl.findById(urlId);

  if (!urlExist) {
    throw new apiError(404, "url not found");
  }

  if (urlExist.userId.toString() !== req.user._id.toString()) {
    throw new apiError(400, "unauthorize request");
  }

  if (newUrl) {
    const urlValidation =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/;

    const validOrNot = urlValidation.test(newUrl);

    if (validOrNot === false) {
      throw new apiError(401, "Invalid Url");
    }

    urlExist.Urls = newUrl;
  }

  if (newNotificationType) {
    urlExist.notificationType = newNotificationType;
  }

  await urlExist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, urlExist, "Url Updated successfully"));
});

const fetchUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    throw new apiError(404, "url field is empty");
  }

  try {
    const response = await axios.get(url.Urls);
    const urlDescription = await WebUrl.findById(url._id);
    urlDescription.statusCode = response.status
    await urlDescription.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new apiResponse(
        200,
        urlDescription,
        `${response.status < 500 ? "Website is Perfectly working with status code" : "Website is down with status code of"} ${response.status}`
      ));

  } catch (error) {
    throw new apiError(500, "Unable to fetch api", error);
  }
});

const getAllUrls = asyncHandler(async (req, res) => {
  const urls = await WebUrl.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
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
              Urls: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalWebSites: {
          $size: "$userAllWebUrls",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, urls, "All web urls fetched successfully"));
});

const alertSender = asyncHandler(async (req, res) => {
  const { receiversdata } = req.body;

  if (!receiversdata) {
    throw new apiError(404, "recervers data not reseved")
  }

  const user = await User.findById(receiversdata.userId)

  if (!user) {
    throw new apiError(404, "cant find user from given user Id")
  }

  let alert;

  if (receiversdata.notificationType === "email") {
    alert = await mailAlert(user)
  }
  else if (receiversdata.notificationType === "text") {
    alert = await textAlert(user)
  } else {
    console.log("call")
  }

  return res
    .status(200)
    .json(new apiResponse(200, alert, "Alert send successfully"))
})

export { addWebUrl, deleteUrl, editUrl, getAllUrls, fetchUrl, alertSender };
