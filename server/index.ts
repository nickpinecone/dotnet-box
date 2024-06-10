import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./server";

dotenv.config();

mongoose.connect(process.env.DB_URI as string || "");

const port: number = Number(process.env.PORT) || 4000;
const url = process.env.SERVER_URL as string;

if (url != "") {
    app.listen(port, url, () => {
        console.log(`server is running on ${url} port: ${port}`);
    });
}
else {
    app.listen(port, () => {
        console.log(`server is running on port: ${port}`);
    });
}
