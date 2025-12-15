import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { initSocket, simulateBusMovement } from "./lib/socket";
// import connectDB from "./config/db";
dotenv.config();
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
// import inventory  from './routes/inventory.routes'
import busRoutes from './routes/Bus/bus.routes'
import routeRoutes from './routes/Bus/route.routes'
import stopRoutes from './routes/Bus/stop.routes'
import classRoomRoutes from './routes/classroom.routes'
import qrRoutes from "./routes/qr.routes";
import studentDailyattendance from './routes/studentAttendance.routes'
import Bus from "./models/Bus/Bus";
import parentRoute from './routes/parentRoutes'
import inventory from "./routes/Inventory/inventory.routes";
import reportRoutes from "./routes/reportcard/reportRoutes";
import homeworkRoute from "./routes/HomeWork/homeWorkRoutes"
import testRoutes from "./routes/reportcard/testRoutes"


// import busRoutes from "./routes/buses";
// import inventoryRoutes from "./routes/inventory";


const app: Application = express();

// CORS FIX (permanent)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://your-production-domain.com", // add production domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // for Postman, mobile apps

      // allow any localhost port automatically
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("🚫 CORS blocked: " + origin));
    },
    credentials: true,
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
app.use("/api/attendance",studentDailyattendance)
app.use('/api/buses',busRoutes)
app.use('/api/route',routeRoutes)
app.use('/api/stop',stopRoutes)
app.use('/api/parent',parentRoute)
app.use('/api/inventory',inventory)
app.use("/api/reports", reportRoutes);
app.use("/api/homework", homeworkRoute);
app.use("/api/daily-Report  ",testRoutes)

// app.use("/api/buses", busRoutes);
// app.use("/api/inventory", inventoryRoutes);

const Server = http.createServer(app);
initSocket(Server);  // <-- This is the ONLY socket init

 const startBusSimulations = async () => {
  const buses = await Bus.find(); // fetch all buses from DB

  buses.forEach(bus => {
    simulateBusMovement((bus._id as any).toString());
    console.log("Simulating bus:", (bus._id as any).toString());
  });
};

startBusSimulations();
Server.listen(4000, () => {
  console.log("🚀 Server running on port 4000");
});

//app.get("/api/health", (_, res) => res.json({ status: "ok" }));

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
