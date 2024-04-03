import express from "express";

import Portfolio from "../models/portfolio.model";
import projects from "./projects.route";
import certificates from "./certificates.route";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.route("/").get(async (req, res) => {
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 });

    res.send(portfolios);
});

router.route("/").post(async (req, res) => {
    await Portfolio.create({});
    res.sendStatus(200);
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

router.route("/:id").put(upload.none(), async (req, res) => {
    try {
        const description = req.body.description;
        const portfolio = await Portfolio.findOne({ _id: req.params.id }).populate("owner");

        if (portfolio == null) throw new Error();

        portfolio.description = description;
        portfolio.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update portfolio with id: " + req.params.id);
    }
});

router.use("/", projects);
router.use("/", certificates);

export default router;