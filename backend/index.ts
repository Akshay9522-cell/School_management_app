import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
// import connectDB from "./config/db";

import authRoutes from "./routes/auth";

import studentRoutes from "./routes/student.routes";
// import busRoutes from "./routes/buses";
// import inventoryRoutes from "./routes/inventory";

dotenv.config();
const app: Application = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Connect DB
 connectDB(process.env.MONGO_URI!)

// Routes
app.use('/api/auth',authRoutes)
// app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
// app.use("/api/buses", busRoutes);
// app.use("/api/inventory", inventoryRoutes);

//app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
