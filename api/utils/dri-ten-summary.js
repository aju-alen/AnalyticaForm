import { driQuestionMap } from '../config/dri-question.js';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const prisma = new PrismaClient();

const DRI_QUESTION_COUNT = driQuestionMap.length;

/** Only treat payload `id` / `questionId` as a DRI question number when it is a plain integer 1..N (avoids UUIDs). */
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

/** Resolve config row: numeric `id` / `questionId` first, then exact question text, then answer position → question id index+1. */
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

function getAnswerText(selectedValue) {
  if (!Array.isArray(selectedValue) || selectedValue.length === 0) return 'No response';
  return selectedValue
    .map((item) => item?.answer ?? item?.value ?? '')
    .filter(Boolean)
    .join(', ') || 'No response';
}

function getIndexValue(selectedValue) {
  const rawIndex = Array.isArray(selectedValue) ? selectedValue?.[0]?.index : null;
  const num = typeof rawIndex === 'number' ? rawIndex : parseFloat(String(rawIndex));
  return Number.isFinite(num) ? num : null;
}

function getScorePercentFromIndex(indexValue) {
  if (indexValue >= 1 && indexValue <= 4) return indexValue * 25;
  return null;
}

function calculateCategoryScoresAndBand(userResponseArray) {
  const responses = Array.isArray(userResponseArray) ? userResponseArray.slice(0, 10) : [];
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

  const categoryScores = {};
  for (let i = 0; i < 10; i++) {
    const avg = counts[i] > 0 ? totals[i] / counts[i] : null;
    categoryScores[`cat${i + 1}`] =
      typeof avg === 'number' ? Math.round(avg * 100) / 100 : null;
  }

  const populatedScores = Object.values(categoryScores).filter((v) => typeof v === 'number');
  const interimScorePercent =
    populatedScores.length > 0
      ? Math.round((populatedScores.reduce((a, b) => a + b, 0) / populatedScores.length) * 100) / 100
      : 0;

  let bandPositionLabel = 'Band 1';
  if (interimScorePercent >= 80) bandPositionLabel = 'Band 5';
  else if (interimScorePercent >= 60) bandPositionLabel = 'Band 4';
  else if (interimScorePercent >= 40) bandPositionLabel = 'Band 3';
  else if (interimScorePercent >= 20) bandPositionLabel = 'Band 2';

  return { categoryScores, bandPositionLabel };
}

function buildInterimMappedResponses(userResponseArray) {
  const responses = Array.isArray(userResponseArray) ? userResponseArray.slice(0, 10) : [];
  const mapped = [];

  for (let i = 0; i < responses.length; i++) {
    const item = responses[i] || {};
    const questionNumber = i + 1;
    const meta = resolveQuestionMeta(item, i);
    const answerText = getAnswerText(item.selectedValue);

    mapped.push({
      questionNumber,
      questionId: meta?.id ?? questionNumber,
      categoryId: meta?.categoryId ?? null,
      category: meta?.category ?? 'General',
      question: meta?.question ?? item.question ?? `Q${questionNumber}`,
      answer: answerText,
    });
  }

  return mapped;
}

function buildInterimCtaUrl(responseId) {
  const base =
    process.env.DRI_BASE_URL ||
    'http://localhost:5174';

  const cleanBase = String(base || '').replace(/\/$/, '');
  const rid = encodeURIComponent(String(responseId || ''));

  if (cleanBase) return `${cleanBase}/payment-summary/${rid}`;
  return `/payment-summary/${rid}`;
}

const DRI_INTERIM_WATERMARK_LOGO_URL =
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/phdsuccess_logo_page-0001.jpg';
const DRI_INTERIM_FOOTER_ADDRESS =
  'Gate Avenue, Zone D, Level 1, 201, Al Mustaqbal St, Dubai, UAE.';

/** Strip document wrapper if the model returns a full page; keep inner body or fragment. */
function extractInterimBodyFragment(html) {
  const s = String(html || '').trim();
  const bodyMatch = s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  if (/^<!DOCTYPE|^<html[\s>]/i.test(s)) {
    return s
      .replace(/^[\s\S]*?<html[^>]*>/i, '')
      .replace(/<\/html>[\s\S]*$/i, '')
      .replace(/^[\s\S]*?<head>[\s\S]*?<\/head>/i, '')
      .trim();
  }
  return s;
}

