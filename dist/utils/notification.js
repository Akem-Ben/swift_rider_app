"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDriver = exports.emailHtml2 = exports.mailSent2 = exports.emailHtml = exports.mailSent = exports.onRequestOTP = exports.GenerateOTP = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 60 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const client = require('twilio')(config_1.accountSid, config_1.authToken);
    const response = yield client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone
    });
    return response;
});
exports.onRequestOTP = onRequestOTP;
const transport = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
const mailSent = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield transport.sendMail({
            from: config_1.FromAdminMail, subject: config_1.userSubject, to, html
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
});
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
    <div style="max-width: 700px; margin:auto; border:10px solid #ddd; border-radius:25px; padding:50px 20px; font-size:110%; font-family:sans-serif;">
    <h2 style="text-align:center; text-transform:uppercase; color:teal;">
    WELCOME TO SWIFT RIDERS
    </h2>
    <p>Hi there, your otp is ${otp}</p>
    </div>
    `;
    return response;
};
exports.emailHtml = emailHtml;
/**===================user mail services =========== **/
const mailSent2 = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield transport.sendMail({ from: config_1.FromAdminMail,
            subject: config_1.userSubject,
            to,
            html });
        return response;
    }
    catch (error) {
        console.log(error);
    }
});
exports.mailSent2 = mailSent2;
const emailHtml2 = (link) => {
    let response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    Swift Riders
    </h2>
    <p>Hi there, below is your password reset link and it expires in 10 mins</p>
     ${link}
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>
    `;
    return response;
};
exports.emailHtml2 = emailHtml2;
const randomDriver = (length) => {
    const random = Math.floor(Math.random() * length);
    return random;
};
exports.randomDriver = randomDriver;
