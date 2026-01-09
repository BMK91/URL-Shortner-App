import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();
await connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

const SERVER_PORT = process.env.SERVER_PORT || 5000;
app.listen(SERVER_PORT, () =>
  console.log(`Server started on port ${SERVER_PORT}`)
);
