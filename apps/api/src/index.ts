import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/health", healthRouter);

app.listen(port, () => {
  console.log(`nightwire-api listening on :${port}`);
});
