import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import jwt from "jsonwebtoken";

import auth from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Portfolio from "../models/portfolio.model";

const router = express.Router();
const upload = multer();

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
            process.env.SECRET as string,
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
    // @ts-expect-error userId is inserted in auth middleware
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }).populate("portfolio");

    if (!user) throw new Error("could not authenticate user with id: " + userId);

    res.status(200).send(user);
});

router.route("/:id").get(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate("portfolio");

        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find user with id: " + req.params.id);
    }
});

export default router;