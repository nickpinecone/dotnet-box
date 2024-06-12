"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverUrl = exports.siteUrl = exports.isDevelopment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.isDevelopment = process.env.MODE === "dev";
exports.siteUrl = exports.isDevelopment ? "localhost:3000" : "https://threedotsellipsis.github.io/digital-portfolio/";
exports.serverUrl = exports.isDevelopment ? "localhost:4000" : "185.211.170.35";
//# sourceMappingURL=config.util.js.map