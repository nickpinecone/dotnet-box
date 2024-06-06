import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.route("photo/:name").get(async (req, res) => {
    try {
        const photoName = path.resolve(__dirname, "..", "public/photos/" + req.params.name);
        const readStream = fs.createReadStream(photoName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get photo with name: " + req.params.name);
    }
});

router.route("file/:name").get(async (req, res) => {
    try {
        const fileName = path.resolve(__dirname, "..", "public/files/" + req.params.name);
        const readStream = fs.createReadStream(fileName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get file with name: " + req.params.name);
    }
});

export default router;