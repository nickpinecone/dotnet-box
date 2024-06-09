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
const multer_1 = __importDefault(require("multer"));
const portfolio_model_1 = __importDefault(require("../models/portfolio.model"));
const achievement_model_1 = require("../models/achievement.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const express_validator_1 = require("express-validator");
const comments_route_1 = __importDefault(require("./comments.route"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("node:fs/promises"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const base = path_1.default.resolve(__dirname, "..", "public");
        if (file.fieldname == "photo") {
            cb(null, base + "/photos");
        }
        else {
            cb(null, base + "/files");
        }
    },
    filename: function (req, file, cb) {
        cb(null, (new Date()).toISOString() + "-" + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
function removeFile(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const photoName = path_1.default.resolve(__dirname, "..", "public/files/" + name);
        try {
            yield promises_1.default.unlink(photoName);
        }
        catch (err) {
            console.error(err);
        }
    });
}
router.route("/achievement/:achievementId").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const achievement = yield achievement_model_1.Achievement.findOne({ _id: req.params.achievementId })
            .populate("members").populate({ path: "comments", populate: "author" }).populate("portfolio");
        if (!achievement)
            throw new Error("no achievement with id: " + req.params.achievementId);
        res.send(achievement);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find achievement: " + err);
    }
}));
router.route("/me/achievement").post(auth_middleware_1.default.verifyToken, upload.fields([{ name: "photo", maxCount: 1 }, { name: "files" }]), (0, express_validator_1.body)("type").default(""), (0, express_validator_1.body)("theme").default(""), (0, express_validator_1.body)("title").default(""), (0, express_validator_1.body)("shortDescription").default(""), (0, express_validator_1.body)("fullDescription").default(""), (0, express_validator_1.body)("url").default(""), (0, express_validator_1.query)("members").toArray().default([]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_a = user.portfolio) === null || _a === void 0 ? void 0 : _a.toString() });
        if (!portfolio)
            throw new Error("user doesnt have portfolio");
        const type = req.body.type;
        const theme = req.body.theme;
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const fullDescription = req.body.fullDescription;
        const url = req.body.url;
        const members = req.query.members;
        const achievement = yield achievement_model_1.Achievement.create({ type, theme, title, shortDescription, fullDescription, url });
        for (let i = 0; i < members.length; i++) {
            const memberId = members[i];
            const member = yield user_model_1.default.findById(memberId);
            if (!member)
                throw new Error("could not find member with id: " + memberId);
            achievement.members.push(member._id);
        }
        //@ts-expect-error photo is multer fields
        if (req.files.photo) {
            //@ts-expect-error photo is multer fields
            achievement.photo = req.files.photo[0].filename;
        }
        //@ts-expect-error who does that?
        if (req.files.files) {
            //@ts-expect-error no comments
            req.files.files.forEach((file) => {
                achievement.files.push(file.filename);
            });
        }
        achievement.portfolio = portfolio._id;
        portfolio.achievements.push(achievement._id);
        yield achievement.save();
        yield portfolio.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create achievement in user portfolio: " + err);
    }
}));
router.route("/me/achievement/like/:achievementId").put(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const achievement = yield achievement_model_1.Achievement.findOne({ _id: req.params.achievementId });
        if (!achievement)
            throw new Error("could not find achievement: " + req.params.achievementId);
        if (user.liked.every((post) => post._id.toString() != achievement._id.toString())) {
            if (!achievement.likeAmount) {
                achievement.likeAmount = 0;
            }
            achievement.likeAmount += 1;
            user.liked.push(achievement._id);
        }
        else {
            if (achievement.likeAmount) {
                achievement.likeAmount -= 1;
            }
            user.liked = user.liked.filter((post) => post._id.toString() != achievement._id.toString());
        }
        yield achievement.save();
        yield user.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Could not like achievement: " + err);
    }
}));
router.route("/me/achievement/:achievementId").put(auth_middleware_1.default.verifyToken, upload.fields([{ name: "photo", maxCount: 1 }, { name: "files" }]), (0, express_validator_1.body)("title").default(""), (0, express_validator_1.body)("type").default(""), (0, express_validator_1.body)("theme").default(""), (0, express_validator_1.body)("shortDescription").default(""), (0, express_validator_1.body)("fullDescription").default(""), (0, express_validator_1.body)("url").default(""), (0, express_validator_1.query)("members").toArray().default([]), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const achievement = yield achievement_model_1.Achievement.findOne({ _id: req.params.achievementId, portfolio: user.portfolio });
        if (!achievement)
            throw new Error("could not find achievement: " + req.params.achievementId);
        //@ts-expect-error photo is multer fields
        if (req.files.photo) {
            //@ts-expect-error photo is multer fields
            achievement.photo = req.files.photo[0].filename;
        }
        //@ts-expect-error files is multer fields
        if (req.files.files) {
            if (achievement.files) {
                achievement.files.forEach((file) => {
                    removeFile(file);
                });
            }
            achievement.files = [];
            //@ts-expect-error it is an array
            req.files.files.forEach((file) => {
                achievement.files.push(file.filename);
            });
        }
        achievement.type = req.body.type;
        achievement.title = req.body.title;
        achievement.theme = req.body.theme;
        achievement.shortDescription = req.body.shortDescription;
        achievement.fullDescription = req.body.fullDescription;
        achievement.url = req.body.url;
        const members = req.query.members;
        achievement.members = [];
        for (let i = 0; i < members.length; i++) {
            const memberId = members[i];
            const member = yield user_model_1.default.findById(memberId);
            if (!member)
                throw new Error("could not find member with id: " + memberId);
            achievement.members.push(member._id);
        }
        yield achievement.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update achievement: " + err);
    }
}));
router.route("/me/achievement/:achievementId").delete(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_b = user.portfolio) === null || _b === void 0 ? void 0 : _b.toString() });
        if (!portfolio)
            throw new Error("user doesnt have portfolio: " + userId);
        const achievement = yield achievement_model_1.Achievement.findOne({ _id: req.params.achievementId, portfolio: user.portfolio });
        if (!achievement)
            throw new Error("could not find achievement: " + req.params.achievementId);
        if (achievement.files) {
            achievement.files.forEach((file) => {
                removeFile(file);
            });
        }
        yield achievement_model_1.Achievement.deleteOne({ _id: req.params.achievementId });
        portfolio.achievements = portfolio.achievements.filter((el) => el._id.toString() != achievement._id.toString());
        yield portfolio.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete achievement: " + err);
    }
}));
router.use("/", comments_route_1.default);
exports.default = router;
//# sourceMappingURL=achievements.route.js.map