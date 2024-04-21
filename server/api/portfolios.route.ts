import express from "express";

import Portfolio from "../models/portfolio.model";
import auth from "../middlewares/auth.middleware";
import projects from "./projects.route";
import certificates from "./certificates.route";
import multer from "multer";
import User from "../models/user.model";

import validation from "../middlewares/validate.middleware";
import { query } from "express-validator";

const router = express.Router();
const upload = multer();

router.route("/").get(
    query("search").default("").escape(),
    validation.validateForm, async (req, res) => {
        try {
            const searchKey = new RegExp(`${req.query.search}`, 'i');
            const portfolios = await Portfolio.find({ "description": searchKey }).sort({ createdAt: -1 }).populate("owner projects certificates");

            res.send(portfolios);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not get portfolios: " + err);
        }
    }
);

router.route("/me").get(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() }).populate("owner projects certificates");
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

            const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() }).populate("owner projects certificates");
            if (!portfolio) throw new Error("user doesnt have portfolio");

            portfolio.description = description;
            portfolio.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update user portfolio: " + err);
        }
    });

router.route("/:id").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id }).populate("owner projects certificates");

        if (!portfolio) throw new Error("could not find portfolio with id: " + req.params.id);

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio: " + err);
    }
});

router.use("/", projects);
router.use("/", certificates);

export default router;