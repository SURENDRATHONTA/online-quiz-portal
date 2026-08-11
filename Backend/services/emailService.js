const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
transporter.verify(function (error, success) {
    if (error) {
        console.log("❌ Mail Configuration Error:", error.message);
    } else {
        console.log("✅ Mail Server Ready to send emails");
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code for Online Quiz System',
        text: `Your verification code is: ${otp}. It expires in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
