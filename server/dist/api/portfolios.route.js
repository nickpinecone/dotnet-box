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
const express_1 = __importDefault(require("express"));
const portfolio_model_1 = __importDefault(require("../models/portfolio.model"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const projects_route_1 = __importDefault(require("./projects.route"));
const certificates_route_1 = __importDefault(require("./certificates.route"));
const multer_1 = __importDefault(require("multer"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const portfolios = yield portfolio_model_1.default.find({}).sort({ createdAt: -1 }).populate("owner projects certificates");
    res.send(portfolios);
}));
router.route("/me").get(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_a = user === null || user === void 0 ? void 0 : user.portfolio) === null || _a === void 0 ? void 0 : _a.toString() }).populate("owner projects certificates");
        if (portfolio == null)
            throw new Error();
        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get user portfolio");
    }
}));
router.route("/me").put(auth_middleware_1.default.verifyToken, upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const description = req.body.description;
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_b = user === null || user === void 0 ? void 0 : user.portfolio) === null || _b === void 0 ? void 0 : _b.toString() });
        if (portfolio == null)
            throw new Error();
        portfolio.description = description;
        portfolio.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update user portfolio");
    }
}));
router.route("/:id").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolio_model_1.default.findOne({ _id: req.params.id }).populate("owner projects certificates");
        if (portfolio == null)
            throw new Error();
        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio with id: " + req.params.id);
    }
}));
router.use("/", projects_route_1.default);
router.use("/", certificates_route_1.default);
exports.default = router;
