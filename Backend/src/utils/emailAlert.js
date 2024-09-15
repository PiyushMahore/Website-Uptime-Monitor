import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail SMTP service
    auth: {
        user: 'piyushmahore41@gmail.com', // Your email address from env file
        pass: 'npptpcoodfvwcqeh', // Your email password from env file
    },
});

async function mailAlert(receiver) {
    const info = await transporter.sendMail({
        from: 'piyushmahore41@gmail.com', // sender address
        to: receiver, // list of receivers
        subject: "Your Website is crashed", // Subject line
        text: "Hello, \n currently your website is not responding.", // plain text body
    });
}

export default mailAlert;
