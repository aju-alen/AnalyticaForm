import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { resendEmailDRIndex } from '../utils/resendEmailTemplate.js';
import chalk from 'chalk';
import { defenceReadinessSystemPrompt } from '../scripts/ai_chat_prompts.js';

const prisma = new PrismaClient();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SENDER_EMAIL = process.env.RESEND_EMAILID_PHD_DEFENCE_READINESS || '';
const MAX_PER_RUN = 100;

const CATEGORY_NAMES = [
  'Research Knowledge & Foundations',
  'Writing Progress & Structure',
  'Supervisor Communication',
  'Time Management & Productivity',
  'Stress, Motivation & Mental Well-being',
  'Data, Methodology & Analysis Readiness',
  'Writing Habits & Systems',
  'Project Planning & Milestones',
  'Academic Environment & Support',
  'Defense Readiness & Final Stretch',
];


function buildResponseSummary(userResponseArray) {
  const arr = Array.isArray(userResponseArray) ? userResponseArray : [];
  const result = {};

  if (arr.length === 0) return result;

  const first = arr[0];
  const firstSelected = first?.selectedValue?.[0];
  if (firstSelected?.answer != null) {
    result.email = firstSelected.answer;
  }

  for (let i = 1; i < arr.length; i++) {
    const item = arr[i];
    const sv = item?.selectedValue?.[0];
    const question = item?.question ?? `Question ${i}`;
    result[question] = {
      index: sv?.index ?? 0,
      answer: sv?.answer ?? '',
      question: sv?.question ?? question,
    };
  }

  const questionEntries = arr.slice(1, 51);
  const indices = questionEntries.map((item) => (item?.selectedValue?.[0]?.index ?? 0));

  const categoryScores = {};
  for (let c = 0; c < 10; c++) {
    const start = c * 5;
    const fiveIndices = indices.slice(start, start + 5);
    const sum = fiveIndices.reduce((a, b) => a + b, 0);
    categoryScores[CATEGORY_NAMES[c]] = Math.round(sum * 0.1 * 100) / 100;
  }
  const weightedTotal = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  categoryScores['Weighted Total Score'] = Math.round(weightedTotal * 100) / 100;

  return { ...result, ...categoryScores };
}


const REPORT_INSTRUCTIONS = `
GENERATE A REPORT WITH:
1. Summary paragraph (2-3 sentences) about overall readiness
2. Top 1-2 strengths (highest scoring categories)
3. Top 2-3 vulnerabilities (lowest scoring categories)
4. 14-day improvement plan (specific, actionable steps)
5. 3 examiner-style practice questions based on weak areas
6. Warm invitation to book a Strategy Session
7. The link to book a session is https://calendly.com/riseltd
8. Set the heading font color to #E30613.
9. Make sure to add the users score on top.

Tone: Warm, academic, supportive, never judgmental.`;

async function sendToChatGPT(finalObject) {
  const systemPrompt = defenceReadinessSystemPrompt;
  const userPrompt =
    'Response data:\n\n' +
    JSON.stringify(finalObject, null, 2) +
    '\n\n' +
    REPORT_INSTRUCTIONS.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.DEFENCE_READINESS_CHATGPT_MODEL || 'gpt-4o-mini',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    const content = completion?.choices?.[0]?.message?.content ?? null;
    if (content) console.log(chalk.cyan('ChatGPT reply:'), content);
    return content;
  } catch (err) {
    console.error(chalk.red('[ChatGPT]'), err?.message || err);
    return null;
  }
}

const runDefenceReadinessResponseEmails = async () => {
  console.log('Running defence readiness response emails');
  const surveyId = process.env.DEFENCE_READINESS_SURVEY_ID;
  if (!surveyId) return;

  const responses = await prisma.userSurveyResponse.findMany({
    where: {
      surveyId,
      responseConfirmationEmailSentAt: null,
    },
    orderBy: { createdAt: 'asc' },
    take: MAX_PER_RUN,
  });

  console.log(chalk.blue.bgRed.bold(`Found ${responses.length} responses to send emails for`));

  for (const row of responses) {
    const finalObject = buildResponseSummary(row.userResponse);
    console.log(chalk.green('Final object for response', row.id));
    console.log(JSON.stringify(finalObject, null, 2));

    const chatReply = await sendToChatGPT(finalObject);
    if (chatReply) {
      const recipient =
        finalObject.email && String(finalObject.email).trim() && String(finalObject.email).toLowerCase() !== 'anonymous'
          ? String(finalObject.email).trim()
          : null;
      if (recipient) {
        const strippedReply = String(chatReply).replace(/^[\s\n]*```[\w]*\n?/, '').replace(/\n?```[\s\n]*$/, '');
        const emailHtml = strippedReply.trim();
        try {
          await resendEmailDRIndex(
            SENDER_EMAIL,
            recipient,
            'Your Defence Readiness Index – Analysis',
            emailHtml
          );
          await prisma.userSurveyResponse.update({
            where: { id: row.id },
            data: { responseConfirmationEmailSentAt: new Date() },
          });
        } catch (err) {
          console.error(chalk.red('[Email]'), err?.message || err);
        }
      }
    }
  }
};

export { runDefenceReadinessResponseEmails, buildResponseSummary, sendToChatGPT };