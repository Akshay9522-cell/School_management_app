export interface Blueprint {
  _id: string;
  class: string;
  subject: string;
  examType: 'unit' | 'term' | 'final';
  totalMarks: number;
  duration: number;
  sections: { sectionType: string; count: number; marksPerQuestion: number }[];
  difficulty: { easy: number; medium: number; hard: number };
  chapterWeightage: { chapter: string; marks: number }[];
  createdAt: string;
}

export interface Question {
  _id: string;
  question: string;
  options?: string[];
  marks: number;
}
// Add to src/types/index.ts
export interface GeneratedPaper {
  _id: string;
  blueprint: string;
  class: string;
  subject: string;
  examType: string;
  totalMarks: number;
  duration: number;
  questions: Array<{
    _id: string;
    questionId: {
      _id: string;
      question: string;
      options?: string[];
      marks: number;
    };
    sectionType: string;
    marks: number;
  }>;
  createdAt: string;
}
