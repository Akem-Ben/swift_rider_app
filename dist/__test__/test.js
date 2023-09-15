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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../config/index");
const app_1 = __importDefault(require("../app"));
const request = (0, supertest_1.default)(app_1.default);
let token;
//Test to get all orders for users
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.db.sync().then(() => {
        console.log('DB connected successfully');
    });
}));
describe("Testing rider accept order", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.db.sync().then(() => console.log("DB connected successfully")).catch(err => {
            console.log("DB connected successfully");
        });
    }));
    it('When rider acceps order', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request
            .get("/riders/rider-order-profile/4d6ae072-45e7-4ada-9332-976d56c8ac69")
            .expect(400)
            .set('Accept', 'application/json')
            .then((response) => {
            expect(response.body).toEqual(expect.arrayContaining([]));
        });
    }));
});
//Test to get all orders for users
describe("Testing pickup user history", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.db.sync().then(() => console.log("Database is connected")).catch(err => {
            console.log("Database is not connected");
        });
    }));
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImExNzA0MzY0LTBjZjQtNGE3YS1iZjVhLTYxNTUxZGRhYjg0NyIsImVtYWlsIjoiaWxvY2hpYnVpa2VAeWFob28uY29tIiwidmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE2NzM1OTYzNjMsImV4cCI6MTY3MzY4Mjc2M30.T8mDY-hAFt2VSSPdM0JPwBzh7K2Q-IHZvHl9a7E5qic";
    const wrongToken = "";
    it('When wrong token is passed', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request
            .get("/users/my-orders")
            .expect(401)
            .set({ authorization: `Bearer ${wrongToken}` })
            .then((response) => {
            expect(response.status).toBe(401);
        });
    }));
    it('When right token is passed', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request
            .get("/users/my-orders")
            .expect(200)
            .set({ authorization: `Bearer ${token}` })
            .then((response) => {
            expect(response.body).toHaveProperty("message");
        });
    }));
});
describe('Post/Get/Update/Delete', () => {
    describe('get route', () => {
        it('get rider-history should return 200', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).get('/riders/rider-history');
            expect(200);
        }));
    });
});
