// src/lib/socket.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

// --- Store dynamic bus locations ---
const busLocations: Record<string, { lat: number; lng: number }> = {};

// --- Function to simulate bus movement ---
export const simulateBusMovement = (busId: string) => {
  // Initialize bus location if not exists
  if (!busLocations[busId]) {
    busLocations[busId] = { lat: 28.6139, lng: 77.209 }; // starting coordinates
  }

  setInterval(() => {
    const loc = busLocations[busId];
    // small random movement
    loc.lat += (Math.random() - 0.5) * 0.001;
    loc.lng += (Math.random() - 0.5) * 0.001;

    // Emit to clients in that bus room
    if (io) {
      io.to(`bus_${busId}`).emit("busLocationUpdate", { lat: loc.lat, lng: loc.lng });
      //console.log(`Bus ${busId} location emitted:`, { lat: loc.lat, lng: loc.lng });
    }
  }, 5000);
};

// --- Initialize Socket.io ---
export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // restrict later if needed
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // --- JOIN BUS ROOM ---
    socket.on("joinBus", (busId: string) => {
      if (!busId) return;
      socket.join(`bus_${busId}`);
      console.log(`Socket ${socket.id} joined room bus_${busId}`);

      // Optionally, send current location immediately
      if (busLocations[busId]) {
        socket.emit("busLocationUpdate", busLocations[busId]);
      }
    });

    // --- LEAVE BUS ROOM ---
    socket.on("leaveBus", (busId: string) => {
      if (!busId) return;
      socket.leave(`bus_${busId}`);
      console.log(`Socket ${socket.id} left room bus_${busId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// --- Getter for io instance ---
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};
