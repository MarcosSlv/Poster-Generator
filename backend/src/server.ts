import "dotenv/config";
import { app } from "./app";
import { startPdfCleanup } from "./utils/cleanupPdfs";

const PORT = process.env.PORT || 3333;

startPdfCleanup();

app.listen(PORT, () => {
  console.log(`Back-end is running on ${PORT}`);
});
