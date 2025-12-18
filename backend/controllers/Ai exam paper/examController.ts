import { Request, Response } from "express";
import { generateExamPaper } from "../../services/Ai exam paper/examGenerator";
import ExamPattern from "../../models/AI exam paper Generator/ExamPattern";
import { QuestionType, GeneratePaperPayload } from "../../src/types/paper";

export const generatePaperController = async (req: Request, res: Response) => {
  try {
    const { subjectId, chapterFrom, chapterTo, patternId } = req.body;
    console.log(req.body);

    if (!subjectId || !chapterFrom || !chapterTo || !patternId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const patternDoc = await ExamPattern.findById(patternId);
    if (!patternDoc) {
      return res.status(404).json({ message: "Pattern not found" });
    }

    // ✅ Runtime safe conversion
    const toQuestionType = (value: string): QuestionType => {
      const val = value.toLowerCase().trim();
      if (val === "mcq" || val === "short" || val === "long" || val === "very_short") {
        return val as QuestionType;
      }
      throw new Error(`Invalid questionType: ${value}`);
    };

    // ✅ Create payload for service
    const payload: GeneratePaperPayload = {
      subjectId,
      chapterFrom: Number(chapterFrom),
      chapterTo: Number(chapterTo),
      pattern: {
        sections: patternDoc.sections.map((s) => ({
          name: s.name,
          marksPerQuestion: s.marksPerQuestion,
          numberOfQuestions: s.numberOfQuestions,
          difficulty: s.difficulty,
          questionType: toQuestionType(s.questionType), // safe conversion
        })),
      },
    };

    // ✅ Generate paper
    const questions = await generateExamPaper(payload);

    return res.status(200).json({
      success: true,
      totalQuestions: questions.length,
      questions,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
