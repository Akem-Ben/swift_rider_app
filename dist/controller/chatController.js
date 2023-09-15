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
exports.Chat = void 0;
const pusher_1 = __importDefault(require("pusher"));
const Chat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pusher = new pusher_1.default({
        appId: "1543383",
        key: "e6e0a271cc1dd441c02a",
        secret: "c6c90363834102801836",
        cluster: "sa1",
        useTLS: true
    });
    yield pusher.trigger("swiftRider", "message", {
        username: req.body.username,
        message: req.body.message,
        time: req.body.time
    });
    res.status(201).json([]);
});
exports.Chat = Chat;
