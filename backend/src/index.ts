import express from "express";
import { chatRouter } from "./routes/ChatRoute.js";
import cors from "cors";
import { modelRouter } from "./routes/ModelRoute.js";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/model", modelRouter);

app.listen(PORT, () => console.log(`server started on ${PORT}`));