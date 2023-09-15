"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.URL = exports.Base_Url = exports.APP_SECRET = exports.userSubject = exports.FromAdminMail = exports.GMAIL_PASS = exports.GMAIL_USER = exports.fromAdminPhone = exports.authToken = exports.accountSid = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
exports.db = new sequelize_1.Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        encrypt: true,
        //  ssl: {​​​​​​​
        //    rejectUnauthorized: false,
        //  }​​​​​​​,
    },
});
//SENDING OTP TO PHONE
exports.accountSid = process.env.ACCOUNTSID;
exports.authToken = process.env.AUTHTOKEN;
exports.fromAdminPhone = process.env.FROMADMINPHONE;
//SENDING OTP TO EMAIL
exports.GMAIL_USER = process.env.Gmail;
exports.GMAIL_PASS = process.env.GmailPass;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.userSubject;
exports.APP_SECRET = process.env.APP_SECRET;
exports.Base_Url = process.env.BASE_URL;
exports.URL = process.env.URL;
exports.port = process.env.PORT || 4000;
