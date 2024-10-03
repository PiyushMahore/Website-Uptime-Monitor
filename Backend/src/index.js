import dbConnect from "./db/dbConnect.js"
import { app } from "./app.js";
import { WebUrl } from "./models/webUrl.model.js";
import { checkUrls } from "./utils/urlFetch.js"

const Port = process.env.PORT

dbConnect()

    .then(() => {

        app.on("Error", (error) => {
            console.log("db not connected", error);
        })

        app.listen(Port, () => {
            console.log(`http://localhost:${Port}/`);
        })

    })

    .catch((err) => {
        console.log("sothing went rong", err);
    })

const fetchingURls = async () => {
    const UrlDescs = await WebUrl.find({})
    UrlDescs.map(async (urlDesc) => {
        await checkUrls(urlDesc)
    })
}

fetchingURls()

setInterval(() => {
    fetchingURls()
}, 180000);