"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AchSorts = exports.AchThemes = exports.AchTypes = exports.Achievement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const promises_1 = __importDefault(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const AchTypes = ["все", "проект", "сертификат"];
exports.AchTypes = AchTypes;
const AchThemes = ["все", "спорт", "наука"];
exports.AchThemes = AchThemes;
const AchSorts = ["дата", "лайки"];
exports.AchSorts = AchSorts;
const AchievementSchema = new mongoose_1.Schema({
    type: String,
    theme: String,
    title: String,
    shortDescription: String,
    fullDescription: String,
    url: String,
    _oldPhoto: String,
    photo: {
        type: String,
        set: function (value) {
            //@ts-expect-error defined on schema
            this._oldPhoto = this.photo;
            return value;
        }
    },
    files: [String],
    likeAmount: {
        type: Number,
        default: 0,
    },
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "user"
        }],
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    portfolio: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "portfolio"
    },
    comments: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "comment"
        }],
});
AchievementSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error somehow mongoose formats the date number
        this.updatedAt = Date.now();
        if (this.photo && this.isModified("photo") && this._oldPhoto) {
            const photoName = path_1.default.resolve(__dirname, "..", "public/photos/" + this._oldPhoto);
            try {
                yield promises_1.default.unlink(photoName);
            }
            catch (err) {
                console.error(err);
            }
        }
        if (this.type &&
            this.isModified("type") &&
            !AchTypes.includes(this.type))
            return next(new Error("wrong achievement type"));
        if (this.theme &&
            this.isModified("theme") &&
            !AchThemes.includes(this.theme))
            return next(new Error("wrong theme"));
        return next();
    });
});
AchievementSchema.pre("deleteOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = this.getQuery()["_id"];
        const achievement = yield Achievement.findOne({ _id: id });
        if (achievement == null)
            return next(new Error("no achievement with id : " + id));
        if (achievement.photo) {
            const photoName = path_1.default.resolve(__dirname, "..", "public/photos/" + achievement.photo);
            try {
                yield promises_1.default.unlink(photoName);
            }
            catch (err) {
                console.error(err);
            }
        }
        return next();
    });
});
const Achievement = mongoose_1.default.model("achievement", AchievementSchema);
exports.Achievement = Achievement;
//# sourceMappingURL=achievement.model.js.map