import { driQuestionMap } from '../config/dri-question.js';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const prisma = new PrismaClient();
const DRI_QUESTION_COUNT = driQuestionMap.length;

function parseDriQuestionId(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isInteger(raw)) {
    return raw >= 1 && raw <= DRI_QUESTION_COUNT ? raw : null;
  }
  const s = String(raw).trim();
  if (!/^\d+$/.test(s)) return null;
  const n = parseInt(s, 10);
  return n >= 1 && n <= DRI_QUESTION_COUNT ? n : null;
}

function resolveQuestionMeta(item, index) {
  const parsedId = parseDriQuestionId(item?.id ?? item?.questionId);
  if (parsedId != null) {
    const byId = driQuestionMap.find((q) => q.id === parsedId);
    if (byId) return byId;
  }
  const text = String(item?.question || '').trim();
  if (text) {
    const byText = driQuestionMap.find((q) => String(q.question).trim() === text);
    if (byText) return byText;
  }
  const fallbackId = index + 1;
  if (fallbackId >= 1 && fallbackId <= DRI_QUESTION_COUNT) {
    return driQuestionMap.find((q) => q.id === fallbackId) || null;
  }
  return null;
}

function getIndexValue(selectedValue) {
  const rawIndex = Array.isArray(selectedValue) ? selectedValue?.[0]?.index : null;
  const num = typeof rawIndex === 'number' ? rawIndex : parseFloat(String(rawIndex));
  return Number.isFinite(num) ? num : null;
}

function getAnswerText(selectedValue) {
  if (!Array.isArray(selectedValue) || selectedValue.length === 0) return 'No response';
  return selectedValue
    .map((item) => item?.answer ?? item?.value ?? '')
    .filter(Boolean)
    .join(', ') || 'No response';
}

function getScorePercentFromIndex(indexValue) {
  if (indexValue >= 1 && indexValue <= 4) return indexValue * 25;
  return null;
}

function calculateCategoryScoresFromAllResponses(userResponseArray) {
  const responses = Array.isArray(userResponseArray) ? userResponseArray.slice(0, 50) : [];
  const totals = Array(10).fill(0);
  const counts = Array(10).fill(0);

  for (let i = 0; i < responses.length; i++) {
    const item = responses[i] || {};
    const meta = resolveQuestionMeta(item, i);
    if (!meta || typeof meta.categoryId !== 'number') continue;
    const categoryIdx = meta.categoryId - 1;
    if (categoryIdx < 0 || categoryIdx > 9) continue;

    const indexValue = getIndexValue(item?.selectedValue);
    if (typeof indexValue !== 'number') continue;
    const scorePercent = getScorePercentFromIndex(indexValue);
    if (typeof scorePercent !== 'number') continue;

    totals[categoryIdx] += scorePercent;
    counts[categoryIdx] += 1;
  }

  const fullCategoryScores = {};
  for (let i = 0; i < 10; i++) {
    const avg = counts[i] > 0 ? totals[i] / counts[i] : null;
    fullCategoryScores[`fullCat${i + 1}`] =
      typeof avg === 'number' ? Math.round(avg * 100) / 100 : null;
  }

  const populatedScores = Object.values(fullCategoryScores).filter((v) => typeof v === 'number');
  const fullScorePercent =
    populatedScores.length > 0
      ? Math.round((populatedScores.reduce((a, b) => a + b, 0) / populatedScores.length) * 100) / 100
      : 0;

  let fullBandPositionLabel = 'Band 1';
  if (fullScorePercent >= 80) fullBandPositionLabel = 'Band 5';
  else if (fullScorePercent >= 60) fullBandPositionLabel = 'Band 4';
  else if (fullScorePercent >= 40) fullBandPositionLabel = 'Band 3';
  else if (fullScorePercent >= 20) fullBandPositionLabel = 'Band 2';

  return { fullCategoryScores, fullBandPositionLabel, fullScorePercent };
}

function buildMappedResponses(userResponseArray) {
  const responses = Array.isArray(userResponseArray) ? userResponseArray.slice(0, 50) : [];
  const mapped = [];
  for (let i = 0; i < responses.length; i++) {
    const item = responses[i] || {};
    const questionNumber = i + 1;
    const meta = resolveQuestionMeta(item, i);
    mapped.push({
      questionNumber,
      questionId: meta?.id ?? questionNumber,
      categoryId: meta?.categoryId ?? null,
      category: meta?.category ?? 'General',
      question: meta?.question ?? item.question ?? `Q${questionNumber}`,
      answer: getAnswerText(item?.selectedValue),
    });
  }
  return mapped;
}

