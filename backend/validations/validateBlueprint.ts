import { z } from 'zod';

export const createBlueprintSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  examType: z.enum(['unit', 'term', 'final'], { message: 'Invalid exam type' }),
  totalMarks: z.number().min(1, 'Total marks must be positive'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  sections: z.array(z.object({
    sectionType: z.string().min(1, 'Section type required'),
    count: z.number().min(1, 'Count must be positive'),
    marksPerQuestion: z.number().min(1, 'Marks per question must be positive')
  })).min(1, 'At least one section required'),
  difficulty: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100)
  }),
  chapterWeightage: z.array(z.object({
    chapter: z.string().min(1, 'Chapter name required'),
    marks: z.number().min(1, 'Chapter marks must be positive')
  })).min(1, 'At least one chapter required')
}).refine((data) => 
  data.difficulty.easy + data.difficulty.medium + data.difficulty.hard === 100,
  { message: 'Difficulty percentages must sum to 100', path: ['difficulty'] }
);

export type CreateBlueprintType = z.infer<typeof createBlueprintSchema>;
