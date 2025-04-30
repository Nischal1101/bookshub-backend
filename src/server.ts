import express from "express";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import { PORT } from "./config";
import { connectDb } from "./lib/db";
import cors from "cors";
import job from "./lib/cron";

const app = express();

job.start();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.get("/", (req, res) => {
  res.json({ message: "Server is up and running" });
});
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
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
