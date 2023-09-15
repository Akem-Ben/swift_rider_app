"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./routes/user"));
const rider_1 = __importDefault(require("./routes/rider"));
const index_1 = __importDefault(require("./routes/index"));
const admin_1 = __importDefault(require("./routes/admin"));
const chat_1 = __importDefault(require("./routes/chat"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const config_2 = require("./config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Sequelize connection
config_1.db.sync().then(() => {
    console.log('DB connected successfully');
}).catch(err => {
    console.log(err);
});
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({}));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
//Router middleware
app.use('/users', user_1.default);
app.use('/', index_1.default);
app.use('/riders', rider_1.default);
app.use('/admin', admin_1.default);
app.use('/chat', chat_1.default);
app.listen(config_2.port, () => {
    console.log(`Server running on Port ${config_2.port}`);
});
exports.default = app;
