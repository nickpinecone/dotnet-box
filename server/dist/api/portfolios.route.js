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
const achievements_route_1 = __importDefault(require("./achievements.route"));
const multer_1 = __importDefault(require("multer"));
const user_model_1 = __importDefault(require("../models/user.model"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const express_validator_1 = require("express-validator");
const achievement_model_1 = require("../models/achievement.model");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolios = yield portfolio_model_1.default.find({}).sort({ createdAt: -1 })
            .populate("owner").populate({ path: "achievements" });
        res.send(portfolios);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get portfolios: " + err);
    }
}));
router.route("/search").get((0, express_validator_1.query)("query").default("").escape(), (0, express_validator_1.query)("limit").default("10").escape(), (0, express_validator_1.query)("theme").default(achievement_model_1.AchThemes[0]).escape(), (0, express_validator_1.query)("type").default(achievement_model_1.AchTypes[0]).escape(), (0, express_validator_1.query)("sort").default(achievement_model_1.AchSorts[0]).escape(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let searchQuery = {};
        if (req.query.query) {
            const searchKey = new RegExp(`${req.query.query}`, 'i');
            searchQuery = {
                $or: [
                    { "title": searchKey },
                    { "shortDescription": searchKey },
                    { "fullDescription": searchKey },
                ]
            };
        }
        const limit = Number(req.query.limit);
        let achievements = yield achievement_model_1.Achievement.find(searchQuery).limit(limit);
        if (req.query.theme != achievement_model_1.AchThemes[0]) {
            achievements = achievements.filter((ach) => ach.theme === req.query.theme);
        }
        if (req.query.type != achievement_model_1.AchTypes[0]) {
            achievements = achievements.filter((ach) => ach.type === req.query.type);
        }
        if (req.query.sort != achievement_model_1.AchSorts[0]) {
            if (req.query.sort == achievement_model_1.AchSorts[1]) {
                achievements.sort((ach) => ach.likeAmount);
            }
        }
        res.status(200).send(achievements);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not search for achievements: " + err);
    }
}));
router.route("/me").get(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_a = user.portfolio) === null || _a === void 0 ? void 0 : _a.toString() })
            .populate("owner").populate({ path: "achievements" });
        if (!portfolio)
            throw new Error("user doesnt have portfolio");
        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get user portfolio: " + err);
    }
}));
router.route("/me").put(auth_middleware_1.default.verifyToken, upload.none(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const description = req.body.description;
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_b = user.portfolio) === null || _b === void 0 ? void 0 : _b.toString() });
        if (!portfolio)
            throw new Error("user doesnt have portfolio");
        portfolio.description = description;
        yield portfolio.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update user portfolio: " + err);
    }
}));
router.route("/:id").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolio = yield portfolio_model_1.default.findOne({ _id: req.params.id })
            .populate("owner").populate({ path: "achievements" });
        if (!portfolio)
            throw new Error("could not find portfolio with id: " + req.params.id);
        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio: " + err);
    }
}));
router.use("/", achievements_route_1.default);
exports.default = router;
//# sourceMappingURL=portfolios.route.js.map