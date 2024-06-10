"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.DB_URI || "");
const port = Number(process.env.PORT) || 4000;
const url = process.env.SERVER_URL;
if (url != "") {
    server_1.default.listen(port, url, () => {
        console.log(`server is running on ${url} port: ${port}`);
    });
}
else {
    server_1.default.listen(port, () => {
        console.log(`server is running on port: ${port}`);
    });
}
//# sourceMappingURL=index.js.map