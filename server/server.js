import express from "express";
import cors from "cors";

import portfolios from "./api/portfolios.route.js";

const app = express();

app.set('views', './views')
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());

app.use("/api/portfolios", portfolios)

app.use("*", (req, res) => {
    res.status(404).json({ error: "page not found" });
});

export default app;