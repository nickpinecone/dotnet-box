import express from "express";
import multer from "multer";
import Portfolio from "../models/portfolio.model";
import { Achievement } from "../models/achievement.model";
import User from "../models/user.model";
import auth from "../middlewares/auth.middleware";
import validation from "../middlewares/validate.middleware";
import { body, query } from "express-validator";
import comments from "./comments.route";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const base = path.resolve(__dirname, "..", "public");

        if (file.fieldname == "photo") {
            cb(null, base + "/photos")
        }
        else {
            cb(null, base + "/files");
        }
    },
    filename: function (req, file, cb) {
        cb(null, (new Date()).toISOString() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

async function removeFile(name: string) {
    const photoName = path.resolve(__dirname, "..", "public/files/" + name);
    fs.unlink(photoName, (err) => { if (err) console.error(err); });
}

router.route("/achievement/:achievementId").get(async (req, res) => {
    try {
        const achievement = await Achievement.findOne({ _id: req.params.achievementId })
            .populate("members").populate({ path: "comments", populate: "author" }).populate("portfolio");
        if (!achievement) throw new Error("no achievement with id: " + req.params.achievementId);

        res.send(achievement);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find achievement: " + err);
    }
});

router.route("/me/achievement").post(
    auth.verifyToken,
    upload.fields([{ name: "photo", maxCount: 1 }, { name: "files" }]),
    body("type").default(""),
    body("theme").default(""),
    body("title").default(""),
    body("shortDescription").default(""),
    body("fullDescription").default(""),
    body("url").default(""),
    query("members").toArray().default([]),
    async (req, res) => {
        try {
            const userId = res.locals.userId;

            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() });
            if (!portfolio) throw new Error("user doesnt have portfolio");

            const type = req.body.type;
            const theme = req.body.theme;
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const fullDescription = req.body.fullDescription;
            const url = req.body.url;
            const members = req.query.members as string[];

            const achievement = await Achievement.create({ type, theme, title, shortDescription, fullDescription, url });

            for (let i = 0; i < members.length; i++) {
                const memberId = members[i];
                const member = await User.findById(memberId);
                if (!member) throw new Error("could not find member with id: " + memberId);
                achievement.members.push(member._id);
            }

            //@ts-expect-error photo is multer fields
            if (req.files.photo) {
                //@ts-expect-error photo is multer fields
                achievement.photo = req.files.photo.filename;
            }

            //@ts-expect-error who does that?
            if (req.files.files) {
                //@ts-expect-error no comments
                req.files.files.forEach((file) => {
                    achievement.files.push(file.filename);
                });
            }

            achievement.portfolio = portfolio._id;
            portfolio.achievements.push(achievement._id);

            await achievement.save();
            await portfolio.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not create achievement in user portfolio: " + err);
        }
    }
);

router.route("/me/achievement/like/:achievementId").put(
    auth.verifyToken,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const achievement = await Achievement.findOne({ _id: req.params.achievementId });
            if (!achievement) throw new Error("could not find achievement: " + req.params.achievementId);

            if (user.liked.every((post) => post._id.toString() != achievement._id.toString())) {
                if (!achievement.likeAmount) {
                    achievement.likeAmount = 0;
                }

                achievement.likeAmount += 1;
                user.liked.push(achievement._id);
            }
            else {
                if (achievement.likeAmount) {
                    achievement.likeAmount -= 1;
                }

                user.liked = user.liked.filter((post) => post._id.toString() != achievement._id.toString());
            }

            await achievement.save();
            await user.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("Could not like achievement: " + err);
        }
    }
);

router.route("/me/achievement/:achievementId").put(
    auth.verifyToken,
    upload.fields([{ name: "photo", maxCount: 1 }, { name: "files" }]),
    body("title").default(""),
    body("type").default(""),
    body("theme").default(""),
    body("shortDescription").default(""),
    body("fullDescription").default(""),
    body("url").default(""),
    query("members").toArray().default([]),
    validation.validateForm,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const achievement = await Achievement.findOne({ _id: req.params.achievementId, portfolio: user.portfolio });
            if (!achievement) throw new Error("could not find achievement: " + req.params.achievementId);

            //@ts-expect-error photo is multer fields
            if (req.files.photo) {
                //@ts-expect-error photo is multer fields
                achievement.photo = req.files.photo[0].filename;
            }

            //@ts-expect-error files is multer fields
            if (req.files.files) {
                if (achievement.files) {
                    achievement.files.forEach((file) => {
                        removeFile(file);
                    });
                }
                achievement.files = [];

                //@ts-expect-error it is an array
                req.files.files.forEach((file) => {
                    achievement.files.push(file.filename);
                });
            }

            achievement.type = req.body.type;
            achievement.title = req.body.title;
            achievement.theme = req.body.theme;
            achievement.shortDescription = req.body.shortDescription;
            achievement.fullDescription = req.body.fullDescription;
            achievement.url = req.body.url;

            const members = req.query.members as string[];
            achievement.members = [];
            for (let i = 0; i < members.length; i++) {
                const memberId = members[i];
                const member = await User.findById(memberId);
                if (!member) throw new Error("could not find member with id: " + memberId);
                achievement.members.push(member._id);
            }

            await achievement.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update achievement: " + err);
        }
    }
);

router.route("/me/achievement/:achievementId").delete(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() });
        if (!portfolio) throw new Error("user doesnt have portfolio: " + userId);

        const achievement = await Achievement.findOne({ _id: req.params.achievementId, portfolio: user.portfolio });
        if (!achievement) throw new Error("could not find achievement: " + req.params.achievementId);

        if (achievement.files) {
            achievement.files.forEach((file) => {
                removeFile(file);
            });
        }

        await Achievement.deleteOne({ _id: req.params.achievementId });

        portfolio.achievements = portfolio.achievements.filter((el) => el._id.toString() != achievement._id.toString());

        await portfolio.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete achievement: " + err);
    }
});

router.use("/", comments);

export default router;