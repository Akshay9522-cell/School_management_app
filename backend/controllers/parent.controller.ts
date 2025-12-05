import Student from "../models/Student";
import Bus from "../models/Bus/Bus";

export const getMyBus = async (req: any, res: any) => {
  try {
    const parentId = req.user._id; // From JWT auth middleware

    // Find student linked to this parent
    const student = await Student.findOne({ parentUserId: parentId })
      .populate("busId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student linked with this parent"
      });
    }

    if (!student.busId) {
      return res.status(404).json({
        success: false,
        message: "Bus not assigned to this student"
      });
    }

    const bus: any = student.busId;

    return res.json({
      success: true,
      bus: {
        busId: bus._id,
        busNumber: bus.busNumber,
        currentLat: bus.currentLat,
        currentLng: bus.currentLng,
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
