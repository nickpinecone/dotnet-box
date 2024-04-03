import express from "express";

import Portfolio from "../models/portfolio.model";
import auth from "../middlewares/auth.middleware";
import projects from "./projects.route";
import certificates from "./certificates.route";
import multer from "multer";
import User from "../models/user.model";

const router = express.Router();
const upload = multer();

router.route("/").get(async (req, res) => {
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 }).populate("owner projects certificates");

    res.send(portfolios);
});

router.route("/me").get(auth.verifyToken, async (req, res) => {
    try {
        // @ts-expect-error userId is inserted in auth middleware
        const userId = req.userId;

        const user = await User.findOne({ _id: userId });
        const portfolio = await Portfolio.findOne({ _id: user?.portfolio?.toString() }).populate("owner projects certificates");

        if (portfolio == null) throw new Error();

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get user portfolio");
    }
});

router.route("/me").put(auth.verifyToken, upload.none(), async (req, res) => {
    try {
        const description = req.body.description;
        // @ts-expect-error userId is inserted in auth middleware
        const userId = req.userId;

        const user = await User.findOne({ _id: userId });
        const portfolio = await Portfolio.findOne({ _id: user?.portfolio?.toString() });

        if (portfolio == null) throw new Error();

        portfolio.description = description;
        portfolio.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update user portfolio");
    }
});

router.route("/:id").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id }).populate("owner projects certificates");

        if (portfolio == null) throw new Error();

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio with id: " + req.params.id);
    }
});

router.use("/", projects);
router.use("/", certificates);

export default router;