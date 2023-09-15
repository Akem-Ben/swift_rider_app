"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { orderRide } from '../controller/orderController';
const userController_1 = require("../controller/userController");
const authorization_1 = require("../middleware/authorization");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post("/signup", userController_1.Signup);
router.patch("/updateUserProfile", multer_1.upload.single('passport'), authorization_1.auth, userController_1.UpdateUserProfile);
router.post("/login", userController_1.Login);
router.post("/verify/:signature", userController_1.VerifyUser);
router.get("/resend-otp/:signature", userController_1.ResendOTP);
//routes for reset user password
router.post("/forgotpasswordd", userController_1.forgotPassword);
router.get("/resetpasswordd/:token", userController_1.resetPasswordGet);
router.post("/resetpasswordd/:token", userController_1.resetPasswordPost);
//
router.post("/order-ride/", authorization_1.auth, userController_1.orderRide);
router.get("/completed-orders", authorization_1.auth, userController_1.getMyCompletedOrders);
router.get("/my-orders", authorization_1.auth, userController_1.getMyOrders);
router.patch("/updatePaymentMethod/:id", authorization_1.auth, userController_1.updatePaymentMethod);
router.get("/my-order/:ids", userController_1.getOrder);
router.get("/get-user-profile", authorization_1.auth, userController_1.getUserProfile);
router.delete("delete-order/:id", authorization_1.auth, userController_1.deleteOrder);
// notification
router.get("/my-notification", authorization_1.auth, userController_1.myNotification);
router.patch("/update-notification/:notifyId", authorization_1.auth, userController_1.updateNotification);
exports.default = router;
