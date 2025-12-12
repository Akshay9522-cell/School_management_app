import Test from "../../models/Tests/Test";
import { Request, Response } from "express";

// CREATE TEST
export const createTest = async (req: Request, res: Response) => {
  try {
    const { classId, subjectName, maxMarks, testDate } = req.body;

    if (!classId || !subjectName || !maxMarks) {
      return res.status(400).json({
        success: false,
        message: "classId, subjectName & maxMarks are required",
      });
    }

    const test = await Test.create({
      classId,
      subjectName,
      maxMarks,
      testDate: testDate || new Date(),
    });

    res.json({ success: true, test });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET TESTS BY CLASS
export const getTestsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const tests = await Test.find({ classId });

    res.json({ success: true, tests });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE TEST
export const updateTest = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const updated = await Test.findByIdAndUpdate(testId, req.body, {
      new: true,
    });

    if (!updated) {
      return res.json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, updated });
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// DELETE TEST
export const deleteTest = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;

    const deleted = await Test.findByIdAndDelete(testId);

    if (!deleted) {
      return res.json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
