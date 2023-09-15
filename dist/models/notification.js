"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const orderModel_1 = require("./orderModel");
const userModel_1 = require("./userModel");
class NotificationInstance extends sequelize_1.Model {
}
exports.NotificationInstance = NotificationInstance;
NotificationInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    notificationType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "notificationType is required" },
            notEmpty: { msg: "Provide a notificationType " },
            // isIn: [["Order request", "rating"]],
        },
    },
    riderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    orderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    read: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "unread",
    },
}, {
    sequelize: config_1.db,
    tableName: "notifications",
});
NotificationInstance.belongsTo(orderModel_1.OrderInstance, {
    as: "order",
});
NotificationInstance.belongsTo(userModel_1.UserInstance, {
    foreignKey: "userId",
    as: "user",
});
