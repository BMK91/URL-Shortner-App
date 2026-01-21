import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import vhost from "vhost";
dotenv.config();

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://short.ly"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(vhost("short.ly", app));

app.use("/api/v1", routes);

app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  res.redirect(`/api/v1/redirect-url/${shortCode}`);
});

const startServer = async () => {
  try {
    await connectDB();
    const SERVER_PORT = process.env.SERVER_PORT || 5000;
    app.listen(SERVER_PORT, () =>
      console.log(`Server started on port ${SERVER_PORT}`),
    );
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
