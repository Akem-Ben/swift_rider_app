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
exports.myNotification = exports.updateNotification = exports.deleteOrder = exports.getOrder = exports.updatePaymentMethod = exports.getMyCompletedOrders = exports.getMyOrders = exports.orderRide = exports.resetPasswordPost = exports.resetPasswordGet = exports.forgotPassword = exports.getUserProfile = exports.ResendOTP = exports.VerifyUser = exports.Login = exports.UpdateUserProfile = exports.Signup = void 0;
const userModel_1 = require("../models/userModel");
const validation_1 = require("../utils/validation");
const notification_1 = require("../utils/notification");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const riderModel_1 = require("../models/riderModel");
const orderModel_1 = require("../models/orderModel");
const notification_2 = require("../models/notification");
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body", req.body);
        const { name, phone, email, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        console.log("we got to this point", uuiduser);
        const validateResult = validation_1.registerSchema.validate(req.body);
        if (validateResult.error) {
            console.log("we got to this point", validateResult.error);
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        console.log("we got to this point", validateResult);
        //Generate salt
        const salt = yield (0, validation_1.GenerateSalt)();
        const userPassword = (yield (0, validation_1.GeneratePassword)(password, salt));
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        const newEmail = email.trim().toLowerCase();
        //check user details
        const User = yield userModel_1.UserInstance.findOne({ where: { email: newEmail } });
        const userPhone = yield userModel_1.UserInstance.findOne({
            where: { phone: phone },
        });
        const isRiderEmail = (yield riderModel_1.RiderInstance.findOne({
            where: { email: newEmail },
        }));
        const isRiderPhone = yield riderModel_1.RiderInstance.findOne({
            where: { phone: phone },
        });
        console.log("we got to this point");
        if (!User && !userPhone && !isRiderEmail && !isRiderPhone) {
            const user = yield userModel_1.UserInstance.create({
                id: uuiduser,
                name,
                phone,
                email: newEmail,
                password: userPassword,
                salt: salt,
                address: "",
                otp,
                otp_expiry: expiry,
                longitude: 0,
                latitude: 0,
                verified: false,
                role: "user",
            });
            // await onRequestOTP(otp, phoneNumber);
            // Check if user exist
            const User = (yield userModel_1.UserInstance.findOne({
                where: { email: newEmail },
            }));
            const signature = yield (0, validation_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "User created successfully ",
                User,
                signature,
            });
        }
        return res.status(400).json({
            Error: "Email or Phone Number already exist",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "users/signup",
        });
    }
});
exports.Signup = Signup;
const UpdateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { name, phone, email, passport } = req.body;
        const validateResult = validation_1.editProfileSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!User) {
            return res.status(401).json({
                Error: "You are not authorized",
            });
        }
        // checking if a file was uploaded
        let file = req.file;
        if (!file) {
            return res.status(400).json({ Error: "No file was uploaded" });
        }
        req.body.passport = file.path;
        console.log(User);
        //trim incoming email
        const newEmail = email.trim().toLowerCase();
        req.body.email = newEmail;
        const newUser = (yield userModel_1.UserInstance.update(req.body, { where: { id: id } }));
        if (newUser) {
            const User = (yield userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "Profile updated successfully",
                User,
            });
        }
        return res.status(401).json({
            Error: "Failed to update profile",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "./users/updateUserProfile/:id",
        });
    }
});
exports.UpdateUserProfile = UpdateUserProfile;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = validation_1.loginSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //trim the incoming emial
        const newEmail = email.trim().toLowerCase();
        // check if user exists
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: newEmail },
        }));
        console.log("User");
        const Rider = (yield riderModel_1.RiderInstance.findOne({
            where: { email: newEmail },
        }));
        if (User) {
            const validation = yield (0, validation_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                // Generate a new Signature
                let signature = yield (0, validation_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "Login successful",
                    signature: signature,
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                    role: User.role,
                    name: User.name,
                    image: User.passport
                });
            }
            return res.status(400).json({
                Error: "Wrong Username or password or not a verified user",
            });
        }
        else if (Rider) {
            const validation = yield (0, validation_1.validatePassword)(password, Rider.password, Rider.salt);
            if (validation) {
                // Generate a new Signature
                let signature = yield (0, validation_1.GenerateSignature)({
                    id: Rider.id,
                    email: Rider.email,
                    verified: Rider.verified,
                });
                return res.status(200).json({
                    message: "Login successful",
                    signature: signature,
                    id: Rider.id,
                    email: Rider.email,
                    verified: Rider.verified,
                    role: Rider.role,
                    name: Rider.name,
                    image: Rider.passport
                });
            }
            return res.status(400).json({
                Error: "Wrong Username or password or not a verified user",
            });
        }
        return res.status(401).json({
            Error: "account does not exist, please signup",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: err.stack,
            route: "/users/login",
        });
    }
});
exports.Login = Login;
/**==================Verify Users==================== **/
const VerifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, validation_1.verifySignature)(token);
        // check if user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp } = req.body;
            //check if the otp submitted by the user is correct and is same with the one in the database
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                //update user
                const updatedUser = (yield userModel_1.UserInstance.update({ verified: true }, { where: { email: decode.email } }));
                // Generate a new Signature
                let signature = yield (0, validation_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (yield userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                    return res.status(200).json({
                        message: "Your account have been verified successfully",
                        signature,
                        verified: User.verified,
                    });
                }
            }
        }
        return res.status(400).json({
            Error: "invalid credentials or OTP already expired",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
        });
    }
});
exports.VerifyUser = VerifyUser;
/**============================Resend OTP=========================== **/
const ResendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, validation_1.verifySignature)(token);
        // check if user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            //Generate otp
            const { otp, expiry } = (0, notification_1.GenerateOTP)();
            //update user
            const updatedUser = (yield userModel_1.UserInstance.update({ otp, otp_expiry: expiry }, { where: { email: decode.email } }));
            if (updatedUser) {
                //Send OTP to user
                // await onRequestOTP(otp, User.phone);
                //send Email
                const html = (0, notification_1.emailHtml)(otp);
                yield (0, notification_1.mailSent)(config_1.FromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resent successfully, kindly check your eamil or phone number for OTP verification",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature",
        });
    }
});
exports.ResendOTP = ResendOTP;
/**==================User Profile==================== **/
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const isUser = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
            attributes: ["id", "name", "phone", "email"]
        }));
        if (!isUser)
            return res.status(404).json({
                Error: "User not found"
            });
        return res.status(200).json({
            message: "request was successful",
            isUser
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server error",
            route: "users/get-user-profile"
        });
    }
});
exports.getUserProfile = getUserProfile;
/**=========================== Resend Password============================== **/
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email } = req.body;
        const validateResult = validation_1.forgotPasswordSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const oldUser = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        const oldRider = (yield riderModel_1.RiderInstance.findOne({
            where: { email: email },
        }));
        if (oldUser) {
            const secret = config_1.APP_SECRET + oldUser.password;
            const token = jsonwebtoken_1.default.sign({ email: oldUser.email, id: oldUser.id }, secret, {
                expiresIn: "10m",
            });
            const link = `${config_1.Base_Url}/users/resetpasswordd/${oldUser.id}`;
            if (token) {
                const html = (0, notification_1.emailHtml2)(link);
                yield (0, notification_1.mailSent2)(config_1.FromAdminMail, oldUser.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "password reset link sent to email",
                    link,
                });
            }
            return res.status(400).json({
                Error: "Invalid credentials",
            });
        }
        else if (oldRider) {
            const secret = config_1.APP_SECRET + oldRider.password;
            const token = jsonwebtoken_1.default.sign({ email: oldRider.email, id: oldRider.id }, secret, { expiresIn: "10m" });
            const link = `${config_1.Base_Url}/users/resetpasswordd/${oldRider.id}`;
            if (token) {
                const html = (0, notification_1.emailHtml2)(link);
                yield (0, notification_1.mailSent2)(config_1.FromAdminMail, oldRider.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "password reset link sent to email",
                    link,
                });
            }
            return res.status(400).json({
                Error: "Invalid credentials",
            });
        }
        return res.status(400).json({
            message: "email not found",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgotpasswordd",
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPasswordGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const oldUser = (yield userModel_1.UserInstance.findOne({
        where: { id: id },
    }));
    if (!oldUser) {
        return res.status(400).json({
            message: "User Does Not Exist",
        });
    }
    const secret = config_1.APP_SECRET + oldUser.password;
    try {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        return res.status(200).json({
            email: oldUser.email,
            verify,
        });
    }
    catch (error) {
        res.send("Not Verified");
    }
});
exports.resetPasswordGet = resetPasswordGet;
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    const oldUser = (yield userModel_1.UserInstance.findOne({
        where: { id: id },
    }));
    const validateResult = validation_1.resetPasswordSchema.validate(req.body, validation_1.option);
    if (validateResult.error) {
        return res.status(400).json({
            Error: validateResult.error.details[0].message,
        });
    }
    if (!oldUser) {
        return res.status(400).json({
            message: "user does not exist",
        });
    }
    const secret = config_1.APP_SECRET + oldUser.password;
    console.log("secret", secret);
    try {
        //const verify = jwt.verify(token, secret) as unknown as JwtPayload
        //console.log("id:",verify)
        const encryptedPassword = yield bcrypt_1.default.hash(password, oldUser.salt);
        console.log("password", password);
        const updatedPassword = (yield userModel_1.UserInstance.update({
            password: encryptedPassword,
        }, { where: { id: id } }));
        return res.status(200).json({
            message: "you have succesfully changed your password",
            updatedPassword,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/reset-password/:id/:token",
        });
    }
});
exports.resetPasswordPost = resetPasswordPost;
/*********************** ORDER RIDE **************************/
const orderRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { pickupLocation, packageDescription, dropOffLocation, dropOffPhoneNumber, offerAmount, paymentMethod, } = req.body;
        const orderUUID = (0, uuid_1.v4)();
        //validate req body
        const validateResult = validation_1.orderRideSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //verify if user exist
        const user = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        if (user) {
            const riderCount = yield riderModel_1.RiderInstance.findAndCountAll();
            const length = riderCount.count;
            const allRider = yield riderModel_1.RiderInstance.findAll();
            // const selectedRider = allRider[randomDriver(length)]
            const { otp, expiry } = (0, notification_1.GenerateOTP)();
            const order = (yield orderModel_1.OrderInstance.create({
                id: orderUUID,
                pickupLocation,
                otp: otp,
                otp_expiry: expiry,
                packageDescription,
                dropOffLocation,
                dropOffPhoneNumber,
                offerAmount,
                paymentMethod,
                orderNumber: "" + Math.floor(Math.random() * 1000000000),
                status: "pending",
                dateCreated: new Date(),
                userId: user.id,
            }));
            console.error(order);
            return res.status(201).json({
                message: "Order created successfully",
                order,
            });
        }
        return res.status(400).json({
            Error: "user not found",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/order-ride",
            message: error,
        });
        // console.log(error)
    }
});
exports.orderRide = orderRide;
/*************************GET ALL ORDERS ****************************/
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const Orders = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { userId: user.id },
        });
        if (!Orders) {
            return res.status(400).json({
                message: "No orders found",
            });
        }
        res.status(200).json({
            message: "Orders fetched successfully",
            rows: Orders.rows,
            count: Orders.count,
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/get-all-orders",
            msg: error,
        });
    }
});
exports.getMyOrders = getMyOrders;
/*************************GET ALL COMPLETED ORDERS ****************************/
const getMyCompletedOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const completedOrders = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { userId: user.id, status: "completed" },
        });
        if (!completedOrders) {
            return res.status(400).json({
                message: "No orders found",
            });
        }
        return res.status(200).json({
            message: "Orders fetched successfully",
            completedOrders,
            count: completedOrders.count,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/get-all-orders",
            msg: error,
        });
    }
});
exports.getMyCompletedOrders = getMyCompletedOrders;
/**=========================choose payment method===========================**/
const updatePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { orderId } = req.params;
        const { paymentMethod } = req.body;
        const user = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const updatedOrder = (yield orderModel_1.OrderInstance.update({
            paymentMethod: paymentMethod,
        }, { where: { id: orderId } }));
        res.status(200).json({
            message: "Payment method updated successfully",
            updatedOrder,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/update-payment-method",
            msg: error,
        });
    }
});
exports.updatePaymentMethod = updatePaymentMethod;
//================================GET SINGLE ORDER ==========================\\
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.params;
        const Order = yield orderModel_1.OrderInstance.findOne({
            where: { id: ids },
        });
        if (!Order) {
            return res.status(400).json({
                message: "No order found",
            });
        }
        console.log(Order);
        res.status(200).json({
            message: "Order fetched successfully",
            Order,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/get-order",
            msg: error,
        });
    }
});
exports.getOrder = getOrder;
/******************   Delete Order By Id *********************/
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: userId },
        }));
        if (User) {
            const order = yield orderModel_1.OrderInstance.destroy({
                where: { id: id },
            });
            return res.status(200).json({
                message: "Order deleted successfully",
            });
        }
        return res.status(404).json({
            Error: "User not found",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server error",
            message: err,
            route: "users/delete-order",
        });
    }
});
exports.deleteOrder = deleteOrder;
//UPDATE MY NOTIFICATION
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notifyId } = req.params;
        const itemId = yield notification_2.NotificationInstance.findOne({
            where: { id: notifyId, userId: req.user.id }
        });
        if (!itemId) {
            return res.status(404).json("Invalid request");
        }
        const notification = yield notification_2.NotificationInstance.update({
            read: true,
        }, { where: { id: notifyId } });
        return res.status(200).json({
            notification
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server error",
            message: err,
            route: "users/my-notification"
        });
    }
});
exports.updateNotification = updateNotification;
//GET MY NOTIFICATION
const myNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notify = yield notification_2.NotificationInstance.findAll({
            where: { userId: req.user.id }
        });
        if (!notify) {
            return res.status(404).json("Invalid request");
        }
        return res.status(200).json({
            count: notify.length,
            notify
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server error",
            message: err,
            route: "users/my-notification"
        });
    }
});
exports.myNotification = myNotification;
