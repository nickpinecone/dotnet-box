import express from "express";
import cors from "cors";

import portfolios from "./api/portfolios.route";
import users from "./api/users.route";
import content from "./api/content.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/portfolios", portfolios);
app.use("/api/users", users);
app.use("/api/content", content);

app.use("*", (req, res) => {
    res.status(404).json({ error: "page not found" });
});

export default app;