function buildFullCtaUrl(responseId) {
  const base = process.env.DRI_BASE_URL || 'http://localhost:5174';
  const cleanBase = String(base || '').replace(/\/$/, '');
  const rid = encodeURIComponent(String(responseId || ''));
  if (cleanBase) return `${cleanBase}/full-payment-summary/${rid}`;
  return `/full-payment-summary/${rid}`;
}

function extractBodyFragment(html) {
  const s = String(html || '').trim();
  const bodyMatch = s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  return s;
}

function buildFullHtmlDocument(bodyInnerHtml) {
  const inner = String(bodyInnerHtml || '').trim();
  const logo = 'https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/phdsuccess_logo_page-0001.jpg';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Defense Readiness — Full Report</title>
  <style>
    body { margin: 0; padding: 0; background: #ffffff; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.55; }
    .outer { min-height: 100vh; padding: 24px 16px; box-sizing: border-box; position: relative; }
    .outer::before { content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none; background: url("${logo}") no-repeat center center; background-size: 280px auto; opacity: 0.06; }
    .shell { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #f2c3c7; }
    .main { padding: 20px 32px 24px; }
    .brand { text-align: center; padding: 24px 32px 8px; }
    .brand img { max-width: 120px; width: 100%; height: auto; display: inline-block; }
    .main h1, .main h2, .main h3, .main h4, .main h5, .main h6 { color: #e30613; }
    .main strong { color: #e30613; }
    .main a { color: #e30613; }
  </style>
</head>
<body>
  <div class="outer">
    <div class="shell">
      <div class="brand"><img src="${logo}" alt="PhD Success logo" /></div>
      <div class="main">${inner}</div>
    </div>
  </div>
</body>
</html>`;
}

export async function generateFullSummaryFromFifty(userResponseArray, responseId) {
  const { fullCategoryScores, fullBandPositionLabel, fullScorePercent } =
    calculateCategoryScoresFromAllResponses(userResponseArray);

  try {
    if (responseId) {
      await prisma.driresponseData.upsert({
        where: { responseId: String(responseId) },
        update: { ...fullCategoryScores, fullBandPositionLabel, fullScorePercent },
        create: { responseId: String(responseId), ...fullCategoryScores, fullBandPositionLabel, fullScorePercent, bandPositionLabel: 'Band 1' },
      });
    }
  } catch (err) {
    console.error('[DRI full scoring] persist failed:', err?.message || err);
  }

  if (!openai) return null;
  const mappedResponses = buildMappedResponses(userResponseArray);
  if (mappedResponses.length === 0) return null;
  const ctaUrl = buildFullCtaUrl(responseId);

  const systemPrompt = `You are a PhD defense coach. Return HTML only (no markdown) for a full DRI 50-question report. Use a white background with #E30613 as the primary accent color in headings, emphasis, and callouts.`;
  const userPrompt = `Create a concise full DRI report from 50 mapped responses.
Include:
- Headline and one-paragraph interpretation.
- 10 category insights (one short block each).
- 6 practical next actions.
- Full score + readiness band
- Additional metrics (category breakdowns, strengths, vulnerabilities)
- Use #E30613 as the primary accent color in the returned HTML.
- In the end of the content, I need a CTA asking users to Book a session with Dr. Michael (Google Meet scheduling) and the url is https://scheduler.phdsuccess.ae/



Computed overall score (0-100): ${fullScorePercent}
Band: ${fullBandPositionLabel}

Mapped responses:
${JSON.stringify(mappedResponses, null, 2)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.DEFENCE_READINESS_CHATGPT_MODEL || 'gpt-4o-mini',
      max_tokens: 2400,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    const content = completion?.choices?.[0]?.message?.content ?? '';
    const cleaned = String(content).replace(/^[\s\n]*```[\w]*\n?/, '').replace(/\n?```[\s\n]*$/, '').trim();
    if (!cleaned) return null;
    const fullHtml = buildFullHtmlDocument(extractBodyFragment(cleaned));

    if (responseId) {
      try {
        await prisma.driresponseData.update({
          where: { responseId: String(responseId) },
          data: { fullHtmlContent: fullHtml },
        });
      } catch (htmlErr) {
        console.error('[DRI full htmlContent] persist failed:', htmlErr?.message || htmlErr);
      }
    }

    return { content: fullHtml, responseId: responseId || null, ctaUrl };
  } catch (err) {
    console.error('[DRI full summary]', err?.message || err);
    return null;
  }
}
