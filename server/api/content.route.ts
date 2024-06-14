import express from "express";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { AchTypes, AchThemes, AchSorts, Categories } from "../models/achievement.model";

const router = express.Router();

router.route("/photo/:name").get(async (req, res) => {
    try {
        const photoName = path.resolve(__dirname, "..", "public/photos/" + req.params.name);

        if (!fs.existsSync(photoName)) {
            throw new Error("no photo with name: " + req.params.name);
        }

        const readStream = fs.createReadStream(photoName);

        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get photo: " + err);
    }
});

router.route("/file/:name").get(async (req, res) => {
    try {
        const fileName = path.resolve(__dirname, "..", "public/files/" + req.params.name);

        if (!fs.existsSync(fileName)) {
            throw new Error("no photo with name: " + req.params.name);
        }

        const readStream = fs.createReadStream(fileName);

        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get file: " + err);
    }
});

router.route("/type/:name").get(async (req, res) => {
    try {
        const fileName = path.resolve(__dirname, "..", "public/files/" + req.params.name);

        if (!fs.existsSync(fileName)) {
            throw new Error("no photo with name: " + req.params.name);
        }

        let type = mime.lookup(req.params.name);
        if (type === false) {
            type = "unknown/unknown";
        }

        res.status(200).send(type);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get type of file: " + err);
    }
});

router.route("/data").get(async (req, res) => {
    try {
        res.status(200).send({
            themes: AchThemes,
            types: AchTypes,
            sorts: AchSorts,
            categories: Categories,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get search data: " + err)
    }
});

export default router;