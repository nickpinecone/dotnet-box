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
const mailersend_1 = require("mailersend");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
const config_util_1 = require("../utils/config.util");
const mailerSend = new mailersend_1.MailerSend({
    apiKey: process.env.EMAIL_API,
});
function sendVerifyEmail(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne({ _id: userId });
            if (!user)
                throw new Error("could not authenticate user with id: " + userId);
            const token = auth_middleware_1.default.generateToken(userId, process.env.VERIFICATION_SECRET, 3600);
            const link = `${config_util_1.serverUrl}/api/users/verify/${user.id}/${token}`;
            const sender = new mailersend_1.Sender(process.env.EMAIL_HOST, "Digital Portfolio");
            const recipient = [new mailersend_1.Recipient(user.email, user.name)];
            const emailParams = new mailersend_1.EmailParams()
                .setFrom(sender)
                .setTo(recipient)
                .setSubject("Email verification")
                .setHtml(`
                <section>
                    <h1>Click the link below to verify email</h1>
                    <a href="${link}">Verify Email</a>
                </section>
                `);
            yield mailerSend.email.send(emailParams);
        }
        catch (err) {
            console.error("could not send email: " + JSON.stringify(err));
        }
    });
}
function sendResetEmail(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne({ _id: userId });
            if (!user)
                throw new Error("could not authenticate user with id: " + userId);
            const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.VERIFICATION_SECRET, {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 3600, // 1 hour
            });
            const link = `${config_util_1.siteUrl}/login/restore_password/${user.id}/${token}`;
            const sender = new mailersend_1.Sender(process.env.EMAIL_HOST, "Digital Portfolio");
            const recipient = [new mailersend_1.Recipient(user.email, user.name)];
            const emailParams = new mailersend_1.EmailParams()
                .setFrom(sender)
                .setTo(recipient)
                .setSubject("Password reset")
                .setHtml(`<section><h1>Click link below to reset your password</h1><a>${link}</a></section>`);
            yield mailerSend.email.send(emailParams);
        }
        catch (err) {
            console.error("could not send email: " + JSON.stringify(err));
        }
    });
}
exports.default = { sendVerifyEmail, sendResetEmail };
//# sourceMappingURL=mailsend.middleware.js.map