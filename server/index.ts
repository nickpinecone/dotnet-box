import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./server";

dotenv.config();

mongoose.connect(process.env.DB_URI as string || "");
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("server is running on port: " + port);
});
