import express from "express";
import dotenv from "dotenv";
import { db } from "./db/connection";
import cors from "cors";
import jobroutes from "./apis/api.job";
import errorMiddleware from "./utils/errorHandle";
dotenv.config();
db();
const app = express();
const PORT = process.env.APP_PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/api/job", jobroutes);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
