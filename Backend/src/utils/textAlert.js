import admin from 'firebase-admin';
import serviceAccountKey from '../../public/serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});

const textAlert = async (token, receiver) => {
    const message = {
        notification: {
            title: 'Website Alert',
            body: `Hi ${receiver.fullName},\nit looks like the website is down. Please check and resolve the issue when you can.\nUPTIME MONITOR`,
        },
        token,
    };
    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export default textAlert;
