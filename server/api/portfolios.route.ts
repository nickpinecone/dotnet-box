import express from "express";

import Portfolio from "../models/portfolio.model";
import auth from "../middlewares/auth.middleware";
import achievements from "./achievements.route";
import multer from "multer";
import User from "../models/user.model";

import validation from "../middlewares/validate.middleware";
import { query } from "express-validator";
import { AchSorts, AchThemes, AchTypes, Achievement } from "../models/achievement.model";

const router = express.Router();
const upload = multer();

router.route("/").get(async (req, res) => {
    try {
        const portfolios = await Portfolio.find({}).sort({ createdAt: -1 })
            .populate("owner").populate({ path: "achievements" });
        res.send(portfolios);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get portfolios: " + err);
    }
});

router.route("/search").get(
    query("query").default("").escape(),
    query("limit").default("10").escape(),
    query("theme").default(AchThemes[0]).escape(),
    query("type").default(AchTypes[0]).escape(),
    query("sort").default(AchSorts[0]).escape(),
    validation.validateForm,
    async (req, res) => {
        try {
            let searchQuery = {};

            if (req.query.query) {
                const searchKey = new RegExp(`${req.query.query}`, 'i');
                searchQuery = {
                    $or: [
                        { "title": searchKey },
                        { "shortDescription": searchKey },
                        { "fullDescription": searchKey },
                    ]
                };
            }

            const limit = Number(req.query.limit as string);
            let achievements = await Achievement.find(searchQuery).limit(limit);

            if (req.query.theme != AchThemes[0]) {
                achievements = achievements.filter((ach) => ach.theme === req.query.theme);
            }

            if (req.query.type != AchTypes[0]) {
                achievements = achievements.filter((ach) => ach.type === req.query.type);
            }

            if (req.query.sort != AchSorts[0]) {
                if (req.query.sort == AchSorts[1]) {
                    achievements.sort((ach) => ach.likeAmount);
                }
            }

            res.status(200).send(achievements);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not search for achievements: " + err);
        }
    }
);

router.route("/me").get(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() })
            .populate("owner").populate({ path: "achievements" });
        if (!portfolio) throw new Error("user doesnt have portfolio");

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get user portfolio: " + err);
    }
});

router.route("/me").put(
    auth.verifyToken,
    upload.none(),
    validation.validateForm,
    async (req, res) => {
        try {
            const description = req.body.description;
            const userId = res.locals.userId;

            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() });
            if (!portfolio) throw new Error("user doesnt have portfolio");

            portfolio.description = description;
            await portfolio.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update user portfolio: " + err);
        }
    });

router.route("/:id").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id })
            .populate("owner").populate({ path: "achievements" });

        if (!portfolio) throw new Error("could not find portfolio with id: " + req.params.id);

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio: " + err);
    }
});

router.use("/", achievements);

export default router;