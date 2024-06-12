import { MailerSend, Recipient, Sender, EmailParams } from "mailersend";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import auth from "./auth.middleware";
import { serverUrl, siteUrl } from "../utils/config.util";

const mailerSend = new MailerSend({
    apiKey: process.env.EMAIL_API as string,
});

async function sendVerifyEmail(userId: string) {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not authenticate user with id: " + userId);

        const token = auth.generateToken(userId, process.env.VERIFICATION_SECRET as string, 3600);

        const link = `${serverUrl}/api/users/verify/${user.id}/${token}`;

        const sender = new Sender(process.env.EMAIL_HOST as string, "Digital Portfolio");
        const recipient = [new Recipient(user.email as string, user.name as string)];

        const emailParams = new EmailParams()
            .setFrom(sender)
            .setTo(recipient)
            .setSubject("Email verification")
            .setHtml(
                `
                <section>
                    <h1>Click the link below to verify email</h1>
                    <a href="${link}">Verify Email</a>
                </section>
                `
            );

        await mailerSend.email.send(emailParams);
    }
    catch (err) {
        console.error("could not send email: " + JSON.stringify(err));
    }
}

async function sendResetEmail(userId: string) {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not authenticate user with id: " + userId);

        const token = jwt.sign(
            { id: userId },
            process.env.VERIFICATION_SECRET as string,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 3600, // 1 hour
            }
        );

        const link = `${siteUrl}/login/restore_password/${user.id}/${token}`;

        const sender = new Sender(process.env.EMAIL_HOST as string, "Digital Portfolio");
        const recipient = [new Recipient(user.email as string, user.name as string)];

        const emailParams = new EmailParams()
            .setFrom(sender)
            .setTo(recipient)
            .setSubject("Password reset")
            .setHtml(`<section><h1>Click link below to reset your password</h1><a>${link}</a></section>`);

        await mailerSend.email.send(emailParams);
    }
    catch (err) {
        console.error("could not send email: " + JSON.stringify(err));
    }
}

export default { sendVerifyEmail, sendResetEmail };