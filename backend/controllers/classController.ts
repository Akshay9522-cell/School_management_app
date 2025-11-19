    import { Request, Response } from "express";
    import {
    addClassService,
    getClassesService,
    getClassByIdService,
    updateClassService,
    deleteClassService,
    } from "../services/classService";

    // ✅ Create a new Class
    export const addClass = async (req: Request, res: Response) => {
    try {
        const newClass = await addClassService(req.body);
        console.log(newClass)
        res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: newClass,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    // ✅ Get all Classes with pagination, filtering, sorting
    export const getClasses = async (req: Request, res: Response) => {
    try {
        const result = await getClassesService(req.query);
        res.status(200).json({
        success: true,
        message: "Classes fetched successfully",
        ...result,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    // ✅ Get Class by ID (with teacher & students populated)
    export const getClassById = async (req: Request, res: Response) => {
    try {
        const classData = await getClassByIdService(req.params.id);
        if (!classData)
        return res
            .status(404)
            .json({ success: false, message: "Class not found" });

        res.status(200).json({
        success: true,
        data: classData,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    // ✅ Update Class
    export const updateClass = async (req: Request, res: Response) => {
    try {
        const updated = await updateClassService(req.params.id, req.body);
        if (!updated)
        return res
            .status(404)
            .json({ success: false, message: "Class not found" });

        res.status(200).json({
        success: true,
        message: "Class updated successfully",
        data: updated,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

    // ✅ Delete Class
    export const deleteClass = async (req: Request, res: Response) => {
    try {
        const deleted = await deleteClassService(req.params.id);
        if (!deleted)
        return res
            .status(404)
            .json({ success: false, message: "Class not found" });

        res
        .status(200)
        .json({ success: true, message: "Class deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
    };
