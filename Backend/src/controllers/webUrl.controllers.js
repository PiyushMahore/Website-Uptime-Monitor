import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { WebUrl } from "../models/webUrl.model.js";
import { fetchUrls } from "../utils/urlFetcher.js";
import { normalizeMonitorUrl } from "../utils/urlValidation.js";
import { alertSender } from "../utils/alertSender.js";
import mailAlert from "../utils/emailAlert.js";

const notificationTypes = new Set(["email"]);

const addWebUrl = asyncHandler(async (req, res) => {
  const { url, notificationType = "email" } = req.body;
  let normalizedUrl;
  try { normalizedUrl = normalizeMonitorUrl(url); }
  catch (error) { throw new apiError(400, error.message); }
  if (!notificationTypes.has(notificationType)) throw new apiError(400, "Unsupported notification type");

  const duplicate = await WebUrl.exists({ userId: req.user._id, Urls: normalizedUrl });
  if (duplicate) throw new apiError(409, "This website is already being monitored");

  const website = await WebUrl.create({ Urls: normalizedUrl, notificationType, userId: req.user._id });
  let initialStatus;
  try { initialStatus = await fetchUrls(website); }
  catch (error) { initialStatus = { statusCode: 0, error: error.message, date: new Date(), totalTime: 0 }; }
  website.statusCode = initialStatus.statusCode;
  website.statusCodes.push(initialStatus);
  await website.save();
  if (initialStatus.statusCode === 0 || initialStatus.statusCode >= 400) {
    try { await alertSender(website); }
    catch (error) { console.error("Initial website alert failed:", error.message); }
  }
  return res.status(201).json(new apiResponse(201, website, "Website added successfully"));
});

const deleteUrl = asyncHandler(async (req, res) => {
  const urlId = req.body?.urlId;
  if (!mongoose.isValidObjectId(urlId)) throw new apiError(400, "A valid urlId is required");
  const deleted = await WebUrl.findOneAndDelete({ _id: urlId, userId: req.user._id });
  if (!deleted) throw new apiError(404, "Website not found");
  return res.status(200).json(new apiResponse(200, {}, "Website removed successfully"));
});

const editUrl = asyncHandler(async (req, res) => {
  const { newUrl, newNotificationType } = req.body;
  if (!mongoose.isValidObjectId(req.params.urlId)) throw new apiError(400, "A valid urlId is required");
  if (newUrl === undefined && newNotificationType === undefined) throw new apiError(400, "No changes provided");
  const website = await WebUrl.findOne({ _id: req.params.urlId, userId: req.user._id });
  if (!website) throw new apiError(404, "Website not found");

  if (newUrl !== undefined) {
    try { website.Urls = normalizeMonitorUrl(newUrl); }
    catch (error) { throw new apiError(400, error.message); }
  }
  if (newNotificationType !== undefined) {
    if (!notificationTypes.has(newNotificationType)) throw new apiError(400, "Unsupported notification type");
    website.notificationType = newNotificationType;
  }
  await website.save();
  return res.status(200).json(new apiResponse(200, website, "Website updated successfully"));
});

const getOneUrl = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.urlId)) throw new apiError(400, "A valid urlId is required");
  const website = await WebUrl.findOne({ _id: req.params.urlId, userId: req.user._id });
  if (!website) throw new apiError(404, "Website not found");
  return res.status(200).json(new apiResponse(200, website, "Website fetched successfully"));
});

const getAllUrls = asyncHandler(async (req, res) => {
  const websites = await WebUrl.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.status(200).json(new apiResponse(200, websites, "Websites fetched successfully"));
});

const sendAlert = asyncHandler(async (req, res) => {
  const id = req.body?.urlId || req.body?.urlDesc?._id;
  if (!mongoose.isValidObjectId(id)) throw new apiError(400, "A valid urlId is required");
  const website = await WebUrl.findOne({ _id: id, userId: req.user._id });
  if (!website) throw new apiError(404, "Website not found");
  const subject = typeof req.body?.subject === "string" ? req.body.subject.trim().slice(0, 160) : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim().slice(0, 10_000) : "";
  if (!subject || !message) throw new apiError(400, "Email subject and message are required");
  const result = await mailAlert(req.user, subject, message);
  if (!result) throw new apiError(503, "Notification could not be sent");
  return res.status(200).json(new apiResponse(200, { messageId: result.messageId }, "Test alert sent"));
});

const fetchUrl = asyncHandler(async (req, res) => {
  let url;
  try { url = normalizeMonitorUrl(req.body?.url); }
  catch (error) { throw new apiError(400, error.message); }
  let result;
  try { result = await fetchUrls(url); }
  catch (error) { result = { statusCode: 0, error: error.message, date: new Date(), totalTime: 0 }; }
  const healthy = result.statusCode >= 200 && result.statusCode < 400;
  return res.status(200).json(new apiResponse(200, result, healthy ? "Website is responding" : "Website is unavailable"));
});

export { addWebUrl, deleteUrl, editUrl, getAllUrls, getOneUrl, sendAlert, fetchUrl };
