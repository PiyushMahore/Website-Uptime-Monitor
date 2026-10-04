import { User } from "../models/user.model.js";
import { apiError } from "./apiError.js";
import mailAlert from "./emailAlert.js";

export async function alertSender(website, { recovered = false } = {}) {
    if (!website?.userId) throw new apiError(400, "Website is missing an owner");
    const user = await User.findById(website.userId);
    if (!user) throw new apiError(404, "Website owner not found");
    if (website.notificationType !== "email") {
        throw new apiError(501, `The ${website.notificationType} notification channel is not configured`);
    }
    const subject = recovered ? "Website is back online" : "Website unavailable";
    const message = recovered
        ? `Hi ${user.fullName},\n\n${website.Urls} is responding again (HTTP ${website.statusCode}).\n\nUptime Monitor`
        : `Hi ${user.fullName},\n\nWe detected that ${website.Urls} is unavailable (HTTP ${website.statusCode || 0}). Please check the website.\n\nUptime Monitor`;
    return mailAlert(user, subject, message);
}
