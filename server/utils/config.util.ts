import dotenv from "dotenv";

dotenv.config();

export const isDevelopment = process.env.MODE === "dev";

export const siteUrl = isDevelopment ? "localhost:3000" : "https://threedotsellipsis.github.io/digital-portfolio/";
export const serverUrl = isDevelopment ? "localhost:4000" : "185.211.170.35";
