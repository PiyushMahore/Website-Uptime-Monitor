import { Router } from "express";
import verifyJwt from "../middlewares/verifyJwt.middleware.js"
import { addWebUrl, alertSender, deleteUrl, editUrl, fetchUrl, getAllUrls } from "../controllers/webUrl.controllers.js";

const webUrlRoute = Router()

webUrlRoute.route('/add-website-url').post(verifyJwt, addWebUrl)

webUrlRoute.route('/remove-website-url').delete(verifyJwt, deleteUrl)

webUrlRoute.route('/edit-website-url/:urlId').patch(verifyJwt, editUrl)

webUrlRoute.route('/get-website-url').get(verifyJwt, getAllUrls)

webUrlRoute.route('/fetch-url').post(fetchUrl)

webUrlRoute.route('/alert').post(alertSender)

export { webUrlRoute }