import { User } from "../models/user.model.js"
import { apiError } from "./apiError.js"
import mailAlert from "./emailAlert.js"

const alertSender = async (receiversdata) => {

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
        console.log("text")
    } else {
        console.log("call")
    }

    return alert
}

export { alertSender }