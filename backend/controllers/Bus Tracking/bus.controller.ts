import { Request, Response } from "express";
import Bus from "../../models/Bus/Bus";
import RouteModel from "../../models/Route";


export const createBus = async (req: Request, res: Response) => {
  try {
    const { busNumber, driverName, driverPhone, routeId } = req.body;

    const bus = await Bus.create({
      busNumber,
      driverName,
      driverPhone,
      routeId: routeId || null,
      currentStopIndex: 0,
      isOnline: false
    });

    res.status(201).json({ success: true, bus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuses = async (req: Request, res: Response) => {
  try {
    const buses = await Bus.find().populate("routeId");
    res.json({ success: true, buses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("routeId");

    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    res.json({ success: true, bus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    res.json({ success: true, bus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBus = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    res.json({ success: true, message: "Bus deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignRouteToBus = async (req: Request, res: Response) => {
  try {
    const { busId, routeId } = req.body;

    const bus = await Bus.findById(busId);
    const route = await RouteModel.findById(routeId);

    if (!bus || !route) {
      return res.status(404).json({ success: false, message: "Bus or Route not found" });
    }

    bus.routeId = routeId;
    bus.currentStopIndex = 0;
    await bus.save();
    await bus.populate("routeId")

    res.json({ success: true, message: "Route assigned", bus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


