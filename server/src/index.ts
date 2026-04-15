import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import queryRoutes from "./routes/query.js";
import documentRoutes from "./routes/documents.js";
import authRoutes from "./routes/auth.js";

const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json());

connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/documents", documentRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
// import dotenv from "dotenv";
// dotenv.config();
// import { connectDB } from "./config/db.js";
// import queryRoutes from "./routes/query.js";
// connectDB();

// import express from "express";

// const app = express();
// app.use("/api/query", queryRoutes); // app crashed afetr adding this 
// app.get("/", (req, res) => {
//   res.send("OK");
// });

// app.listen(5001, () => {
//   console.log("Server running on port 5001");
// });
