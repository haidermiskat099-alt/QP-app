import { Question } from '../types';

export interface ParseResult {
  questions: Question[];
  errors: string[];
  totalParsed: number;
}

/**
 * Robust bulk parser for multi-choice questions with 4 options and star (*) markers.
 * Supports formats like:
 * 1. Question text
 * (A) Option 1
 * (B) Option 2 *
 * (C) Option 3
 * (D) Option 4
 * Explanation: ...
 */
export function parseBulkMCQText(rawText: string): ParseResult {
  const errors: string[] = [];
  const questions: Question[] = [];

  if (!rawText.trim()) {
    return { questions: [], errors: ['Text area is empty. Please paste your MCQ questions.'], totalParsed: 0 };
  }

  // Normalize line endings
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into raw question blocks by blank lines or by question number prefixes (e.g. "1.", "2.", "Q1:", "Q2.")
  // First, check if blocks are separated by double newlines:
  let rawBlocks = normalized
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  // If there's only 1 block but it contains multiple numbered questions like "1. ... 2. ...", split by question numbering
  if (rawBlocks.length <= 1) {
    const questionSplitRegex = /(?=(?:^|\n)\s*(?:Q\s*\d+[\.:\)]|\d+[\.:\)]|\bQuestion\s+\d+[\.:\)]))/i;
    const splitMatches = normalized.split(questionSplitRegex).map((b) => b.trim()).filter((b) => b.length > 0);
    if (splitMatches.length > 1) {
      rawBlocks = splitMatches;
    }
  }

  rawBlocks.forEach((block, blockIndex) => {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      errors.push(`Block #${blockIndex + 1}: Too short to be a valid question with options.`);
      return;
    }

    let questionPrompt = '';
    const optionLines: { text: string; isCorrect: boolean; rawLetter?: string }[] = [];
    let explanation = '';

    // Regex to match option identifiers like (A), (B), A., B), [A], etc.
    const optionPrefixRegex = /^(?:[\(\[]?([A-Da-d1-4])[\)\]\.\:\-]\s*|\*?\s*[\(\[]?([A-Da-d1-4])[\)\]\.\:\-]\s*)/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if line is an explanation
      if (/^(?:Explanation|Rationale|Note|Ans|Answer|Sol|Solution)[\:\-]/i.test(line)) {
        explanation = line.replace(/^(?:Explanation|Rationale|Note|Ans|Answer|Sol|Solution)[\:\-]\s*/i, '').trim();
        continue;
      }

      // Check if line is an option
      const match = line.match(optionPrefixRegex);
      const hasStar = line.includes('*') || /\[correct\]/i.test(line) || /^\s*\*/.test(line);

      if (match) {
        // Strip the option prefix and star markers
        let cleanOptionText = line
          .replace(optionPrefixRegex, '')
          .replace(/\*/g, '')
          .replace(/\[correct\]/gi, '')
          .trim();

        // Also check if option was marked like "(A)*"
        const isMarkedCorrect = hasStar;

        optionLines.push({
          text: cleanOptionText,
          isCorrect: isMarkedCorrect,
          rawLetter: (match[1] || match[2] || '').toUpperCase(),
        });
      } else if (optionLines.length === 0) {
        // Still reading question prompt lines
        if (questionPrompt) {
          questionPrompt += ' ' + line;
        } else {
          // Clean leading question numbering e.g. "1.", "Q1:", "Question 1:"
          questionPrompt = line.replace(/^(?:Q\s*\d+[\.\:\)]|\d+[\.\:\)]|\bQuestion\s+\d+[\.\:\)])\s*/i, '').trim();
        }
      } else {
        // If options have already started, but line doesn't match prefix:
        // Could be a continuation of the previous option or an un-prefixed explanation
        if (optionLines.length > 0) {
          const lastOpt = optionLines[optionLines.length - 1];
          lastOpt.text += ' ' + line.replace(/\*/g, '').trim();
          if (line.includes('*')) {
            lastOpt.isCorrect = true;
          }
        }
      }
    }

    if (!questionPrompt) {
      errors.push(`Block #${blockIndex + 1}: Missing question text.`);
      return;
    }

    // Ensure we have 4 options (if 2 or 3, we fill or alert; if 4, perfect)
    if (optionLines.length < 2) {
      errors.push(`Block #${blockIndex + 1} ("${questionPrompt.slice(0, 30)}..."): Found only ${optionLines.length} option(s). At least 4 required.`);
      return;
    }

    // Normalize to 4 options
    const finalOptions: [string, string, string, string] = [
      optionLines[0]?.text || 'Option A',
      optionLines[1]?.text || 'Option B',
      optionLines[2]?.text || 'Option C',
      optionLines[3]?.text || 'Option D',
    ];

    // Find correct index
    let correctIndex = optionLines.findIndex((opt) => opt.isCorrect);

    // If no star (*) was found on an option, check if there's an "Answer: B" line in explanation or prompt
    if (correctIndex === -1) {
      const ansMatch = block.match(/(?:Answer|Ans|Correct)\s*[\:\-]?\s*[\(\[]?([A-Da-d1-4])[\)\]]?/i);
      if (ansMatch) {
        const char = ansMatch[1].toUpperCase();
        if (char === 'A' || char === '1') correctIndex = 0;
        else if (char === 'B' || char === '2') correctIndex = 1;
        else if (char === 'C' || char === '3') correctIndex = 2;
        else if (char === 'D' || char === '4') correctIndex = 3;
      }
    }

    // Default to 0 if still not marked, and record warning
    if (correctIndex === -1) {
      correctIndex = 0;
      errors.push(`Block #${blockIndex + 1}: No star (*) marked for correct answer. Defaulted to Option (A).`);
    }

    questions.push({
      id: 'bulk_q_' + Date.now() + '_' + blockIndex,
      question: questionPrompt,
      options: finalOptions,
      correctIndex,
      explanation: explanation || undefined,
    });
  });

  return {
    questions,
    errors,
    totalParsed: questions.length,
  };
}

/**
 * Standard authentic template sample for 1-click load in Admin Panel
 */
export const SAMPLE_BULK_MCQ_TEXT = `1. Which gas is most abundant in Earth's atmosphere by volume fraction?
(A) Oxygen (O2)
(B) Nitrogen (N2) *
(C) Argon (Ar)
(D) Carbon Dioxide (CO2)
Explanation: Nitrogen makes up approximately 78.08% of dry air by volume.

2. In human physiology, which organelle is considered the primary site of aerobic ATP cellular generation?
(A) Mitochondria *
(B) Lysosome
(C) Golgi Complex
(D) Ribosome
Explanation: The inner mitochondrial cristae host the electron transport chain and ATP synthase complexes.

3. Under classical mechanics, what happens to the gravitational force between two masses if their separation distance is doubled?
(A) It doubles
(B) It remains unchanged
(C) It reduces to one-fourth (1/4) *
(D) It reduces to one-half (1/2)
Explanation: Newton's universal gravitation obeys an inverse-square law: F = G(m1*m2)/r^2.

4. In digital logic and computer architecture, which logic gate produces HIGH output only when both inputs differ?
(A) AND Gate
(B) OR Gate
(C) XOR (Exclusive-OR) Gate *
(D) NAND Gate
Explanation: XOR truth table yields output 1 when inputs are (0,1) or (1,0).

5. Which treaty established the European Union and paved the path for the single currency Euro?
(A) Treaty of Versailles
(B) Maastricht Treaty (1992) *
(C) Geneva Convention
(D) Treaty of Rome
Explanation: Signed in Maastricht, Netherlands in 1992, creating the modern European Union framework.`;
