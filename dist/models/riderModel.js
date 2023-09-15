"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderInstance = void 0;
const sequelize_1 = require("sequelize");
//import {v4 as uuidv4 } from 'uuid';
const config_1 = require("../config");
const orderModel_1 = require("./orderModel");
class RiderInstance extends sequelize_1.Model {
}
exports.RiderInstance = RiderInstance;
RiderInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Email address is required'
            },
            isEmail: {
                msg: "please provide only valid email"
            }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "password is required"
            },
            notEmpty: {
                msg: "provide a password",
            },
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Name is required"
            },
            notEmpty: {
                msg: "please input your name"
            },
        }
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    validID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    passport: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    documents: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "phone number is required"
            },
            notEmpty: {
                msg: "provide a phone number",
            },
        }
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp is required"
            },
            notEmpty: {
                msg: "provdide an Otp",
            },
        }
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp expired",
            },
            notEmpty: {
                msg: "provdide an Otp",
            },
        }
    },
    plateNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lat: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    lng: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: 'rider'
});
RiderInstance.hasMany(orderModel_1.OrderInstance, {
    foreignKey: "riderId",
    as: "order"
});
orderModel_1.OrderInstance.belongsTo(RiderInstance, {
    foreignKey: "riderId",
    as: "rider"
});
