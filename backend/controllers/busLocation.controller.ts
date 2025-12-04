import { Request, Response } from "express";
import Bus from "../models/Bus/Bus";
import { getIO } from "../lib/socket";
import Route from "../models/Bus/Route";
import Stop from "../models/Bus/Stop";
import { Types } from "mongoose";


const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const updateBusLocation = async (req: Request, res: Response) => {
  try {
    const { busId, lat, lng } = req.body;

    if (!busId || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "busId, lat, and lng are required",
      });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    bus.currentLat = lat;
    bus.currentLng = lng;
    bus.lastUpdated = new Date();
    bus.isOnline = true;

    await bus.save();

   // ----- OPTIMIZED STOP DETECTION -----

const STOP_RADIUS_METERS = 50;

let nextStop = null;
let distanceToNext = null;
let etaMinutes = null;

if (bus.routeId) {
  const stops = await Stop.find({ routeId: bus.routeId }).sort({ order: 1 });

  if (stops.length > 0) {
    let currentIndex = bus.currentStopIndex ?? 0;

    // STEP 1: detect if bus reached current stop
    if (stops[currentIndex]) {
      const stop = stops[currentIndex];
      const dist = haversineDistance(lat, lng, stop.lat, stop.lng);

      if (dist < STOP_RADIUS_METERS) {
        currentIndex += 1;  
        bus.currentStopIndex = currentIndex;
        await bus.save();
      }
    }

    // STEP 2: select next stop
    nextStop = stops[currentIndex] ?? null;

    // STEP 3: compute distance + ETA
    if (nextStop) {
      distanceToNext = Math.round(
        haversineDistance(lat, lng, nextStop.lat, nextStop.lng)
      );

      const avgSpeedMps = 8;
      etaMinutes = Math.max(0, Math.round((distanceToNext / avgSpeedMps) / 60));
    }
  }
}



    // Emit socket event to room bus_<busId>
    try {
      const io = getIO();
      const payload = {
        busId,
        lat,
        lng,
        isOnline: bus.isOnline,
        lastUpdated: bus.lastUpdated,
        currentStopIndex: bus.currentStopIndex ?? 0,
        nextStop,
        distanceToNext,
        etaMinutes
      };
      io.to(`bus_${busId}`).emit("busLocationUpdate", payload);
    } catch (e) {
      console.warn("Socket emit failed (maybe socket not initialized)", e);
    }

    return res.json({
      success: true,
      message: "Location updated successfully",
      bus, nextStop, distanceToNext, etaMinutes
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
