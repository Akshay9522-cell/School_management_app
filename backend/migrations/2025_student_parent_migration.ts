// migrations/2025_add_parent_bus_fields.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/User";
import Student from "../models/Student";

async function run() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("✅ Connected to MongoDB");

  // find students missing the new field
  const students = await Student.find({ parentUserId: { $exists: false } });

  console.log(`🔍 Found ${students.length} students to update`);

  for (const s of students) {
    let parent = null;

    // match using existing fields in your Student collection
    if (s.parentPhone) {
      parent = await User.findOne({ phone: s.parentPhone });
    }
    if (!parent && (s as any).parentEmail) {
      parent = await User.findOne({ email: (s as any).parentEmail });
    }
    if (!parent && s.parentName) {
      parent = await User.findOne({ name: s.parentName });
    }

    if (!parent) {
      console.log(`⚠️ No parent found for student ${s.name} (${s._id})`);
      continue;
    }

    // update student with new fields
    await Student.updateOne(
      { _id: s._id },
      {
        $set: {
          parentUserId: parent._id,
          isBusAssigned: false,
          pickupLocation: "",
          dropLocation: "",
          busId: null,
          routeId: null
        }
      }
    );

    // add student in parent's children array
    await User.updateOne(
      { _id: parent._id },
      { $addToSet: { children: s._id } }
    );

    console.log(`✅ Linked Student ${s.name} → Parent ${parent.name}`);
  }

  console.log("🎉 Migration Completed!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Migration Failed:", err);
  process.exit(1);
});
