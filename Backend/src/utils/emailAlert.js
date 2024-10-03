import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

// Create a transporter object using the Gmail SMTP service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,         // Your email address from the environment file
        pass: process.env.APP_PASSWORD,  // Your email app password from the environment file
    },
});

async function mailAlert(receiver, subject, message) {
    try {
        const response = await transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: receiver.email,      // recipient's email address
            subject: subject || 'Website Downtime',  // Subject line
            text: message || `Hi ${receiver.fullName},\n\nJust a heads-up, it looks like the website is currently down. Please check and resolve the issue at your earliest convenience.\n\nBest regards,\nUptime Monitor`,  // plain text body
        });
        return response

    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export default mailAlert;
