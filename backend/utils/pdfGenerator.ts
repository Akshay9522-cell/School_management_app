import puppeteer from 'puppeteer';

export const generatePDF = async (paper: any, board: string) => {
  let questionsHTML = '';

  // Group by groupId for OR sections
  const groups: { [key: string]: any[] } = {};
  const singles: any[] = [];

  paper.questions.forEach((q: any, index: number) => {
    if (q.groupId) {
      if (!groups[q.groupId]) groups[q.groupId] = [];
      groups[q.groupId].push({ ...q, displayIndex: index + 1 });
    } else {
      singles.push({ ...q, displayIndex: index + 1 });
    }
  });

  // Render non-grouped questions first
  singles.forEach((q: any) => {
    questionsHTML += renderQuestionBlock(q);
  });

  // Render OR groups
  Object.keys(groups).forEach((gid) => {
    const qs = groups[gid];
    if (!qs || qs.length === 0) return;

    const firstNo = qs[0].displayIndex;
    const lastNo = qs[qs.length - 1].displayIndex;

    questionsHTML += `
      <div style="margin-bottom: 15px; font-weight: bold; font-size: 15px;">
        Q${firstNo}${firstNo !== lastNo ? `–Q${lastNo}` : ''}. Attempt any one of the following:
      </div>
    `;

    qs.forEach((q: any) => {
      questionsHTML += renderQuestionBlock(q, true);
    });
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { margin: 1in; }
        body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px; }
        .board-header { font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
        .paper-title { font-size: 28px; font-weight: bold; color: #1f2937; }
        .instructions { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #d1d5db; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="board-header">${paper.board} BOARD</div>
        <div class="paper-title">${paper.class} ${paper.subject} ${paper.chapter}</div>
        <div style="font-size: 18px; margin-top: 10px;">Time: ${paper.duration} minutes | Max Marks: ${paper.totalMarks}</div>
      </div>
      
      <div class="instructions">
        <strong>Instructions:</strong>
        <ol style="margin-top: 10px; padding-left: 20px;">
          <li>Attempt all questions unless otherwise specified</li>
          <li>Write answers clearly</li>
          <li>Question numbers with options: attempt any one question from the pair</li>
        </ol>
      </div>
      
      ${questionsHTML}
      
      <div class="footer">
        <p>End of Paper | Page 1 of 1</p>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '30px', right: '30px' },
  });
  await browser.close();

  return pdf;
};

// helper to render one question block
function renderQuestionBlock(q: any, isInOrGroup = false): string {
  const color =
    q.difficulty === 'easy'
      ? '#10b981'
      : q.difficulty === 'medium'
      ? '#f59e0b'
      : '#ef4444';

  const numberPrefix = isInOrGroup ? '' : `Q${q.displayIndex || ''}. `;

  const optionsHTML =
    q.type === 'objective' && q.options && q.options.length >= 4
      ? `
      <div style="margin-left: 20px; margin-top: 8px;">
        <label style="display: block; margin-bottom: 4px;">(a) ${q.options[0]}</label>
        <label style="display: block; margin-bottom: 4px;">(b) ${q.options[1]}</label>
        <label style="display: block; margin-bottom: 4px;">(c) ${q.options[2]}</label>
        <label style="display: block; margin-bottom: 4px;">(d) ${q.options[3]}</label>
      </div>
    `
      : `
      <div style="margin-left: 20px; margin-top: 8px; min-height: 60px; border-top: 1px dashed #9ca3af; padding-top: 8px;">
        <!-- space for subjective answer -->
      </div>
    `;

  return `
    <div style="margin-bottom: 20px; padding: 16px; border-left: 4px solid ${color};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <strong style="font-size: 15px;">${numberPrefix}${q.question}</strong>
        <span style="background: #e5e7eb; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 13px;">${q.marks} Marks</span>
      </div>
      ${optionsHTML}
    </div>
  `;
}
    