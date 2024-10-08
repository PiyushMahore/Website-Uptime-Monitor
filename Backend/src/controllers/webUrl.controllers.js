import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { WebUrl } from "../models/webUrl.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import mailAlert from "../utils/emailAlert.js"
import { fetchUrls } from "../utils/urlFetcher.js";
import https from 'https';

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

  const webUrl = await WebUrl.create({ Urls: url, notificationType: notificationType, userId: req.user?._id });

  if (!webUrl) {
    throw new apiError(
      500,
      "invalid crediantials or network connection failed"
    );
  }

  const webPerformance = await fetchUrls(webUrl);

  if (!webPerformance) {
    throw new apiError(500, "Somthing wrong with this url")
  }

  webUrl.statusCode = webPerformance.statusCode

  webUrl.statusCodes.push(webPerformance);

  await webUrl.save({ validateBeforeSave: false })

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

const getOneUrl = asyncHandler(async (req, res) => {
  const { urlId } = req.params

  if (!urlId) {
    throw new apiError(401, "urlId is required")
  }

  const url = await WebUrl.findById(urlId);

  if (!url) {
    throw new apiError(404, "UrlId is not valid")
  }

  return res
    .status(200)
    .json(new apiResponse(200, url, "Url get successfully"))
})

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

const sendAlert = asyncHandler(async (req, res) => {
  const { urlDesc, message, subject } = req.body;

  if (!urlDesc) {
    throw new apiError(401, "url desc not provided")
  }

  const user = await User.findById(urlDesc.userId)

  if (!user) {
    throw new apiError(404, "cant find user from given user Id")
  }

  let alert;

  if (urlDesc.notificationType === "email") {
    alert = await mailAlert(user, subject, message)
  } else if (urlDesc.notificationType === "text") {
    console.log("text")
  } else {
    console.log("call")
  }

  if (!alert) {
    throw new apiError(500, "Somthing went wrong while sending alert")
  }

  return res
    .status(200)
    .json(new apiResponse(200, alert, "Alert send Successfully"))
})

const fetchUrl = asyncHandler(async (req, res) => {
  const { url } = req.body

  if (!url) return null

  new Promise((resolve, reject) => {
    const timings = {
      nameLookupTime: 0,
      connectionTime: 0,
      tlsHandshakeTime: 0,
      dataTransferStart: 0,
      dataTransferTime: 0
    };

    timings.start = Date.now();

    const request = https.get(url, (response) => {
      timings.statusCode = response.statusCode;

      response.on('data', () => {
        if (!timings.dataTransferStart) {
          timings.dataTransferStart = Date.now();
        }
      });

      response.on('end', async () => {
        timings.responseEnd = Date.now();
        timings.dataTransferTime = timings.dataTransferStart
          ? timings.responseEnd - timings.dataTransferStart
          : 0;

        timings.totalTime = timings.nameLookupTime + timings.connectionTime + timings.tlsHandshakeTime + timings.dataTransferTime;

        const finalTimings = {
          nameLookupTime: timings.nameLookupTime,
          connectionTime: timings.connectionTime,
          tlsHandshakeTime: timings.tlsHandshakeTime,
          dataTransferTime: timings.dataTransferTime,
          totalTime: timings.totalTime,
          statusCode: timings.statusCode
        };

        resolve(finalTimings);
      });
    });

    request.on('socket', (socket) => {
      socket.on('lookup', () => {
        timings.nameLookupTime = Date.now() - timings.start;
      });

      socket.on('connect', () => {
        timings.connectionTime = Date.now() - timings.nameLookupTime - timings.start;
      });

      socket.on('secureConnect', () => {
        timings.tlsHandshakeTime = Date.now() - timings.connectionTime - timings.nameLookupTime - timings.start;
      });
    });

    request.on('error', (error) => {
      reject(new apiError(500, "Failed to fetch the URL"));
    });
  })
    .then((response) => {
      if (response.statusCode >= 500) {
        return res.status(200).json(new apiResponse(response.statusCode, response.statusCode, `Your Website is currently Down the Status Code is ${response.statusCode}`))
      }
      return res.status(200).json(new apiResponse(response.statusCode, response.statusCode, `Your Website is Perfectly Working With Status Code ${response.statusCode}`))
    })

    .catch(() => {
      return res.status(200).json(new apiResponse(200, {}, "Url is invalid or no longer available"))
    })
})

export { addWebUrl, deleteUrl, editUrl, getAllUrls, getOneUrl, sendAlert, fetchUrl };
