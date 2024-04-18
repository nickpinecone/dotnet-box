import express from "express";
import Portfolio from "../models/portfolio.model";
import Project from "../models/project.model";
import multer from "multer";
import auth from "../middlewares/auth.middleware";
import User from "../models/user.model";

const router = express.Router();
const upload = multer();

router.route("/me/project").post(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        const portfolio = await Portfolio.findOne({ _id: user?.portfolio?.toString() });
        const project = await Project.create({});

        project.portfolio = portfolio?._id;
        portfolio?.projects.push(project._id);

        await project.save();
        await portfolio?.save();

        res.send(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create project in user portfolio");
    }
});

router.route("/me/project/:projectId").put(auth.verifyToken, upload.none(), async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });

        const body = req.body;
        const project = await Project.findOne({ _id: req.params.projectId });

        if (project?.portfolio?._id.toString() != user?.portfolio?._id.toString())
            throw new Error();

        if (project) {
            project.description = body.description;
            project.url = body.url;

            await project?.save();
        }
        else {
            throw new Error();
        }

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update project with id: " + req.params.projectId);
    }
});

router.route("/me/project/:projectId").delete(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });

        const portfolio = await Portfolio.findOne({ _id: user?.portfolio?.toString() });
        const project = await Project.findOne({ _id: req.params.projectId });

        if (project?.portfolio?._id.toString() != portfolio?._id.toString())
            throw new Error();

        await Project.deleteOne({ _id: req.params.projectId });

        if (portfolio && project) {
            portfolio.projects = portfolio?.projects.filter((el) => el._id.toString() != project._id.toString());
        }

        await portfolio?.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete project with id: " + req.params.projectId);
    }
});

export default router;