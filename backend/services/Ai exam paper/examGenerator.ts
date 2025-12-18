import Question, { Difficulty, IQuestion } from "../../models/AI exam paper Generator/Question";
import Chapter, { IChapter } from "../../models/AI exam paper Generator/Chapter";
import { GeneratePaperPayload } from "../../src/types/paper";

export const generateExamPaper = async (
  payload: GeneratePaperPayload
): Promise<IQuestion[]> => {

  const { subjectId, chapterFrom, chapterTo, pattern } = payload;

  // 1️⃣ Fetch chapters
  const chapters: IChapter[] = await Chapter.find({
    subject: subjectId,
    chapterNumber: { $gte: chapterFrom, $lte: chapterTo },
  });

  const chapterIds = chapters.map((c) => c._id);

  let finalQuestions: IQuestion[] = [];

  // 2️⃣ Loop sections
  for (const section of pattern.sections) {
    const difficulties = section.difficulty as Record<Difficulty, number>;

    for (const level of Object.keys(difficulties) as Difficulty[]) {
      const count = difficulties[level];
      if (count <= 0) continue;

      const questions = await Question.aggregate<IQuestion>([
        {
          $match: {
            chapter: { $in: chapterIds },
            marks: section.marksPerQuestion,
            difficulty: level,
            type: section.questionType,
            isActive: true,
          },
        },
        { $sample: { size: count } },
      ]);

      finalQuestions.push(...questions);
    }
  }

  return finalQuestions;
};
