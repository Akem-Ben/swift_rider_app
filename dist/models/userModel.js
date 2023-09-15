"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const orderModel_1 = require("./orderModel");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please input phone number",
            },
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email address is required",
            },
            isEmail: {
                msg: "Please provide a valid email",
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please input password",
            },
        },
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    passport: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
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
    longitude: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    latitude: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "user must be verified"
            },
            notEmpty: {
                msg: "User not verified"
            }
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: "user",
});
UserInstance.hasMany(orderModel_1.OrderInstance, { foreignKey: 'userId', as: 'order' });
orderModel_1.OrderInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'user' });
