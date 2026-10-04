import mongoose from "mongoose";
import { env } from "../config/env.js";

const dbConnect = async () => {
    if (!env.dbUrl) throw new Error("DB_URL is required");
    const connectionUrl = new URL(env.dbUrl);
    if (!connectionUrl.pathname || connectionUrl.pathname === "/") {
        connectionUrl.pathname = `/${encodeURIComponent(env.dbName)}`;
    }
    const connection = await mongoose.connect(connectionUrl.toString(), {
        serverSelectionTimeoutMS: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10_000),
        autoIndex: env.nodeEnv !== "production",
    });
    console.log("Database connected:", connection.connection.name);
    return connection;
}

export default dbConnect
