import {z} from 'zod'

export const attendanceCheckSchema = z.object({
  classroomCode: z.string().min(1),
  teacherId: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});
