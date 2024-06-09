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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const achievement_model_1 = require("../models/achievement.model");
const router = express_1.default.Router();
router.route("/photo/:name").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photoName = path_1.default.resolve(__dirname, "..", "public/photos/" + req.params.name);
        const readStream = fs_1.default.createReadStream(photoName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get photo: " + err);
    }
}));
router.route("/file/:name").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = path_1.default.resolve(__dirname, "..", "public/files/" + req.params.name);
        const readStream = fs_1.default.createReadStream(fileName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get file: " + err);
    }
}));
router.route("/data").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send({
            themes: achievement_model_1.AchThemes,
            types: achievement_model_1.AchTypes,
            sorts: achievement_model_1.AchSorts,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get search data: " + err);
    }
}));
exports.default = router;
//# sourceMappingURL=content.route.js.map