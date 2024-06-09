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
const comment_model_1 = __importDefault(require("../models/comment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const express_validator_1 = require("express-validator");
const achievement_model_1 = require("../models/achievement.model");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route("/achievement/:achievementId/comment").post(auth_middleware_1.default.verifyToken, upload.none(), (0, express_validator_1.body)("content").notEmpty(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const achievement = yield achievement_model_1.Achievement.findOne({ _id: req.params.achievementId });
        if (!achievement)
            throw new Error("could not find achievement: " + req.params.achievementId);
        const comment = yield comment_model_1.default.create({ content: req.body.content });
        achievement.comments.push(comment._id);
        comment.author = user._id;
        comment.achievement = achievement._id;
        yield comment.save();
        yield achievement.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not comment: " + err);
    }
}));
router.route("/comment/:commentId").put(auth_middleware_1.default.verifyToken, upload.none(), (0, express_validator_1.body)("content").notEmpty(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const comment = yield comment_model_1.default.findOne({ _id: req.params.commentId, author: user._id });
        if (!comment)
            throw new Error("could not find comment with id: " + req.params.commentId);
        comment.content = req.body.content;
        yield comment.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update comment: " + err);
    }
}));
router.route("/comment/:commentId").delete(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not find user: " + userId);
        const comment = yield comment_model_1.default.findOne({ _id: req.params.commentId, author: user._id });
        if (!comment)
            throw new Error("could not find comment with id: " + req.params.commentId);
        yield comment_model_1.default.deleteOne({ _id: req.params.commentId });
        const achievement = yield achievement_model_1.Achievement.findOne({ _id: comment.achievement });
        if (!achievement)
            throw new Error("could not find achievement: " + comment.achievement);
        achievement.comments = achievement.comments.filter((el) => el._id.toString() != comment._id.toString());
        yield achievement.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete comment: " + err);
    }
}));
exports.default = router;
//# sourceMappingURL=comments.route.js.map