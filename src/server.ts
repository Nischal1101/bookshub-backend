import express from "express";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import { PORT } from "./config";
import { connectDb } from "./lib/db";
import cors from "cors";
import job from "./lib/cron";

const app = express();

// job.start();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
connectDb()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(PORT as string | 3001, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
