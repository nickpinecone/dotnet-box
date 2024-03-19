const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/test", (req, res) => {
    res.send("test ok");
});

app.listen(4000);