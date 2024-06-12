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
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_model_1 = __importDefault(require("../models/user.model"));
const portfolio_model_1 = __importDefault(require("../models/portfolio.model"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const mailsend_middleware_1 = __importDefault(require("../middlewares/mailsend.middleware"));
const config_util_1 = require("../utils/config.util");
dotenv_1.default.config();
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: path_1.default.resolve(__dirname, "..", "public/photos/") });
// @ts-expect-error user is Document
function getFullName(user) {
    var _a;
    return `${user.name} ${user.surname} ${(_a = user.paternalName) !== null && _a !== void 0 ? _a : ""}`;
}
function makeid(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const data = yield response.json();
        if (!data.response) {
            throw new Error("could not fetch data with url: " + url);
        }
        return data.response;
    });
}
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({});
        res.status(200).send(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get users: " + err);
    }
}));
router.route("/register").post(upload.none(), (0, express_validator_1.body)("email").notEmpty().isEmail(), (0, express_validator_1.body)("password").notEmpty(), (0, express_validator_1.body)("username").notEmpty(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username.split(" ");
        if (username.length < 2) {
            throw new Error("incorrect username input");
        }
        const name = username[0];
        const surname = username[1];
        let paternalName = null;
        if (username.length > 2)
            paternalName = username[2];
        const password = req.body.password;
        const email = req.body.email;
        const existUser = yield user_model_1.default.findOne({ email });
        if (existUser) {
            throw new Error("user already exsits: " + email);
        }
        const portfolio = yield portfolio_model_1.default.create({});
        const user = yield user_model_1.default.create({ name, surname, password, email });
        if (paternalName != null) {
            user.paternalName = paternalName;
        }
        portfolio.owner = user._id;
        user.portfolio = portfolio._id;
        yield portfolio.save();
        yield user.save();
        yield mailsend_middleware_1.default.sendVerifyEmail(user._id.toString());
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not register user " + err);
    }
}));
router.route("/login").post(upload.none(), (0, express_validator_1.body)("email").notEmpty().isEmail(), (0, express_validator_1.body)("password").notEmpty(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield user_model_1.default.findOne({ email });
        if (!user)
            throw new Error("could not find user with email: " + email);
        if (!bcrypt_1.default.compareSync(password, user.password))
            throw new Error("wrong password for user with email: " + email);
        const token = auth_middleware_1.default.generateToken(user.id, process.env.LOGIN_SECRET, 86400 * 365);
        res.status(200).send({
            user,
            accessToken: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not login user" + err);
    }
}));
router.route("/loginVK").post(upload.none(), (0, express_validator_1.body)("silentToken").notEmpty(), (0, express_validator_1.body)("uuid").notEmpty(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const silentToken = req.body.silentToken;
        const uuid = req.body.uuid;
        const vkApi = process.env.VK_API;
        let url = "https://api.vk.com/method/auth.exchangeSilentAuthToken?" + `v=5.131&token=${silentToken}&access_token=${vkApi}&uuid=${uuid}`;
        const generalData = yield fetchData(url);
        url = "https://api.vk.com/method/account.getProfileInfo?" + `v=5.131&access_token=${generalData.access_token}`;
        const profileData = yield fetchData(url);
        let user = yield user_model_1.default.findOne({ vkId: generalData.user_id });
        if (!user) {
            const portfolio = yield portfolio_model_1.default.create({});
            user = yield user_model_1.default.create({
                verified: true,
                vkId: generalData.user_id,
                name: profileData.first_name,
                surname: profileData.last_name,
                password: makeid(10),
                email: generalData.email,
                phoneNumber: profileData.phone,
            });
            portfolio.owner = user._id;
            user.portfolio = portfolio._id;
            yield portfolio.save();
            yield user.save();
        }
        const token = auth_middleware_1.default.generateToken(user.id, process.env.LOGIN_SECRET, 86400 * 365);
        res.status(200).send({
            user,
            accessToken: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not login user through VK" + err);
    }
}));
router.route("/me").get(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId }).populate({
            path: "portfolio",
            populate: {
                path: "achievements"
            }
        });
        if (!user)
            throw new Error("could not authenticate user with id: " + userId);
        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get user profile page: " + err);
    }
}));
router.route("/byEmail").get(upload.none(), (0, express_validator_1.body)("email").notEmpty().isEmail(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user)
            throw new Error("no user with email: " + email);
        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find user: " + err);
    }
}));
router.route("/me").put(auth_middleware_1.default.verifyToken, upload.single("avatar"), (0, express_validator_1.body)("bio").default(""), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const bio = req.body.bio;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user)
            throw new Error("could not authenticate user with id: " + userId);
        if (req.file) {
            user.avatar = req.file.filename;
        }
        user.bio = bio;
        yield user.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update user profile: " + err);
    }
}));
router.route("/reset").post(upload.none(), (0, express_validator_1.body)("email").notEmpty().isEmail(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user)
            throw new Error("could not find user with email: " + email);
        mailsend_middleware_1.default.sendResetEmail(user._id.toString());
        res.send(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not initiate password reset for user: " + err);
    }
}));
router.route("/verify/:id/:token").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ _id: req.params.id });
        if (!user)
            throw new Error("could not find user with id: " + req.params.id);
        jsonwebtoken_1.default.verify(req.params.token, process.env.VERIFICATION_SECRET, (err, decoded) => {
            if (err) {
                throw new Error("can not decode provided token: " + req.params.token);
            }
            if (decoded.id === req.params.id) {
                user.verified = true;
                user.save();
            }
            else {
                throw new Error("token does not match user id");
            }
        });
        res.status(200).redirect(config_util_1.siteUrl);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not verify user: " + err);
    }
}));
router.route("/reset/:id/:token").post(upload.none(), (0, express_validator_1.body)("password").notEmpty(), validate_middleware_1.default.validateForm, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ _id: req.params.id });
        const password = req.body.password;
        if (!user)
            throw new Error("could not find user with id: " + req.params.id);
        jsonwebtoken_1.default.verify(req.params.token, process.env.VERIFICATION_SECRET, (err, decoded) => {
            if (err) {
                throw new Error("can not decode provided token: " + req.params.token);
            }
            if (decoded.id === req.params.id) {
                user.password = password;
                user.save();
                res.sendStatus(200);
            }
            else {
                throw new Error("token does not match user id");
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not reset password for user: " + err);
    }
}));
router.route("/me/subscribe").get((0, express_validator_1.query)("query").default("").escape(), auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hasQuery = false;
        let searchKey = new RegExp("", "i");
        if (req.query.query) {
            hasQuery = true;
            searchKey = new RegExp(`${req.query.query}`, "i");
        }
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId }).populate({
            path: "subscriptions",
            populate: {
                path: "portfolio", populate: { path: "achievements" },
            }
        });
        if (!user)
            throw new Error("could not find user: " + userId);
        let subs = user.subscriptions;
        if (hasQuery) {
            subs = subs.filter((sub) => searchKey.test(getFullName(sub)));
        }
        res.send(subs);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get subscriptions for user: " + err);
    }
}));
router.route("/me/subscribe/:subId").put(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const subUser = yield user_model_1.default.findOne({ _id: req.params.subId });
        if (!user)
            throw new Error("could not find user: " + userId);
        if (!subUser)
            throw new Error("could not find target user: " + req.params.subId);
        if (user.subscriptions.includes(subUser._id)) {
            user.subscriptions = user.subscriptions.filter((sub) => sub._id.toString() != subUser._id.toString());
        }
        else {
            user.subscriptions.push(subUser._id);
        }
        yield user.save();
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not subscribe to user: " + err);
    }
}));
router.route("/:id").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ _id: req.params.id }).populate({
            path: "portfolio",
            populate: {
                path: "achievements"
            }
        });
        if (!user)
            throw new Error("no user with id: " + req.params.id);
        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find user: " + err);
    }
}));
exports.default = router;
//# sourceMappingURL=users.route.js.map