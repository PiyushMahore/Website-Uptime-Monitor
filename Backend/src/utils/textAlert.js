// Import the Twilio library
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config()

// Twilio credentials (find these in your Twilio dashboard)
const accountSid = process.env.TWILO_SID; // Replace with your Account SID
const authToken = process.env.TWILO_AUTH_TOKEN;   // Replace with your Auth Token


// Create a Twilio client
const client = new twilio(accountSid, authToken);

// Send a text message
const textAlert = async (receiver) => {
    try {
        const send = await client.messages.create({
            body: `Hi ${receiver.fullName},\nit looks like the website is down. Please check and resolve the issue when you can.\nUPTIME MONITOR`,  // Message content
            from: process.env.MOBILE_NUMBER,    // Your Twilio phone number
            to: receiver.mobileNumber          // Recipient's phone number
        });
        console.log(`Message sent: ${send}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

export default textAlert;
