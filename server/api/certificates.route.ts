import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Portfolio from "../models/portfolio.model";
import Certificate from "../models/certificate.model";

const router = express.Router({ mergeParams: true });
const upload = multer({ dest: path.resolve(__dirname, "..", "public/certificates/") });

router.route("/:id/certificate").get(async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        const certificate = await Certificate.create({});
        portfolio?.certificates.push(certificate._id);
        await portfolio?.save();

        res.send(certificate);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create certificate in portfolio with id: " + req.params.id);
    }
});

router.route("/:id/certificate/:certificateId").put(upload.single("certificate"), async (req, res) => {
    try {
        const body = req.body;
        const certificate = await Certificate.findOne({ _id: req.params.certificateId });

        if (certificate && req.file) {
            if (certificate.photo) {
                const photoName = path.resolve(__dirname, "..", "public/certificates/" + certificate?.photo);
                fs.unlink(photoName, (err) => { if (err) console.error(err); });
            }

            certificate.description = body.description;
            certificate.photo = req.file.filename;

            certificate.save();
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
        const certificate = await Certificate.findOne({ _id: req.params.certificateId });

        if (!certificate) throw new Error();

        const photoName = path.resolve(__dirname, "..", "public/certificates/" + certificate?.photo);
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
        const certificate = await Certificate.findOneAndDelete({ _id: req.params.certificatedId });

        if (certificate?.photo) {
            const photoName = path.resolve(__dirname, "..", "public/certificates/" + certificate?.photo);
            fs.unlink(photoName, (err) => { if (err) console.error(err); });
        }

        if (portfolio && certificate) {
            portfolio.certificates = portfolio?.certificates.filter((el) => el._id.toString() != certificate._id.toString());
        }

        await portfolio?.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete certifiace with id: " + req.params.certificatedId);
    }
});

export default router;