// src/lib/socket.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // you can restrict this later
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // --- JOIN BUS ROOM ---
    socket.on("joinBus", (busId: string) => {
      if (!busId) return;
      socket.join(`bus_${busId}`);
      console.log(`Socket ${socket.id} joined room bus_${busId}`);
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

// Getter for io instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};
