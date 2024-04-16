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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const portfolio_model_1 = __importDefault(require("../models/portfolio.model"));
const certificate_model_1 = __importDefault(require("../models/certificate.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: path_1.default.resolve(__dirname, "..", "public/certificates/") });
router.route("/me/certificate").get(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_a = user === null || user === void 0 ? void 0 : user.portfolio) === null || _a === void 0 ? void 0 : _a.toString() });
        const certificate = yield certificate_model_1.default.create({});
        certificate.portfolio = portfolio === null || portfolio === void 0 ? void 0 : portfolio._id;
        portfolio === null || portfolio === void 0 ? void 0 : portfolio.certificates.push(certificate._id);
        yield certificate.save();
        yield (portfolio === null || portfolio === void 0 ? void 0 : portfolio.save());
        res.send(certificate);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create certificate in user portfolio");
    }
}));
router.route("/me/certificate/:certificateId").put(auth_middleware_1.default.verifyToken, upload.single("certificate"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const body = req.body;
        const certificate = yield certificate_model_1.default.findOne({ _id: req.params.certificateId });
        if (((_b = certificate === null || certificate === void 0 ? void 0 : certificate.portfolio) === null || _b === void 0 ? void 0 : _b._id.toString()) != ((_c = user === null || user === void 0 ? void 0 : user.portfolio) === null || _c === void 0 ? void 0 : _c._id.toString()))
            throw new Error();
        if (certificate && req.file) {
            if (certificate.photo) {
                const photoName = path_1.default.resolve(__dirname, "..", "public/certificates/" + (certificate === null || certificate === void 0 ? void 0 : certificate.photo));
                fs_1.default.unlink(photoName, (err) => { if (err)
                    console.error(err); });
            }
            certificate.description = body.description;
            certificate.photo = req.file.filename;
            certificate.save();
        }
        else {
            throw new Error();
        }
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update certificate with id: " + req.params.certificateId);
    }
}));
router.route("/me/certificate/:certificatedId").delete(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_d = user === null || user === void 0 ? void 0 : user.portfolio) === null || _d === void 0 ? void 0 : _d.toString() });
        const certificate = yield certificate_model_1.default.findOne({ _id: req.params.certificatedId });
        if (((_e = certificate === null || certificate === void 0 ? void 0 : certificate.portfolio) === null || _e === void 0 ? void 0 : _e._id.toString()) != (portfolio === null || portfolio === void 0 ? void 0 : portfolio._id.toString()))
            throw new Error();
        yield certificate_model_1.default.deleteOne({ _id: req.params.certificatedId });
        if (certificate === null || certificate === void 0 ? void 0 : certificate.photo) {
            const photoName = path_1.default.resolve(__dirname, "..", "public/certificates/" + (certificate === null || certificate === void 0 ? void 0 : certificate.photo));
            fs_1.default.unlink(photoName, (err) => { if (err)
                console.error(err); });
        }
        if (portfolio && certificate) {
            portfolio.certificates = portfolio === null || portfolio === void 0 ? void 0 : portfolio.certificates.filter((el) => el._id.toString() != certificate._id.toString());
        }
        yield (portfolio === null || portfolio === void 0 ? void 0 : portfolio.save());
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete certificate with id: " + req.params.certificatedId);
    }
}));
exports.default = router;
