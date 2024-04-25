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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AchievementTypes = ["project", "certificate"];
const AchievementSchema = new mongoose_1.Schema({
    type: String,
    title: String,
    photo: String,
    shortDescription: String,
    fullDescription: String,
    url: String,
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "user"
        }],
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    portfolio: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "portfolio"
    },
});
AchievementSchema.pre("save", function (next) {
    // @ts-expect-error somehow mongoose formats the date number
    this.updatedAt = Date.now();
    if (this.type &&
        this.isModified("type") &&
        !AchievementTypes.includes(this.type))
        return next(new Error("wrong achievement type"));
    return next();
});
const Achievement = mongoose_1.default.model("achievement", AchievementSchema);
exports.default = Achievement;
