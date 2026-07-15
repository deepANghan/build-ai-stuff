import express from "express";
import { chatRouter } from "./routes/ChatRoute.js";
import cors from "cors";
import { modelRouter } from "./routes/ModelRoute.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import { createCollectionIfNotExist } from "./config/Qdrant.js";
import { setUpFileUpload } from "./config/multer.js";
import { docsRouter } from "./routes/DocumentInjestRoute.js";
import { GetTestController } from "./controller/TestController.js";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/model", modelRouter);
app.use("/api/v1/docs", docsRouter);

app.get("/api/v1/test", GetTestController);

// global error handler
app.use(errorHandler);

async function main() {
    setUpFileUpload();
    await createCollectionIfNotExist();

    app.listen(PORT, () => console.log(`server started on ${PORT}`));
}

main();