import { Request, Response } from "express";
import { MeetingSOS } from "../../models/Meetings/MeetingSOS";
import Teacher from "../../models/Teacher"; 
import { Types } from "mongoose";
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";

export const sendMessage = async(req: Request, res: Response) => {
  try {
    // ✅ FIXED: Get adminId from JWT (not req.user)
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token" });
    
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const adminId = new Types.ObjectId(decoded.userId); // from your login JWT
    const { teacherIds, message, channel = "web" } = req.body;

    console.log("🔍 Admin sending SOS:", adminId, "Teachers:", teacherIds);

    if (!teacherIds?.length) {
      return res.status(400).json({ message: "Please select at least one teacher" });
    }
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Validate teachers exist
    const teacherObjectIds = teacherIds.map((id: number) => new Types.ObjectId(id));
    const teachers = await Teacher.find({ _id: { $in: teacherObjectIds } }).select("_id");
    if (!teachers.length) {
      return res.status(400).json({ message: "No valid teachers found" });
    }

    const statusByTeacher = teachers.map((t) => ({
      teacher: t._id,
      status: "queued" as const,
    }));

    const sos = await MeetingSOS.create({
      adminId,
      teacherIds: teachers.map((t) => t._id),
      message,
      channel,
      statusByTeacher,
    });

    console.log("✅ SOS created:", sos._id);

    return res.status(201).json({
      message: "Meeting SOS created and queued",
      sosId: sos._id,
      totalTeachers: teachers.length,
    });
  } catch (err: any) {
    console.error("❌ sendMessage error:", err);
    return res.status(500).json({ message: "Failed to create Meeting SOS" });
  }
};


export const teacherSeen = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = req.header("Authorization");
    console.log("🔍 teacherSeen - Auth header received:", !!authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: "No Authorization header",
        debug: { hasHeader: false }
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.replace("Bearer ", "").trim();
    console.log("🔍 teacherSeen - Token length:", token.length);
    
    if (!token || token === "Bearer") {
      return res.status(401).json({ 
        message: "Invalid token format",
        debug: { tokenLength: token.length }
      });
    }

    // 3️⃣ Decode JWT with full error handling
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      console.log("✅ JWT verified:", { 
        id: decoded.id, 
        role: decoded.role,
        userId: decoded.userId 
      });
    } catch (jwtErr: any) {
      console.error("❌ JWT verification failed:", jwtErr.message);
      return res.status(401).json({ 
        message: "Invalid/expired token", 
        error: jwtErr.message 
      });
    }

    // 4️⃣ Role check
    if (decoded.role !== "teacher") {
      console.log("❌ Wrong role:", decoded.role);
      return res.status(403).json({ 
        message: "Teacher access required",
        gotRole: decoded.role 
      });
    }

    const teacherId = decoded.id;
    console.log("🔍 Teacher ID from JWT:", teacherId);

    // 5️⃣ Get SOS
    const { id } = req.params;
    console.log("🔍 SOS ID from params:", id);

    const sos = await MeetingSOS.findById(id);
    if (!sos) {
      console.log("❌ SOS not found in DB:", id);
      return res.status(404).json({ message: "SOS not found" });
    }
    console.log("✅ SOS found:", sos._id);

    // 6️⃣ Find teacher entry (SAFE)
    const teacherObjectId = new Types.ObjectId(teacherId);
    console.log("🔍 Looking for teacher in SOS.teacherIds:", sos.teacherIds.map((id: any) => id.toString()));
    
    const entryIndex = sos.statusByTeacher.findIndex((s: any) => {
      const teacherMatches = s.teacher?.toString() === teacherId || 
                            s.teacher?.equals?.(teacherObjectId);
      console.log("🔍 Checking entry:", {
        index: sos.statusByTeacher.indexOf(s),
        teacherId: teacherId,
        entryTeacher: s.teacher?.toString(),
        matches: teacherMatches
      });
      return teacherMatches;
    });

    console.log("🔍 Final entryIndex:", entryIndex);

    if (entryIndex === -1) {
      return res.status(403).json({ 
        message: "You are not in this SOS list",
        debug: {
          teacherId,
          sosTeacherIds: sos.teacherIds.map((id: any) => id.toString()),
          statusTeachers: sos.statusByTeacher.map((s: any) => s.teacher?.toString())
        }
      });
    }

    // 7️⃣ Update status
    sos.statusByTeacher[entryIndex].status = "seen";
    sos.statusByTeacher[entryIndex].seenAt = new Date();
    await sos.save();

    console.log("✅ SUCCESS - Teacher marked seen:", {
      teacherId,
      sosId: sos._id,
      updatedStatus: sos.statusByTeacher[entryIndex].status
    });

    res.json({ 
      message: "Marked as seen ✅", 
      sosId: sos._id,
      updatedEntry: sos.statusByTeacher[entryIndex]
    });

  } catch (err: any) {
    console.error("❌ CRITICAL teacherSeen error:", {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    res.status(500).json({ 
      message: "Failed to update status",
      error: err.message 
    });
  }
};

export const meetingLatestActive = async(req: Request, res: Response) => {
  try {
    // ✅ FIXED: JWT decode
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token" });
    
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const adminId = new Types.ObjectId(decoded.userId);
   // console.log("🔍 Admin checking active SOS:", adminId); 
   
    const sos = await MeetingSOS.findOne({ adminId })
      .sort({ createdAt: -1 })
      .populate("statusByTeacher.teacher", "name email");
    
    if (!sos) return res.json(null);
    res.json(sos);
  } catch (err: any) {
   // console.error("❌ meetingLatestActive error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const meetingHistory = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
   // console.log("🔍 JWT decoded:", { id: decoded.id, userId: decoded.userId, role: decoded.role });

    const { role, id: teacherId, userId: adminUserId } = decoded;
    if (!role) {
      return res.status(401).json({ success: false, message: "Invalid token: missing role" });
    }

    let list: any[];

    if (role === "admin") {
      if (!adminUserId) {
        return res.status(401).json({ success: false, message: "Admin token missing userId" });
      }
      //console.log("🔍 Admin history with userId:", adminUserId);
      list = await MeetingSOS.find({ adminId: new Types.ObjectId(adminUserId) })
        .populate("statusByTeacher.teacher", "name")
        .sort({ createdAt: -1 })
        .limit(20);
    } else if (role === "teacher") {
      if (!teacherId) {
        return res.status(401).json({ success: false, message: "Teacher token missing id" });
      }
      //console.log("🔍 Teacher history with teacherId:", teacherId);
      list = await MeetingSOS.find({ teacherIds: new Types.ObjectId(teacherId) })
        .populate("adminId", "name")
        .sort({ createdAt: -1 })
        .limit(20);
    } else {
      return res.status(403).json({ success: false, message: "Access denied for this role" });
    }

   // console.log(`✅ Found ${list.length} SOS records for ${role}`);
    res.json({ success: true, list, count: list.length });
  } catch (err: any) {
    //console.error("❌ meetingHistory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
