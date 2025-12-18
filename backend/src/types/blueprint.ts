export interface CreateBlueprintInput {
  class: string;
  subject: string;
  examType: 'unit' | 'term' | 'final';
  totalMarks: number;
  duration: number;
  sections: { 
    sectionType: string; 
    count: number; 
    marksPerQuestion: number 
  }[];
  difficulty: { 
    easy: number; 
    medium: number; 
    hard: number 
  };
  chapterWeightage: { 
    chapter: string; 
    marks: number 
  }[];
}
