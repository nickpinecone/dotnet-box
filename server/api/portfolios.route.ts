import express from "express";
import multer from "multer";
import Portfolio from "../models/portfolio.model";
import path from "path";

const router = express.Router();

const upload = multer({ dest: path.resolve(__dirname, "..", "public/certificates/") });

router.route("/").get(async (req, res) => {
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 });

    res.send(portfolios);
});

router.route("/:id").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        if (portfolio == null) throw new Error();

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio with id: " + req.params.id);
    }
});

router.route("/:id/project").post(upload.none(), async (req, res) => {
    try {
        const body = req.body;
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const project = { description: body.description, url: body.url };
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

router.route("/:id/project/:projectId").delete(async (req, res) => {
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


// TODO do same with certifiaces

// router.route("/:id/project/:projectId").patch(async (req, res) => {
//     const portfolio = await Portfolio.findOne({ _id: req.params.id });
//     const project = portfolio?.projects.find((one) => one._id == req.params.projectId);
// });

// router.route("/:id/certificate").patch(upload.single("certificate"), async (req, res) => {
//     try {
//         if (!req.file) throw new Error("did not recieve photo");

//         const body = req.body;
//         const portfolio = await Portfolio.findOne({ _id: req.params.id });

//         const certifiace = { description: body.description, photo: req.file.filename };
//         portfolio?.certificates.push(certifiace);
//         portfolio?.save();

//         res.sendStatus(200);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send("couldnt update portfolio with id: " + req.params.id);
//     }
// });

export default router;