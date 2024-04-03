import express from "express";
import Portfolio from "../models/portfolio.model";
import Project from "../models/project.model";
import multer from "multer";

const router = express.Router({ mergeParams: true });
const upload = multer();

router.route("/:id/project").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });
        const project = await Project.create({});

        project.portfolio = portfolio?._id;
        portfolio?.projects.push(project._id);

        await project.save();
        await portfolio?.save();

        res.send(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create project in portfolio with id: " + req.params.id);
    }
});

router.route("/:id/project/:projectId").put(upload.none(), async (req, res) => {
    try {
        const body = req.body;
        const project = await Project.findOne({ _id: req.params.projectId });

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

router.route("/:id/project/:projectId").delete(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });
        const project = await Project.findOneAndDelete({ _id: req.params.projectId });

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