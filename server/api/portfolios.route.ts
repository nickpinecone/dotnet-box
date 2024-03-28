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

        if (portfolio == null)
            throw new Error();

        res.send(portfolio);
    }
    catch
    {
        res.statusMessage = "could not find portfolio with id: " + req.params.id;
        res.sendStatus(500);
    }
});

router.route("/:id").patch(upload.single("certificate"), async (req, res) => {
    // add project and certifiace to portfolio
    const body = req.body;
    console.log(body);
    console.log(req.file);

    res.sendStatus(200);
});

export default router;