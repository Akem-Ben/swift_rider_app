"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class OrderInstance extends sequelize_1.Model {
}
exports.OrderInstance = OrderInstance;
OrderInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "otp required",
            },
        },
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp expired"
            },
            notEmpty: {
                msg: "provide an Otp"
            },
        }
    },
    pickupLocation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "pick up location is required",
            },
            notEmpty: {
                msg: "provide a pickup location",
            },
        },
    },
    packageDescription: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "package description is required",
            },
            notEmpty: {
                msg: "provide package description",
            },
        },
    },
    dropOffLocation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Drop of location is required",
            },
            notEmpty: {
                msg: "provide drop of location",
            },
        },
    },
    dropOffPhoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Drop off phone number is required",
            },
            notEmpty: {
                msg: "provide a drop off phone number",
            },
        },
    },
    offerAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    orderNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    dateCreated: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    acceptedTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    completedTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    riderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    }
}, {
    sequelize: config_1.db,
    tableName: "order",
});
