import { fetchUrls } from "./urlFetcher.js";
import { alertSender } from "./alertSender.js";
import { WebUrl } from "../models/webUrl.model.js";
import { apiError } from "./apiError.js";
import { apiResponse } from "./apiResponse.js";

const checkUrls = async (urlDesc) => {
    if (!urlDesc) {
        throw new apiError(401, "no url to check")
    }

    const isExist = await WebUrl.findById(urlDesc._id);

    if (!isExist) {
        throw new apiError(404, "given url is not valid")
    }

    const urlCheck = await fetchUrls(urlDesc);

    if (isExist.statusCodes.length >= 480) {
        isExist.statusCodes.splice(0, 10);
    }

    isExist.statusCodes.push(urlCheck);

    await isExist.save({ validateBeforeSave: true });

    if (urlCheck.statusCode >= 500) {
        const alertSend = await alertSender(urlDesc)
        if (!alertSend?.messageId) {
            throw new apiError(500, "failed to send notification")
        }
        return new apiResponse(200, { urlstatus: urlCheck }, `your webisite is not working with status code ${urlCheck.statusCode} we have alerted to the owner of website`)
    }

    return new apiResponse(200, { urlstatus: urlCheck }, `your webisite is perfectly working with status code ${urlCheck.statusCode}`)
}

export { checkUrls }