/** Full HTML document for email/storage: watermark, content region, branded footer. */
function buildFullInterimHtmlDocument(bodyInnerHtml) {
  const inner = String(bodyInnerHtml || '').trim();
  const logo = DRI_INTERIM_WATERMARK_LOGO_URL.replace(/"/g, '&quot;');
  const footerText = DRI_INTERIM_FOOTER_ADDRESS.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Defense Readiness — Interim summary</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f9; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.55; }
    .outer { min-height: 100vh; padding: 24px 16px; box-sizing: border-box; position: relative; }
    .outer::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: url("${logo}") no-repeat center center;
      background-size: 280px auto;
      opacity: 0.07;
    }
    .shell {
      position: relative;
      z-index: 1;
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid #e8ecf1;
    }
    .main { padding: 20px 32px 20px; }
    .brand {
      text-align: center;
      padding: 24px 32px 8px;
    }
    .brand img {
      max-width: 120px;
      width: 100%;
      height: auto;
      display: inline-block;
    }
    .footer {
      padding: 16px 32px 24px;
      border-top: 1px solid #e8ecf1;
      font-size: 13px;
      color: #5c6570;
      text-align: center;
      background: #fafbfc;
    }
    a { color: #E30613; }
    .main a[style*="background"],
    .main a[style*="background:"] {
      background: #E30613 !important;
      border-color: #E30613 !important;
      color: #ffffff !important;
    }
  </style>
</head>
<body>
  <div class="outer">
    <div class="shell">
      <div class="brand">
        <img src="${logo}" alt="PhD Success logo" />
      </div>
      <div class="main">
${inner}
      </div>
      <footer class="footer">${footerText}</footer>
    </div>
  </div>
</body>
</html>`;
}

async function generateInterimSummaryFromFirstTen(userResponseArray, responseId) {
  const { categoryScores, bandPositionLabel } = calculateCategoryScoresAndBand(userResponseArray);

  try {
    if (responseId) {
      await prisma.driresponseData.upsert({
        where: { responseId: String(responseId) },
        update: {
          ...categoryScores,
          bandPositionLabel,
        },
        create: {
          responseId: String(responseId),
          ...categoryScores,
          bandPositionLabel,
        },
      });
    }
  } catch (err) {
    console.error('[DRI interim scoring] failed to persist:', err?.message || err);
  }

  if (!openai) return null;

  const mappedResponses = buildInterimMappedResponses(userResponseArray);
  if (mappedResponses.length === 0) return null;
  const ctaUrl = buildInterimCtaUrl(responseId);

  const systemPrompt = `You are a PhD defense coach. Generate a personalized Defense Readiness Report for email.

Output requirements:
- Return ONLY HTML body content fragments (use tags like h2, h3, p, ul, li, a, strong, em).
- Do NOT include <!DOCTYPE>, <html>, <head>, <title>, or <body> tags — the server wraps your HTML in a full document template.
- Include the CTA as a button-style anchor element with an href URL (example style: inline-block, padding, rounded corners, background color, white text).
- Never include any numeric score, rating, grade, index, or percentage.`;

  const userPrompt = `
Create an interim DRI summary from Q1-Q10 answers.

Rules:
1) Summarize only Q1-Q10 in plain language.
2) Do NOT show or imply any score.
3) Include:
   - "What this suggests so far" (short paragraph)
   - 3 strengths observed so far (bullet list)
   - 3 focus areas before moving ahead (bullet list)
4) End with a button-style link using this exact anchor text and URL:
   Text: View my interim DRI score (locked)
   URL: ${ctaUrl}
5) Do not add a site footer or watermark; those are added automatically.

Mapped responses JSON:
${JSON.stringify(mappedResponses, null, 2)}
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.DEFENCE_READINESS_CHATGPT_MODEL || 'gpt-4o-mini',
      max_tokens: 900,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    const content = completion?.choices?.[0]?.message?.content ?? '';
    const cleaned = String(content).replace(/^[\s\n]*```[\w]*\n?/, '').replace(/\n?```[\s\n]*$/, '').trim();
    if (!cleaned) return null;

    const fragment = extractInterimBodyFragment(cleaned);
    const fullHtml = buildFullInterimHtmlDocument(fragment);

    if (responseId) {
      try {
        await prisma.driresponseData.update({
          where: { responseId: String(responseId) },
          data: { htmlContent: fullHtml },
        });
      } catch (htmlErr) {
        console.error('[DRI interim htmlContent] failed to persist:', htmlErr?.message || htmlErr);
      }
    }

    return {
      content: fullHtml,
      ctaUrl,
      responseId: responseId || null,
    };
  } catch (err) {
    console.error('[Interim DRI summary]', err?.message || err);
    return null;
  }
}

export { buildInterimMappedResponses, generateInterimSummaryFromFirstTen };
