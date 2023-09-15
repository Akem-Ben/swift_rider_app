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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcceptedBid = exports.getMyCompletedRides = exports.getRider = exports.RiderEarnings = exports.DeliveryResendOTP = exports.VerifyDeliveryOtp = exports.getRiderProfile = exports.RiderHistory = exports.getOrderById = exports.acceptBid = exports.getAllBiddings = exports.ResendOTP = exports.VerifyUser = exports.updateRiderProfile = exports.getOrderOwnerNameById = exports.getUserOrderById = exports.registerRider = void 0;
const riderModel_1 = require("../models/riderModel");
const validation_1 = require("../utils/validation");
const uuid_1 = require("uuid");
const notification_1 = require("../utils/notification");
const config_1 = require("../config");
const orderModel_1 = require("../models/orderModel");
const userModel_1 = require("../models/userModel");
const notification_2 = require("../models/notification");
//@desc Register rider
//@route Post /rider/signup
//@access Public
const registerRider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword, phone, city, passport, validId, documents, plateNumber, } = req.body;
        console.log(req.body);
        const uuidrider = (0, uuid_1.v4)();
        const validateResult = validation_1.riderRegisterSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        const salt = yield (0, validation_1.GenerateSalt)();
        //trim the incoming email
        const newEmail = email.trim().toLowerCase();
        const userPassword = yield (0, validation_1.GeneratePassword)(password, salt);
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        const riderEmail = (yield riderModel_1.RiderInstance.findOne({
            where: { email: newEmail },
        }));
        const riderPhone = (yield riderModel_1.RiderInstance.findOne({
            where: { phone: phone },
        }));
        const isUserEmail = (yield userModel_1.UserInstance.findOne({
            where: { email: newEmail },
        }));
        const isUserPhone = (yield riderModel_1.RiderInstance.findOne({
            where: { phone: phone },
        }));
        let images = req.files;
        console.log("images", images);
        if (!riderEmail && !riderPhone && !isUserEmail && !isUserPhone) {
            let rider = yield riderModel_1.RiderInstance.create({
                id: uuidrider,
                name,
                email: newEmail,
                password: userPassword,
                salt,
                phone,
                documents: images[0].path,
                validID: images[2].path,
                city,
                passport: images[1].path,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "rider",
                plateNumber,
            });
            console.log(req.files);
            const html = (0, notification_1.emailHtml)(otp);
            yield (0, notification_1.mailSent)(config_1.FromAdminMail, newEmail, config_1.userSubject, html);
            const Rider = (yield riderModel_1.RiderInstance.findOne({
                where: { email: newEmail },
            }));
            let signature = yield (0, validation_1.GenerateSignature)({
                id: Rider.id,
                email: Rider.email,
                verified: Rider.verified,
            });
            return res.status(201).json({
                message: "Rider created successfully",
                signature,
                verified: Rider.verified,
            });
        }
        return res.status(400).json({ message: "Rider already exist" });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server error",
            message: err.stack,
            route: "/riders/signup",
            err,
        });
    }
});
exports.registerRider = registerRider;
const getUserOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.rider;
        const { orderId } = req.params;
        const rider = (yield riderModel_1.RiderInstance.findOne({
            where: { id: id },
        }));
        if (rider) {
            const myOrder = yield orderModel_1.OrderInstance.findOne({
                where: { id: orderId },
                include: [
                    {
                        model: userModel_1.UserInstance,
                        as: "user",
                        attributes: ["name"],
                    },
                ],
            });
            return res.status(200).json({
                message: "successfully fetched order by Id",
                myOrder,
            });
        }
        return res.status(401).json({
            Error: "user not authorized",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal server error",
            route: "riders/get-order-byId/",
        });
    }
});
exports.getUserOrderById = getUserOrderById;
const getOrderOwnerNameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderOwnerId } = req.params;
        const orderOwnerDetails = (yield userModel_1.UserInstance.findOne({
            where: { id: orderOwnerId },
        }));
        if (orderOwnerDetails) {
            return res.status(200).json({
                message: "successfully fetched order by Id",
                owner: orderOwnerDetails.name,
            });
        }
        return res.status(404).json({
            Error: "Not Found",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal server error",
            route: "riders/get-order-owner-name-byId/",
        });
    }
});
exports.getOrderOwnerNameById = getOrderOwnerNameById;
const updateRiderProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.rider;
        const { name, phone, email } = req.body;
        const validateResult = validation_1.updateRiderSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        const User = (yield riderModel_1.RiderInstance.findOne({
            where: { id: id },
        }));
        //trim incoming email
        const newEmail = email.trim().toLowerCase();
        if (User) {
            const newUser = (yield riderModel_1.RiderInstance.update({
                name,
                phone,
                email: newEmail,
            }, { where: { id: id } }));
            if (newUser) {
                const User = (yield riderModel_1.RiderInstance.findOne({
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
        return res.status(401).json({
            Error: "You are not authorized"
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/riders/update-rider",
        });
    }
});
exports.updateRiderProfile = updateRiderProfile;
/**==================Verify Users==================== **/
const VerifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, validation_1.verifySignature)(token);
        // check if user is a registered user
        const User = (yield riderModel_1.RiderInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp } = req.body;
            //check if the otp submitted by the user is correct and is same with the one in the database
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                //update user
                const updatedUser = (yield riderModel_1.RiderInstance.update({ verified: true }, { where: { email: decode.email } }));
                // Generate a new Signature
                let signature = yield (0, validation_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (yield riderModel_1.RiderInstance.findOne({
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
        const User = (yield riderModel_1.RiderInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            //Generate otp
            const { otp, expiry } = (0, notification_1.GenerateOTP)();
            //update user
            const updatedUser = (yield riderModel_1.RiderInstance.update({ otp, otp_expiry: expiry }, { where: { email: decode.email } }));
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
//==========get all pending bids===========\\
const getAllBiddings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page } = req.query;
        limit = limit || 20;
        const offset = page ? page * limit : 0;
        const currentPage = page ? +page : 0;
        const bidding = yield orderModel_1.OrderInstance.findAndCountAll({
            limit: limit,
            offset: offset,
            where: { status: "pending" },
        });
        const { count, rows } = bidding;
        const totalPages = Math.ceil(count / limit);
        if (bidding) {
            return res.status(200).json({
                message: "You have successfully retrieved all pending bids",
                count,
                rows,
                currentPage,
                totalPages,
            });
        }
        return res.status(400).json({
            Error: "Error retrieving biddings",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/all-biddings",
            message: err,
        });
    }
});
exports.getAllBiddings = getAllBiddings;
//============== Rider accept bid==================\\
const acceptBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.rider;
        const { orderId } = req.params;
        const rider = yield riderModel_1.RiderInstance.findOne({ where: { id: id } });
        const order = yield orderModel_1.OrderInstance.findOne({ where: { id: orderId } });
        if (rider) {
            const { otp, expiry } = (0, notification_1.GenerateOTP)();
            const updatedBidding = yield orderModel_1.OrderInstance.update({ status: "accepted", riderId: id, acceptedTime: new Date() }, { where: { id: orderId } });
            // const order = await OrderInstance.findOne({ where: { riderId: id } }) as unknown as OrderAttribute
            const user = yield userModel_1.UserInstance.findOne({ where: { id: order.dataValues.userId } });
            const html = (0, notification_1.emailHtml)(otp);
            yield (0, notification_1.mailSent)(config_1.FromAdminMail, user.email, config_1.userSubject, html);
            //  console.log("updated bid", order)
            if (updatedBidding) {
                yield notification_2.NotificationInstance.create({
                    id: (0, uuid_1.v4)(),
                    notificationType: "Accepted",
                    riderId: id,
                    orderId: orderId,
                    userId: order.dataValues.userId,
                    description: order.dataValues.packageDescription,
                    read: false
                });
                return res.status(200).json({
                    message: "Rider has accepted your order",
                    data: {
                        rider,
                        user
                    }
                });
            }
            return res.status(400).json({
                Error: "Error accepting bid",
            });
        }
        return res.status(400).json({
            Error: "You are not authorised to view this page",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/rider/accept-bid/:id",
            message: err,
        });
    }
});
exports.acceptBid = acceptBid;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const riderId = req.rider.id;
        const rider = (yield riderModel_1.RiderInstance.findOne({
            where: { id: riderId },
        }));
        if (rider) {
            const order = (yield orderModel_1.OrderInstance.findOne({
                where: { id: id },
            }));
            if (order) {
                return res.status(200).json({
                    message: "Order retrieved successfully",
                    order,
                });
            }
        }
        return res.status(400).json({
            Error: "Not authorized",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/rider/get-order-by-id/:id",
        });
    }
});
exports.getOrderById = getOrderById;
/**============================Rider History=========================== **/
const RiderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.rider.id;
        const Rider = yield riderModel_1.RiderInstance.findOne({ where: { id: id } });
        if (Rider) {
            const history = yield orderModel_1.OrderInstance.findAndCountAll({
                where: { riderId: id },
            });
            if (!history)
                return res.status(404).json({
                    Error: "no data available",
                });
            return res.status(200).json({
                rows: history.rows,
                count: history.count,
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/riders/rider-history",
            err: err,
        });
    }
});
exports.RiderHistory = RiderHistory;
/** ============= Get Rider Profile  =====================*/
const getRiderProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { riderId } = req.params;
        const order = yield orderModel_1.OrderInstance.findOne({
            where: { riderId: riderId },
            include: [
                {
                    model: riderModel_1.RiderInstance,
                    as: "rider",
                    attributes: ["id", "name", "phone", "plateNumber", "passport"],
                },
            ],
        });
        if (order) {
            return res.status(200).json({
                message: "You have successfully retrieved your profile",
                order,
            });
        }
        return res.status(400).json({
            Error: "Error retrieving profile",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/rider-order-profile",
            message: err,
        });
    }
});
exports.getRiderProfile = getRiderProfile;
/**==================Delivery OTP==================== **/
const VerifyDeliveryOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const riderId = req.rider.id;
        // const token = req.params.signature    // const decode = await verifySignature(riderId)
        // // check if user is a registered user
        const order = (yield orderModel_1.OrderInstance.findOne({
            where: { id: orderId, riderId: riderId, status: "accepted" },
        }));
        console.log(order);
        if (order) {
            //check if the otp submitted by the user is correct and is same with the one in the database
            const { otp } = req.body;
            const hour = 100 * 60 * 60;
            const anHour = Date();
            const newDate = new Date();
            const getHrAgo = (e) => {
                return new Date(e - hour);
            };
            if (order.otp == parseInt(otp) && order.otp_expiry >= getHrAgo(newDate)) {
                //update user
                const updatedOrder = (yield orderModel_1.OrderInstance.update({ status: "completed", completedTime: new Date() }, { where: { otp: order.otp } }));
                console.log(order);
                if (updatedOrder) {
                    const Order = (yield orderModel_1.OrderInstance.findOne({
                        where: { id: orderId },
                    }));
                    return res.status(200).json({
                        message: "Otp successfully verified",
                    });
                }
                return res.status(400).json({
                    Error: "invalid credentials or OTP already expired",
                });
            }
            return res.status(400).json({
                Error: "OTP has expired",
            });
        }
        return res.status(400).json({
            Error: "Order does not exist",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/riders/delivery-verify",
        });
    }
});
exports.VerifyDeliveryOtp = VerifyDeliveryOtp;
/**============================Resend OTP=========================== **/
const DeliveryResendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        // const riderId = req.rider.id;
        console.log(orderId);
        const order = (yield orderModel_1.OrderInstance.findOne({
            where: { id: orderId },
        }));
        console.log("oder", order);
        if (order) {
            //Generate otp
            const { otp, expiry } = (0, notification_1.GenerateOTP)();
            //update user
            const updatedOrder = (yield orderModel_1.OrderInstance.update({ otp: otp, otp_expiry: expiry }, { where: { id: order.id } }));
            if (updatedOrder) {
                //Send OTP to user
                // await onRequestOTP(otp, User.phone);
                //send Email
                const user = (yield userModel_1.UserInstance.findOne({
                    where: { id: order.userId },
                }));
                const html = (0, notification_1.emailHtml)(otp);
                yield (0, notification_1.mailSent)(config_1.FromAdminMail, user.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resent successfully, kindly check your email or phone number for OTP verification",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/riders/resend-otp/:signature",
        });
    }
});
exports.DeliveryResendOTP = DeliveryResendOTP;
/**============================Earnings=========================== **/
const RiderEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.rider.id;
        const Rider = yield riderModel_1.RiderInstance.findOne({ where: { id: req.rider.id } });
        if (Rider) {
            const result = yield orderModel_1.OrderInstance.findAndCountAll({
                limit: 10,
                offset: 0,
                order: [["completedTime", "DESC"]],
                where: {
                    riderId: id,
                    status: "completed",
                },
            });
            return res.status(201).json({
                message: "You have successfully retrieved your earnings",
                rows: result.rows,
                count: result.count,
            });
        }
        return res.status(401).json({
            Error: "You must be a registered rider",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/riders/rider-earnings",
            err: err,
        });
    }
});
exports.RiderEarnings = RiderEarnings;
/**==================Get Rider Details==================== **/
const getRider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.rider;
        const isRider = (yield riderModel_1.RiderInstance.findOne({
            where: { id: id },
            attributes: ["name", "phone", "email"]
        }));
        if (!isRider)
            return res.status(404).json({
                Error: "User not found"
            });
        return res.status(200).json({
            message: "request was successful",
            isRider
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server error",
            route: "rider/get-user-profile"
        });
    }
});
exports.getRider = getRider;
/*************************GET ALL COMPLETED ORDERS ****************************/
const getMyCompletedRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.rider;
        const user = (yield riderModel_1.RiderInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const completedOrders = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { riderId: id, status: "completed" },
        });
        if (!completedOrders) {
            return res.status(400).json({
                message: "No orders found",
            });
        }
        return res.status(200).json({
            message: "Orders fetched successfully",
            count: completedOrders.count,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/riders-completed-rides",
            msg: error,
        });
    }
});
exports.getMyCompletedRides = getMyCompletedRides;
//==========================GET Accepted Biddings====================**/
const getAcceptedBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.rider;
        const user = (yield riderModel_1.RiderInstance.findOne({
            where: { id: id },
        }));
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const Orders = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { riderId: id, status: "accepted" },
        });
        if (!Orders) {
            return res.status(400).json({
                message: "No orders found",
            });
        }
        return res.status(200).json({
            message: "Orders fetched successfully",
            rows: Orders.rows,
            count: Orders.count,
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/get-all-rides",
            msg: error,
        });
    }
});
exports.getAcceptedBid = getAcceptedBid;
