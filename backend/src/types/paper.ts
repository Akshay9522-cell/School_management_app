// src/types/paper.ts

export type QuestionType = 'MCQ' | 'ShortAnswer' | 'Descriptive';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SectionPattern {
  name: string;
  marksPerQuestion: number;
  numberOfQuestions: number;
  difficulty: Record<Difficulty, number>;
  questionType: QuestionType;
}

export interface GeneratePaperPayload {
  subjectId: string;
  chapterFrom: number;
  chapterTo: number;
  pattern: {
    sections: SectionPattern[];
  };
}
