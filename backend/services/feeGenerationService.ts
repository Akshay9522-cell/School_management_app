import mongoose from "mongoose";
import Student from "../models/Student";
import FeeStructure from "../models/Feestructure";
import StudentFee from "../models/StudentFee";

type GeneratePayload = {
  month: number; // 1-12
  year: number; // yyyy
  classId?: string; // optional
  generatedBy?: string; // user id (for audit)
};

const BATCH_SIZE = 500;

function chunkArray<T>(arr: T[], size = BATCH_SIZE): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export const generateMonthlyFeesService = async (payload: GeneratePayload) => {
  const { month, year, classId, generatedBy } = payload;

  if (!month || !year) throw new Error("month and year are required");
  if (month < 1 || month > 12) throw new Error("month must be between 1 and 12");

  // Build query for fee structures
  const fsQuery: any = {};
  if (classId) {
    if (!mongoose.Types.ObjectId.isValid(classId)) throw new Error("Invalid classId");
    fsQuery.classId = classId;
  }

  // Load fee structures with feeType names (snapshot labels)
  const feeStructures = await FeeStructure.find(fsQuery)
    .populate("classId", "name")
    .populate("fees.feeTypeId", "name defaultAmount")
    .lean();

  if (!feeStructures || feeStructures.length === 0) {
    throw new Error("No fee structures found for the given class(es)");
  }

  let totalRequested = 0;
  let created = 0;
  let skippedPrecise = 0;

  // We'll collect bulk ops across classes but will execute in batches
  const allInsertDocs: any[] = [];

  for (const fs of feeStructures) {
    const classIdStr = (fs.classId as any)?._id?.toString() ?? fs.classId?.toString();

    // find active students for this class
    const students = await Student.find({ class: classIdStr }).select("_id name class").lean();

    if (!students || students.length === 0) continue;

    // prepare feeItems snapshot for this structure
    const feeItems = (fs.fees || []).map((f: any) => ({
      feeType: f.feeTypeId._id,
      label: f.feeTypeId.name || "",
      amount: f.amount,
    }));

    const totalAmount = feeItems.reduce((s: number, it: any) => s + (it.amount || 0), 0);

    // Get existing invoices for students in this class for the month/year
    const studentIds = students.map(s => s._id);
    const existing = await StudentFee.find({
      student: { $in: studentIds },
      periodMonth: month,
      periodYear: year,
    }).select("student").lean();

    const existingSet = new Set((existing || []).map((e: any) => e.student.toString()));

    for (const st of students) {
      totalRequested++;
      if (existingSet.has(st._id.toString())) {
        skippedPrecise++;
        continue;
      }

      const doc = {
        student: st._id,
        class: new mongoose.Types.ObjectId(classIdStr),
        periodMonth: month,
        periodYear: year,
        feeItems,
        totalAmount,
        paidAmount: 0,
        dueAmount: totalAmount,
        status: totalAmount === 0 ? "paid" : "unpaid",
        payments: [],
        generatedBy: generatedBy ? new mongoose.Types.ObjectId(generatedBy) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      allInsertDocs.push(doc);
    }
  }

  // If nothing to insert:
  if (allInsertDocs.length === 0) {
    return {
      created: 0,
      skipped: skippedPrecise,
      totalRequested,
      batches: 0,
    };
  }

  // Execute inserts in batches
  const batches = chunkArray(allInsertDocs, BATCH_SIZE);
  for (const batch of batches) {
    // prepare insertMany for this batch with ordered false (so duplicates won't stop)
    try {
      const res = await StudentFee.insertMany(batch, { ordered: false });
      created += (res || []).length;
    } catch (err: any) {
      // insertMany with ordered:false will throw BulkWriteError for duplicate key errors
      // but res contains inserted docs in some drivers; fallback: count inserted by querying
      if (err && err.insertedDocs && Array.isArray(err.insertedDocs)) {
        created += err.insertedDocs.length;
      } else {
        // As a fallback, approximate created by checking how many of this batch exist now.
        const ids = batch.map(b => ({ student: b.student, periodMonth: b.periodMonth, periodYear: b.periodYear }));
        // Note: this extra query can be expensive; we skip for simplicity.
      }
    }
  }

  return {
    created,
    skipped: skippedPrecise,
    totalRequested,
    batches: batches.length,
  };
};
