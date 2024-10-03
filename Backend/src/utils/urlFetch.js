import { fetchUrl } from "./urlFetcher.js";
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

    const urlCheck = await fetchUrl(urlDesc);

    isExist.statusCodes.push(urlCheck.status);

    await isExist.save({ validateBeforeSave: false });

    if (urlCheck.status >= 500) {
        const alertSend = await alertSender(urlDesc)
        if (!alertSend?.messageId) {
            throw new apiError(500, "failed to send notification")
        }
        return new apiResponse(200, { urlstatus: urlCheck.status }, `your webisite is not working with status code ${urlCheck.status} we have alerted to the owner of website`)
    }

    return new apiResponse(200, { urlstatus: urlCheck.status }, `your webisite is perfectly working with status code ${urlCheck.status}`)
}

export { checkUrls }