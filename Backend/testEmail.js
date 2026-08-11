require("dotenv").config();

const sendOTP = require("./services/emailService");

sendOTP("formailchecker655@gmail.com", "123456");