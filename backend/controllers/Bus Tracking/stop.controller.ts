import { Request, Response } from "express";
import Stop from "../../models/Bus/Stop";
import Route from "../../models/Bus/Route";
import { Types } from "mongoose";

// Create a stop
export const createStop = async (req: Request, res: Response) => {
  try {
    const { name, lat, lng, order, routeId } = req.body;
   

    // Check if route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    const stop = await Stop.create({
      name,
      lat,
      lng,
      order,
      routeId
    });

    // Add stop to route's stops array
    route.stops.push(stop._id as Types.ObjectId);

    await route.save();

    res.status(201).json({ success: true, stop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all stops
export const getStops = async (req: Request, res: Response) => {
  try {
    const stops = await Stop.find().populate("routeId");
    res.json({ success: true, stops });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get stop by ID
export const getStopById = async (req: Request, res: Response) => {
  try {
    const stop = await Stop.findById(req.params.id).populate("routeId");
    if (!stop) {
      return res.status(404).json({ success: false, message: "Stop not found" });
    }
    res.json({ success: true, stop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stop
export const updateStop = async (req: Request, res: Response) => {
  try {
    const stop = await Stop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stop) {
      return res.status(404).json({ success: false, message: "Stop not found" });
    }
    res.json({ success: true, stop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete stop
export const deleteStop = async (req: Request, res: Response) => {
  try {
    const stop = await Stop.findByIdAndDelete(req.params.id);
    if (!stop) {
      return res.status(404).json({ success: false, message: "Stop not found" });
    }

    // Remove stop from route
    await Route.findByIdAndUpdate(stop.routeId, { $pull: { stops: stop._id } });

    res.json({ success: true, message: "Stop deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
