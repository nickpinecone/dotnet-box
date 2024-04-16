"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const portfolios_route_1 = __importDefault(require("./api/portfolios.route"));
const users_route_1 = __importDefault(require("./api/users.route"));
const photos_route_1 = __importDefault(require("./api/photos.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/portfolios", portfolios_route_1.default);
app.use("/api/users", users_route_1.default);
app.use("/api/photos", photos_route_1.default);
app.use("*", (req, res) => {
    res.status(404).json({ error: "page not found" });
});
exports.default = app;
