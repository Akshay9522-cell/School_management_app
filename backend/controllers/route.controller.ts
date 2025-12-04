import { Request, Response } from "express";
import Route from "../models/Route";
import Stop from "../models/Bus/Stop";

// Create a new route
export const createRoute = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const route = await Route.create({
      name,
      description,
      stops: []
    });

    res.status(201).json({ success: true, route });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all routes
export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await Route.find().populate("stops");
    res.json({ success: true, routes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single route by ID
export const getRouteById = async (req: Request, res: Response) => {
  try {
    const route = await Route.findById(req.params.id).populate("stops");

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    res.json({ success: true, route });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update route
export const updateRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }
    res.json({ success: true, route });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Optional: delete route
export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }
    res.json({ success: true, message: "Route deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
