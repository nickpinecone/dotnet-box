import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Portfolio from "../models/portfolio.model";
import Certificate from "../models/certificate.model";
import User from "../models/user.model";
import auth from "../middlewares/auth.middleware";

const router = express.Router();
const upload = multer({ dest: path.resolve(__dirname, "..", "public/certificates/") });

router.route("/me/certificate").get(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        const portfolio = await Portfolio.findOne({ _id: user?.portfolio?.toString() });
        const certificate = await Certificate.create({});

        certificate.portfolio = portfolio?._id;
        portfolio?.certificates.push(certificate._id);

        await certificate.save();
        await portfolio?.save();

        res.send(certificate);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create certificate in user portfolio");
    }
});

router.route("/me/certificate/:certificateId").put(auth.verifyToken, upload.single("certificate"), async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });

        const body = req.body;
        const certificate = await Certificate.findOne({ _id: req.params.certificateId });

        if (certificate?.portfolio?._id.toString() != user?.portfolio?._id.toString())
            throw new Error();

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
        res.status(500).send("could not update certificate with id: " + req.params.certificateId);
    }
});

router.route("/me/certificate/:certificatedId").delete(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });

        const portfolio = await Portfolio.findOne({ _id: user?.portfolio?.toString() });
        const certificate = await Certificate.findOne({ _id: req.params.certificatedId });

        if (certificate?.portfolio?._id.toString() != portfolio?._id.toString())
            throw new Error();

        await Certificate.deleteOne({ _id: req.params.certificatedId });

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
        res.status(500).send("could not delete certificate with id: " + req.params.certificatedId);
    }
});

export default router;