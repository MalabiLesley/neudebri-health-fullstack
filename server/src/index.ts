import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appointments from "./routes/appointments";
import auth from "./routes/auth";

dotenv.config();

const app = express();

app.use(express.json());
// allow frontend origin via env, default allow all in dev
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);

// health check
app.get("/health", (_req, res) => res.send({ status: "ok" }));

app.use("/api/auth", auth);
app.use("/api/appointments", appointments);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));