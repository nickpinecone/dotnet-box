import express from "express";
import path from "path";
import fs from "fs";

import Certificate from "../models/certificate.model";

const router = express.Router();

// TODO: Rewrite to just use photo names
// Get certificate photo
router.route("/certificate/:certificateId").get(async (req, res) => {
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

export default router;