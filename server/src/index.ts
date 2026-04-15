import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import queryRoutes from "./routes/query.js";
import documentRoutes from "./routes/documents.js";
import authRoutes from "./routes/auth.js";

const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL, // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
