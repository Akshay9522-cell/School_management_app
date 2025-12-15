// services/whatsappService.ts
import twilio from 'twilio';
import { buildStudentWeeklyMessage } from '../utils/weeklyReportFormatter';
import { StudentWeeklySummary } from '../utils/weeklyReportFormatter';


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);


export async function sendClassWeeklyReports(
  classId: string,
  start: string,
  end: string,
  students: StudentWeeklySummary[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const student of students) {
    try {
      const message = buildStudentWeeklyMessage(student, start, end);
      const parentPhone = `whatsapp:${student.parentPhone}`; // E.164 format: +919876543210
      
      
   // services/whatsappService.ts - UPDATE the send block:
const msg = await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: parentPhone,
  body: message
});

console.log(`✅ ${student.name}: SID=${msg.sid}, Status=${msg.status}`);

// Check delivery status after 10 seconds
setTimeout(async () => {
  const status = await client.messages(msg.sid!).fetch();
  console.log(`📊 ${student.name} Final Status: ${status.status}`);
}, 1500);

      
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`Failed ${student.name} (${student.parentPhone}): ${error.message}`);
      console.error(`WhatsApp send failed for ${student.name}:`, error);
    }
  }

  return { success, failed, errors };
}
