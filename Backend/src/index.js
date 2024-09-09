import dbConnect  from "./db/dbConnect.js"
import { app } from "./app.js";

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
