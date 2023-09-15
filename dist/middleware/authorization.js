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
exports.authRider = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userModel_1 = require("../models/userModel");
const riderModel_1 = require("../models/riderModel");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: "Kindly login",
            });
        }
        //Bearer token
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorized access",
            });
        }
        const { id } = verified;
        // find user by Id
        const user = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(401).json({
                Error: "Unauthorized access",
            });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Unauthorized" });
    }
});
exports.auth = auth;
const authRider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: "Kindly login",
            });
        }
        //Bearer token
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorized access",
            });
        }
        const { id } = verified;
        // find vendor by Id
        const rider = (yield riderModel_1.RiderInstance.findOne({
            where: { id: id },
        }));
        if (!rider) {
            return res.status(401).json({
                Error: "Unauthorized access",
            });
        }
        req.rider = verified;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Unauthorized" });
    }
});
exports.authRider = authRider;
