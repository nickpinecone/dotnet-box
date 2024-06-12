import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import app from "./server";
import { isDevelopment, serverUrl } from "./utils/config.util";

const files = path.resolve(__dirname, 'public/files');
const photos = path.resolve(__dirname, 'public/photos');

if (!fs.existsSync(files)) {
    fs.mkdirSync(files);
}
if (!fs.existsSync(photos)) {
    fs.mkdirSync(photos);
}

dotenv.config();

mongoose.connect(process.env.DB_URI as string || "");

const port = Number(process.env.PORT) || 4000;

if (isDevelopment) {
    app.listen(port, () => {
        console.log(`server is running on port: ${port}`);
    });
}
else {
    app.listen(port, serverUrl, () => {
        console.log(`server is running on ${serverUrl} port: ${port}`);
    });
}
