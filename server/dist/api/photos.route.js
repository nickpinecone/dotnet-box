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
const certificate_model_1 = __importDefault(require("../models/certificate.model"));
const router = express_1.default.Router();
// Get certificate photo
router.route("/certificate/:certificateId").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield certificate_model_1.default.findOne({ _id: req.params.certificateId });
        if (!certificate)
            throw new Error();
        const photoName = path_1.default.resolve(__dirname, "..", "public/certificates/" + (certificate === null || certificate === void 0 ? void 0 : certificate.photo));
        const readStream = fs_1.default.createReadStream(photoName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get photo for certificate with id: " + req.params.certificateId);
    }
}));
exports.default = router;
