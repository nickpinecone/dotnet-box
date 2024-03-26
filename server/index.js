import mongodb from "mongodb";
import dotenv from "dotenv";

import app from "./server.js";

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(process.env.DB_URI);
    const port = process.env.PORT || 4000;

    try {
        await client.connect();

        app.listen(port, () => {
            console.log("server is running on port: " + port);
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main().catch(console.error);
