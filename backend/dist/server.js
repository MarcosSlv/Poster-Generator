"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const cleanupPdfs_1 = require("./utils/cleanupPdfs");
const PORT = process.env.PORT || 3333;
(0, cleanupPdfs_1.startPdfCleanup)();
app_1.app.listen(PORT, () => {
    console.log(`Back-end is running on ${PORT}`);
});
