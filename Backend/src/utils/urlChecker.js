import { fetchUrls } from "./urlFetcher.js";
import { alertSender } from "./alertSender.js";
import { WebUrl } from "../models/webUrl.model.js";

export async function checkUrls(urlDescription) {
  let result;
  try {
    result = await fetchUrls(urlDescription);
  } catch (error) {
    result = { statusCode: 0, error: error.message, date: new Date(), totalTime: 0 };
  }
  const previousStatus = Number(urlDescription.statusCode || 0);
  const isDown = result.statusCode === 0 || result.statusCode >= 400;
  const hasPreviousCheck = Boolean(urlDescription.statusCodes?.length);
  const wasDown = hasPreviousCheck && (previousStatus === 0 || previousStatus >= 400);
  const wentDown = isDown && !wasDown;
  const recovered = wasDown && !isDown;
  const update = {
    $set: { statusCode: result.statusCode },
    $push: { statusCodes: { $each: [result], $slice: -480 } },
  };
  if (wentDown) update.$inc = { incidents: 1 };

  const saved = await WebUrl.findByIdAndUpdate(urlDescription._id, update, { new: true, runValidators: true });
  if (saved && (wentDown || recovered)) {
    try {
      await alertSender(saved, { recovered });
    } catch (error) {
      console.error("Website down notification failed:", error.message);
    }
  }
  return result;
}
