// utils/weeklyReportFormatter.ts
import dayjs from "dayjs";

interface TestSummary {
  subject: string;
  totalTests: number;
  averageScore: number;
  lastTestMarks: number;
  lastTestTotal: number;
}

export interface StudentWeeklySummary {
  studentId: string;
  name: string;
  parentPhone: string;
  attendance: {
    presentDays: number;
    totalDays: number;
    percentage: number;
  };
  homework: {
    completeDays: number;
    totalDays: number;
    percentage: number;
  };
  tests: TestSummary[];
}

export function buildStudentWeeklyMessage(
  student: StudentWeeklySummary,
  start: string,
  end: string,
  schoolName = "Your School"
): string {
  const startDate = dayjs(start).format("DD-MM-YYYY");
  const endDate = dayjs(end).format("DD-MM-YYYY");

  const att = student.attendance;
  const hw = student.homework;

  const header = `${schoolName}\nWeekly Progress Report`;
  const basicInfo = `\n\nStudent: ${student.name}\nWeek: ${startDate} to ${endDate}`;

  const attendanceLine = `\n\nAttendance: ${att.presentDays} / ${att.totalDays} days (${att.percentage}%)`;
  const homeworkLine = `\nHomework: ${hw.completeDays} / ${hw.totalDays} days complete (${hw.percentage}%)`;

  let testsBlock = "";
  if (student.tests && student.tests.length > 0) {
    const lines = student.tests.map((t) => {
      return `- ${t.subject}: ${t.lastTestMarks} / ${t.lastTestTotal} (avg ${t.averageScore.toFixed(
        2
      )})`;
    });
    testsBlock = `\n\nTests:\n${lines.join("\n")}`;
  } else {
    testsBlock = `\n\nTests: No tests recorded this week.`;
  }

  return header + basicInfo + attendanceLine + homeworkLine + testsBlock;
}
