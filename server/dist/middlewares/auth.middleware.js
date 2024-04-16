"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
        throw new Error("did not recieve access token");
    }
    jsonwebtoken_1.default.verify(token, process.env.LOGIN_SECRET, (err, decoded) => {
        if (err) {
            throw new Error("can not access with token: " + token);
        }
        res.locals.userId = decoded.id;
        next();
    });
}
exports.default = { verifyToken };
