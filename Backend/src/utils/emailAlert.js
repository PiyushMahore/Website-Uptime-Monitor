import nodemailer from "nodemailer";
import "../config/env.js";

let transporter;
function getTransporter() {
    if (!process.env.EMAIL || !process.env.APP_PASSWORD) throw new Error("Email alerts are not configured");
    transporter ||= nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL, pass: process.env.APP_PASSWORD },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
    });
    return transporter;
}

export default async function mailAlert(receiver, subject, message) {
    if (!receiver?.email) throw new Error("A recipient email address is required");
    try {
        return await getTransporter().sendMail({
            from: process.env.EMAIL,
            to: receiver.email,
            subject: String(subject || "Website Downtime").slice(0, 160),
            text: String(message || `Hi ${receiver.fullName || "there"}, your monitored website is unavailable.`).slice(0, 10_000),
        });
    } catch (error) {
        console.error("Email delivery failed:", error.message);
        throw new Error("Email delivery failed");
    }
}
