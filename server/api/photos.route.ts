import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Separate name with backslashes
// Certificates are in certificates/
// Projects are in projects/
router.route("/:name").get(async (req, res) => {
    try {
        const photoName = path.resolve(__dirname, "..", "public/" + req.params.name);
        const readStream = fs.createReadStream(photoName);
        res.status(200);
        readStream.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("could not get photo with name: " + req.params.name);
    }
});

export default router;