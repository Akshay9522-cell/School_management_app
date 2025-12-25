import cron from "node-cron";
import { MeetingSOS } from "../models/Meetings/MeetingSOS";

export const startCleanup = () => {
  // 🔥 Every 5 minutes (test) → Change to "0 * * * *" for hourly
  cron.schedule("*/5 * * * *", async () => {
    console.log("🧹 Cleaning old seen SOS...");
    
    const cutoffDate = new Date(Date.now() - 1 * 60 * 1000); // 24h ago
    
    // ✅ FIXED: Delete ONLY fully-seen SOS older than 24h
    const result = await MeetingSOS.deleteMany({
      // EVERY teacher must have seen it
      "statusByTeacher.status": "seen",
      updatedAt: { $lt: cutoffDate }
    });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Deleted ${result.deletedCount} fully-seen SOS older than 24h`);
    } else {
      console.log("ℹ️ No old seen SOS to delete");
    }
  });
  
  console.log("✅ SOS Cleanup started (every 5 min)");
};
