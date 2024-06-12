import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./server";
import { isDevelopment, serverUrl } from "./utils/config.util";

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
