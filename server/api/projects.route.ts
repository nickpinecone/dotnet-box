import express from "express";
import Portfolio from "../models/portfolio.model";
import Project from "../models/project.model";
import multer from "multer";
import auth from "../middlewares/auth.middleware";
import User from "../models/user.model";
import validation from "../middlewares/validate.middleware";

const router = express.Router();
const upload = multer();

router.route("/me/project").post(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() }).populate("owner projects certificates");
        if (!portfolio) throw new Error("user doesnt have portfolio");

        const project = await Project.create({});

        project.portfolio = portfolio._id;
        portfolio.projects.push(project._id);

        await project.save();
        await portfolio.save();

        res.send(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create project in user portfolio: " + err);
    }
});

router.route("/me/project/:projectId").put(
    auth.verifyToken,
    upload.none(),
    validation.validateForm,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const project = await Project.findOne({ _id: req.params.projectId, portfolio: user.portfolio });
            if (!project) throw new Error("could not find project: " + req.params.projectId);

            project.description = req.body.description;
            project.url = req.body.url;

            await project.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update project: " + err);
        }
    });

router.route("/me/project/:projectId").delete(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() });
        if (!portfolio) throw new Error("user doesnt have portfolio: " + userId);

        const project = await Project.findOne({ _id: req.params.projectId, portfolio: user.portfolio });
        if (!project) throw new Error("could not find project: " + req.params.projectId);

        await Project.deleteOne({ _id: req.params.projectId });

        portfolio.projects = portfolio.projects.filter((el) => el._id.toString() != project._id.toString());

        await portfolio.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete project: " + err);
    }
});

export default router;