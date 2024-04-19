import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Portfolio from "../models/portfolio.model";
import Certificate from "../models/certificate.model";
import User from "../models/user.model";
import auth from "../middlewares/auth.middleware";
import validation from "../middlewares/validate.middleware";

const router = express.Router();
const upload = multer({ dest: path.resolve(__dirname, "..", "public/certificates/") });

router.route("/me/certificate").post(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() }).populate("owner projects certificates");
        if (!portfolio) throw new Error("user doesnt have portfolio");

        const certificate = await Certificate.create({});

        certificate.portfolio = portfolio._id;
        portfolio.certificates.push(certificate._id);

        await certificate.save();
        await portfolio.save();

        res.send(certificate);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not create certificate in user portfolio: " + err);
    }
});

router.route("/me/certificate/:certificateId").put(
    auth.verifyToken,
    upload.single("certificate"),
    validation.validateForm,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const certificate = await Certificate.findOne({ _id: req.params.certificateId, portfolio: user.portfolio });
            if (!certificate) throw new Error("could not find certificate: " + req.params.certificateId);

            if (!req.file) throw new Error("did not provide certificate photo");

            if (certificate.photo) {
                const photoName = path.resolve(__dirname, "..", "public/certificates/" + certificate?.photo);
                fs.unlink(photoName, (err) => { if (err) console.error(err); });
            }

            certificate.description = req.body.description;
            certificate.photo = req.file.filename;

            certificate.save();

            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update certificate: " + err);
        }
    });

router.route("/me/certificate/:certificatedId").delete(auth.verifyToken, async (req, res) => {
    try {
        const userId = res.locals.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("could not find user: " + userId);

        const portfolio = await Portfolio.findOne({ _id: user.portfolio?.toString() });
        if (!portfolio) throw new Error("user doesnt have portfolio: " + userId);

        const certificate = await Certificate.findOne({ _id: req.params.certificatedId, portfolio: user.portfolio });
        if (!certificate) throw new Error("could not find certificate: " + req.params.certificatedId);

        await Certificate.deleteOne({ _id: req.params.certificatedId });

        if (certificate.photo) {
            const photoName = path.resolve(__dirname, "..", "public/certificates/" + certificate?.photo);
            fs.unlink(photoName, (err) => { if (err) console.error(err); });
        }

        portfolio.certificates = portfolio.certificates.filter((el) => el._id.toString() != certificate._id.toString());

        await portfolio.save();

        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not delete certificate: " + err);
    }
});

export default router;