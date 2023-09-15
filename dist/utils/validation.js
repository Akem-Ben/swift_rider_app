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
exports.orderRideSchema = exports.updateRiderSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.editProfileSchema = exports.validatePassword = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.registerSchema = exports.option = exports.loginSchema = exports.riderRegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import jwt from 'jsonwebtoken'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import bcrypt from 'bcrypt';
const index_1 = require("../config/index");
///rider signup
exports.riderRegisterSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirmPassword: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    phone: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    documents: joi_1.default.string(),
    validID: joi_1.default.string(),
    passport: joi_1.default.string(),
    plateNumber: joi_1.default.string().required(),
});
//Riders login
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
exports.option = {
    abortearly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
// Users Signup
exports.registerSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^[a-z0-9]{3,30}$/),
    phone: joi_1.default.string(),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
});
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, index_1.APP_SECRET, { expiresIn: "1d" });
});
exports.GenerateSignature = GenerateSignature;
//GENERATE TOKEN FOR A USER
const verifySignature = (signature) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(signature, index_1.APP_SECRET);
});
exports.verifySignature = verifySignature;
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.validatePassword = validatePassword;
exports.editProfileSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    address: joi_1.default.string(),
    passport: joi_1.default.string()
});
//schema for reset Password
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required()
});
exports.resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().regex(/[a-zA-Z0-9]{3,30}/),
    //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('confirm password')
});
exports.updateRiderSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    city: joi_1.default.string()
});
exports.orderRideSchema = joi_1.default.object().keys({
    pickupLocation: joi_1.default.string().required(),
    packageDescription: joi_1.default.string().required(),
    dropOffLocation: joi_1.default.string().required(),
    dropOffPhoneNumber: joi_1.default.string().required(),
    offerAmount: joi_1.default.number().required(),
    paymentMethod: joi_1.default.string().required(),
});
