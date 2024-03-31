import express from "express";
import Portfolio from "../models/portfolio.model";
import multer from "multer";

const router = express.Router({ mergeParams: true });
const upload = multer();

router.route("/:id/project").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });
        console.log(req.params.id);

        const project = { description: "", url: "" };
        const count = portfolio?.projects.push(project);
        await portfolio?.save();

        res.send(portfolio?.projects[(count as number) - 1]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create project in portfolio with id: " + req.params.id);
    }
});

router.route("/:id/project/:projectId").put(upload.none(), async (req, res) => {
    try {
        const body = req.body;
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const project = portfolio?.projects.find((one) => one._id?.toString() == req.params.projectId);

        if (project) {
            project.description = body.description;
            project.url = body.url;

            await portfolio?.save();
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

router.route("/:id/proejct/:projectId").delete(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const project = portfolio?.projects.find((one) => one._id?.toString() == req.params.projectId);
        portfolio?.projects.remove(project);

        await portfolio?.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete project with id: " + req.params.projectId);
    }
});

export default router;