"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const riderController_1 = require("../controller/riderController");
const authorization_1 = require("../middleware/authorization");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
// router.post('/login', login)
router.post('/riders-signup', multer_1.upload.array('image', 3), riderController_1.registerRider);
router.post('/delivery-verify/:orderId', authorization_1.authRider, riderController_1.VerifyDeliveryOtp);
router.patch('/update-rider', authorization_1.authRider, riderController_1.updateRiderProfile);
router.post('/verify/:signature', riderController_1.VerifyUser);
router.get('/resend-otp/:signature', riderController_1.ResendOTP);
router.get('/rider-order-profile/:riderId', riderController_1.getRiderProfile);
router.get("/all-biddings", riderController_1.getAllBiddings);
router.get("/rider-history", authorization_1.authRider, riderController_1.RiderHistory);
router.get('/get-order-byId/:orderId', authorization_1.authRider, riderController_1.getUserOrderById);
router.get('/get-rider-earnings', authorization_1.authRider, riderController_1.RiderEarnings);
router.get('/get-rider', authorization_1.authRider, riderController_1.getRider);
router.patch("/accept-bid/:orderId", authorization_1.authRider, riderController_1.acceptBid);
router.get('/get-order-owner-name-byId/:orderOwnerId', riderController_1.getOrderOwnerNameById);
router.get('/delivery-resend-otp/:orderId', riderController_1.DeliveryResendOTP);
router.get('/rider-dashdoard-completed-orders', authorization_1.authRider, riderController_1.getMyCompletedRides);
router.get('/rider-dashboard-pending-orders', authorization_1.authRider, riderController_1.getAcceptedBid);
exports.default = router;
