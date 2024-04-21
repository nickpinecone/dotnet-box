import express from "express";

import Portfolio from "../models/portfolio.model";
import auth from "../middlewares/auth.middleware";
import projects from "./projects.route";
import certificates from "./certificates.route";
import multer from "multer";
import User from "../models/user.model";

import validation from "../middlewares/validate.middleware";
import { query } from "express-validator";
import Project from "../models/project.model";
import Certificate from "../models/certificate.model";

const router = express.Router();
const upload = multer();

router.route("/").get(
    query("search").optional().escape(),
    validation.validateForm, async (req, res) => {
        try {
            if (req.query.search) {
                const searchList = [];

                const searchKey = new RegExp(`${req.query.search}`, 'i');
                const searchSettings = { "description": searchKey };

                const portfolios = await Portfolio.find(searchSettings).sort({ createdAt: -1 }).populate("owner projects certificates");
                for (let i = 0; i < portfolios.length; i++) {
                    const portfolio = portfolios[i];
                    searchList.push(portfolio);
                }

                const projects = await Project.find(searchSettings).sort({ createdAt: -1 });
                for (let i = 0; i < projects.length; i++) {
                    const project = projects[i];
                    const portfolio = await Portfolio.findById(project.portfolio).populate("owner projects certificates");
                    if (portfolio && searchList.every((item) => item._id.toString() !== portfolio._id.toString()))
                        searchList.push(portfolio);
                }

                const certificates = await Certificate.find(searchSettings).sort({ createdAt: -1 });
                for (let i = 0; i < certificates.length; i++) {
                    const certificate = certificates[i];
                    const portfolio = await Portfolio.findById(certificate.portfolio).populate("owner projects certificates");
                    if (portfolio && searchList.every((item) => item._id.toString() !== portfolio._id.toString()))
                        searchList.push(portfolio);
                }

                res.send([...searchList]);
            }
            else {
                const portfolios = await Portfolio.find({}).sort({ createdAt: -1 }).populate("owner projects certificates");
                res.send(portfolios);
            }
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