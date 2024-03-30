import express from "express";
import multer from "multer";
import Portfolio from "../models/portfolio.model";
import path from "path";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: path.resolve(__dirname, "..", "public/certificates/") });

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
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        if (portfolio == null) throw new Error();

        res.send(portfolio);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not find portfolio with id: " + req.params.id);
    }
});

router.route("/:id/project").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

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

router.route("/:id/certificate").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const certifiace = { description: "", photo: "" };
        const count = portfolio?.certificates.push(certifiace);
        await portfolio?.save();

        res.send(portfolio?.certificates[(count as number) - 1]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create certificate in portfolio with id: " + req.params.id);
    }
});

router.route("/:id/certificate/:certificateId").put(upload.single("certificate"), async (req, res) => {
    try {
        const body = req.body;
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const certifiace = portfolio?.certificates.find((one) => one._id?.toString() == req.params.certificateId);

        if (certifiace && req.file) {
            certifiace.description = body.description;
            certifiace.photo = req.file.filename;

            await portfolio?.save();
        }
        else {
            throw new Error();
        }

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not update certifiace with id: " + req.params.certificateId);
    }
});

// Get certifiace photo
router.route("/:id/certificate/:certificateId/photo").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const certifiace = portfolio?.certificates.find((one) => one._id?.toString() == req.params.certificateId);

        if (!certifiace) throw new Error();

        const photoName = path.resolve(__dirname, "..", "public/certificates/" + certifiace?.photo);
        const readStream = fs.createReadStream(photoName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get photo for certificate with id: " + req.params.certificateId);
    }
});

router.route("/:id/certificate/:certificatedId").delete(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const certifiace = portfolio?.certificates.find((one) => one._id?.toString() == req.params.certificatedId);
        portfolio?.projects.remove(certifiace);

        await portfolio?.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete certifiace with id: " + req.params.certificatedId);
    }
});

export default router;