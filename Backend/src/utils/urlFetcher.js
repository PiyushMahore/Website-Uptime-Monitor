import { apiError } from "./apiError.js";
import axios from "axios";
import { WebUrl } from "../models/webUrl.model.js";

const fetchUrl = async (url) => {
    if (!url) {
        throw new apiError(404, "url field is empty");
    }
    try {
        const response = await axios.get(url.Urls);
        const urlDescription = await WebUrl.findById(url._id);
        urlDescription.statusCode = response.status
        await urlDescription.save({ validateBeforeSave: false });
        return response;

    } catch (error) {
        throw new apiError(500, "Unable to fetch api", error);
    }
}

export { fetchUrl }