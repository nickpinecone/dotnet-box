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
const project_model_1 = __importDefault(require("../models/project.model"));
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route("/me/project").get(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_a = user === null || user === void 0 ? void 0 : user.portfolio) === null || _a === void 0 ? void 0 : _a.toString() });
        const project = yield project_model_1.default.create({});
        project.portfolio = portfolio === null || portfolio === void 0 ? void 0 : portfolio._id;
        portfolio === null || portfolio === void 0 ? void 0 : portfolio.projects.push(project._id);
        yield project.save();
        yield (portfolio === null || portfolio === void 0 ? void 0 : portfolio.save());
        res.send(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create project in user portfolio");
    }
}));
router.route("/me/project/:projectId").put(auth_middleware_1.default.verifyToken, upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const body = req.body;
        const project = yield project_model_1.default.findOne({ _id: req.params.projectId });
        if (((_b = project === null || project === void 0 ? void 0 : project.portfolio) === null || _b === void 0 ? void 0 : _b._id.toString()) != ((_c = user === null || user === void 0 ? void 0 : user.portfolio) === null || _c === void 0 ? void 0 : _c._id.toString()))
            throw new Error();
        if (project) {
            project.description = body.description;
            project.url = body.url;
            yield (project === null || project === void 0 ? void 0 : project.save());
        }
        else {
            throw new Error();
        }
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update project with id: " + req.params.projectId);
    }
}));
router.route("/me/project/:projectId").delete(auth_middleware_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const userId = res.locals.userId;
        const user = yield user_model_1.default.findOne({ _id: userId });
        const portfolio = yield portfolio_model_1.default.findOne({ _id: (_d = user === null || user === void 0 ? void 0 : user.portfolio) === null || _d === void 0 ? void 0 : _d.toString() });
        const project = yield project_model_1.default.findOne({ _id: req.params.projectId });
        if (((_e = project === null || project === void 0 ? void 0 : project.portfolio) === null || _e === void 0 ? void 0 : _e._id.toString()) != (portfolio === null || portfolio === void 0 ? void 0 : portfolio._id.toString()))
            throw new Error();
        yield project_model_1.default.deleteOne({ _id: req.params.projectId });
        if (portfolio && project) {
            portfolio.projects = portfolio === null || portfolio === void 0 ? void 0 : portfolio.projects.filter((el) => el._id.toString() != project._id.toString());
        }
        yield (portfolio === null || portfolio === void 0 ? void 0 : portfolio.save());
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete project with id: " + req.params.projectId);
    }
}));
exports.default = router;
