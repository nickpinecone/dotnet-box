import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import jwt from "jsonwebtoken";
import { MailerSend, Recipient, Sender, EmailParams } from "mailersend";
import dotenv from "dotenv";
import { body } from "express-validator";

import auth from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Portfolio from "../models/portfolio.model";
import validation from "../middlewares/validate.middleware";

dotenv.config();

const router = express.Router();
const upload = multer();

const mailerSend = new MailerSend({
    apiKey: process.env.EMAIL_API as string,
});

// @ts-expect-error user is Document
function getFullName(user): string {
    return `${user.name} ${user.surname} ${user.paternalName ?? ""}`;
}

router.route("/").get(async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).send(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get users: " + err);
    }
});

router.route("/register").post(
    upload.none(),
    body("email").notEmpty().isEmail(),
    body("password").notEmpty(),
    body("username").notEmpty(),
    validation.validateForm,
    async (req, res) => {
        try {
            const username: string[] = req.body.username.split(" ");
            if (username.length < 2) {
                throw new Error("incorrect username input");
            }
            const name = username[0];
            const surname = username[1];
            let paternalName: string | null = null;
            if (username.length > 2)
                paternalName = username[2];

            const password = req.body.password;
            const email = req.body.email;

            const existUser = await User.findOne({ email });

            if (existUser) {
                throw new Error("user already exsits: " + email);
            }

            const portfolio = await Portfolio.create({});
            const user = await User.create({ name, surname, password, email });

            if (paternalName != null) {
                user.paternalName = paternalName;
            }

            portfolio.owner = user._id;
            user.portfolio = portfolio._id;

            portfolio.save();
            user.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not register user " + err);
        }
    }
);

router.route("/login").post(
    upload.none(),
    body("email").notEmpty().isEmail(),
    body("password").notEmpty(),
    validation.validateForm,
    async (req, res) => {
        try {
            const email = req.body.email;
            const password: string = req.body.password;

            const user = await User.findOne({ email });

            if (!user)
                throw new Error("could not find user with email: " + email);

            if (!bcrypt.compareSync(password, user.password as string))
                throw new Error("wrong password for user with email: " + email);

            const token = jwt.sign(
                { id: user.id },
                process.env.LOGIN_SECRET as string,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400 * 365, // 24 hours (* 365 days for testing)
                }
            );

            res.status(200).send({
                user,
                accessToken: token
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not login user" + err);
        }
    }
);

router.route("/me").get(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId }).populate({
            path: "portfolio",
            populate: {
                path: "achievements"
            }
        });

        if (!user) throw new Error("could not authenticate user with id: " + userId);

        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get user profile page: " + err)
    }
});

router.route("/byEmail").get(
    body("email").notEmpty().isEmail(),
    validation.validateForm,
    async (req, res) => {
        try {
            const email = req.body.email;

            const user = await User.findOne({ email: email });

            if (!user) throw new Error("no user with email: " + email);

            res.status(200).send(user);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not find user: " + err);
        }
    }
);

router.route("/me").put(
    auth.verifyToken,
    upload.none(),
    body("bio").default(""),
    validation.validateForm,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const bio = req.body.bio;

            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not authenticate user with id: " + userId);

            user.bio = bio;

            user.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update user profile: " + err);
        }
    }
);

router.route("/me/verify").put(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not authenticate user with id: " + userId);

        const token = jwt.sign(
            { id: user.id },
            process.env.VERIFICATION_SECRET as string,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 3600, // 1 hour
            }
        );

        // TODO Link to the frontend verify account page
        const link = `http://localhost:4000/api/users/verify/${user.id}/${token}`;

        const sender = new Sender(process.env.EMAIL_HOST as string, "Digital Portfolio");
        const recipient = [new Recipient(user.email as string, getFullName(user))];

        const emailParams = new EmailParams()
            .setFrom(sender)
            .setTo(recipient)
            .setSubject("Email verification")
            .setHtml(`<section><h1>Click link below to verify email</h1><a>${link}</a></section>`);

        await mailerSend.email.send(emailParams);

        res.send(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not initiate verification for user: " + err);
    }
});

router.route("/reset").post(
    upload.none(),
    body("email").notEmpty().isEmail(),
    validation.validateForm,
    async (req, res) => {
        try {
            const email = req.body.email;

            const user = await User.findOne({ email: email });
            if (!user) throw new Error("could not find user with email: " + email);

            const token = jwt.sign(
                { id: user?.id },
                process.env.VERIFICATION_SECRET as string,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 3600, // 1 hour
                }
            );

            // TODO Link to the frontend password reset form, link reset token
            const link = `http://localhost:4000/api/users/reset/${user.id}/${token}`;

            const sender = new Sender(process.env.EMAIL_HOST as string, "Digital Portfolio");
            const recipient = [new Recipient(user.email as string, user.name as string)];

            const emailParams = new EmailParams()
                .setFrom(sender)
                .setTo(recipient)
                .setSubject("Password reset")
                .setHtml(`<section><h1>Click link below to reset your password</h1><a>${link}</a></section>`);

            await mailerSend.email.send(emailParams);

            res.send(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not initiate password reset for user: " + err);
        }
    }
);

router.route("/verify/:id/:token").get(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) throw new Error("could not find user with id: " + req.params.id);

        jwt.verify(
            req.params.token as string,
            process.env.VERIFICATION_SECRET as string,
            (err, decoded) => {
                if (err) {
                    throw new Error("can not decode provided token: " + req.params.token);
                }
                if ((decoded as jwt.JwtPayload).id === req.params.id) {
                    user.verified = true;
                    user.save();
                }
                else {
                    throw new Error("token does not match user id");
                }
            }
        );

        res.sendStatus(200);
        // TODO redirect to frontend home page
        // res.redirect()
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not verify user: " + err);
    }
});

router.route("/reset/:id/:token").post(upload.none(),
    body("password").notEmpty(),
    validation.validateForm,
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id });
            const password = req.body.password;

            if (!user) throw new Error("could not find user with id: " + req.params.id);

            jwt.verify(
                req.params.token as string,
                process.env.VERIFICATION_SECRET as string,
                (err, decoded) => {
                    if (err) {
                        throw new Error("can not decode provided token: " + req.params.token);
                    }
                    if ((decoded as jwt.JwtPayload).id === req.params.id) {
                        user.password = password;
                        user.save();
                        res.sendStatus(200);
                        // TODO redirect to frontend home page
                        // res.redirect()
                    }
                    else {
                        throw new Error("token does not match user id");
                    }
                }
            );
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not reset password for user: " + err);
        }
    }
);

router.route("/me/subscribe").get(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId }).populate({
            path: "subscriptions",
            populate: {
                path: "portfolio", populate: { path: "achievements" },
            }
        });

        if (!user) throw new Error("could not find user: " + userId);

        res.send(user?.subscriptions);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get subscriptions for user: " + err);
    }
});

router.route("/me/subscribe/:subId").put(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        const subUser = await User.findOne({ _id: req.params.subId });

        if (!user) throw new Error("could not find user: " + userId);
        if (!subUser) throw new Error("could not find target user: " + req.params.subId);

        user.subscriptions.push(subUser._id);
        user.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not subscribe to user: " + err);
    }
});

router.route("/:id").get(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate({
            path: "portfolio",
            populate: {
                path: "achievements"
            }
        });

        if (!user) throw new Error("no user with id: " + req.params.id);

        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find user: " + err);
    }
});


export default router;