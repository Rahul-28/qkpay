import { PORT } from "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import appRouter from "./routes/app.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// handles errors
app.use(errorMiddleware);

app.use("/api/v1", appRouter);

app.listen(PORT, async () => {
  console.log(`your server is running at http://localhost:${PORT}`);
  await connectToDatabase();
});
