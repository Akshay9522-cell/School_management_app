import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
// import connectDB from "./config/db";

import authRoutes from "./routes/auth";
import feeTypeRoutes from "./routes/feeTypeRoute";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from './routes/teacherRoutes'
import classRoutes from './routes/classRoutes'
import attaendance from './routes/attandanceQr.routes'
import feeStructureRoutes from './routes/feeStructureRoute'
import feeGenerationRoutes from "./routes/feeGenerationRoutes";
import feePaymentRoutes from "./routes/feePaymentRoutes";
import feesService from './routes/feesRoutes'
import inventory  from './routes/inventory.routes'

import classRoomRoutes from './routes/classroom.routes'
import qrRoutes from "./routes/qr.routes";
// import busRoutes from "./routes/buses";
// import inventoryRoutes from "./routes/inventory";

dotenv.config();
const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",   // your React app
    credentials: true,                 // allow cookies
   
  })
);
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Connect DB
 connectDB(process.env.MONGO_URI!)

// Routes
app.use('/api/auth',authRoutes)

// app.get('/api/attendance/test',(req,res)=>{
//   res.json({  ok:true})
// })
// app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/teachers',teacherRoutes)
app.use('/api/classes',classRoutes)
app.use('/api/attendance',attaendance)

app.use("/api/fee-types", feeTypeRoutes);
app.use("/api/fee-structure", feeStructureRoutes);
app.use("/api/fees", feeGenerationRoutes);
app.use("/api/fees", feePaymentRoutes);
app.use("/api/feesservice", feesService);
app.use("/api/inventory",inventory)
app.use('/api/classroom/',classRoomRoutes)
app.use("/api/qr", qrRoutes);

// app.use("/api/buses", busRoutes);
// app.use("/api/inventory", inventoryRoutes);

//app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
