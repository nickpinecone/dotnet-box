import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import jwt from "jsonwebtoken";
import { MailerSend, Recipient, Sender, EmailParams } from "mailersend";
import dotenv from "dotenv";

import auth from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Portfolio from "../models/portfolio.model";

dotenv.config();

const router = express.Router();
const upload = multer();

const mailerSend = new MailerSend({
    apiKey: process.env.EMAIL_API as string,
});

router.route("/").get(async (req, res) => {
    const users = await User.find({});

    res.status(200).send(users);
});

router.route("/register").post(upload.none(), async (req, res) => {
    try {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 10);
        const email = req.body.email;

        const existUser = await User.findOne({
            $or: [
                { email },
                { username },
            ]
        });
        if (existUser) {
            throw new Error("user already exsits: " + username);
        }

        const portfolio = await Portfolio.create({});
        const user = await User.create({ username, password, email });

        portfolio.owner = user._id;
        user.portfolio = portfolio._id;

        portfolio.save();
        user.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not register user");
    }
});

router.route("/login").post(upload.none(), async (req, res) => {
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
                expiresIn: 86400, // 24 hours
            }
        );

        res.status(200).send({
            user,
            accessToken: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not login user");
    }
});

router.route("/me").get(auth.verifyToken, async (req, res) => {
    const userId = res.locals.userId;

    const user = await User.findOne({ _id: userId }).populate({
        path: "portfolio",
        populate: {
            path: "projects certificates"
        }
    });
    user?.portfolio

    if (!user) throw new Error("could not authenticate user with id: " + userId);

    res.status(200).send(user);
});

router.route("/me/verify").put(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });

        const token = jwt.sign(
            { id: user?.id },
            process.env.VERIFICATION_SECRET as string,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 3600, // 1 hour
            }
        );

        if (user) {
            const link = `http://localhost:4000/api/users/verify/${user.id}/${token}`;

            const sender = new Sender(process.env.EMAIL_HOST as string, "Digital Portfolio");
            const recipient = [new Recipient(user.email as string, user.username as string)];

            const emailParams = new EmailParams()
                .setFrom(sender)
                .setTo(recipient)
                .setSubject("Email verification")
                .setHtml(`<section><h1>Click link below to verify email</h1><a>${link}</a></section>`);

            await mailerSend.email.send(emailParams);
        }


        res.send(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not initiate verification for user");
    }
});

router.route("/verify/:id/:token").get(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            throw new Error();
        }

        jwt.verify(
            req.params.token as string,
            process.env.VERIFICATION_SECRET as string,
            (err, decoded) => {
                if (err) {
                    throw new Error("can not verify user with id: " + req.params.id);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not verify user with id: " + req.params.id);
    }
});

router.route("/me/subscribe").get(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId }).populate({
            path: "subscriptions",
            populate: {
                path: "portfolio", populate: { path: "projects certificates" },
            }
        });

        res.send(user?.subscriptions);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get subscriptions for user");
    }
});

router.route("/me/subscribe/:subId").put(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        const subUser = await User.findOne({ _id: req.params.subId });

        if (subUser) {
            user?.subscriptions.push(subUser._id);
            user?.save();
        }
        else
            throw new Error();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not subscribe to user with id: " + req.params.subId);
    }
});

router.route("/:id").get(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate({
            path: "portfolio",
            populate: {
                path: "projects certificates"
            }
        });

        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find user with id: " + req.params.id);
    }
});

export default router;