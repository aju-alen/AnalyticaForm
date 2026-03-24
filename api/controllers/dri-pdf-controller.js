import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const prisma = new PrismaClient();
const CHROME_EXECUTABLE_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  process.env.CHROME_PATH ||
  process.env.GOOGLE_CHROME_BIN;

const baseLaunchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];

async function launchPdfBrowser() {
  const baseOptions = {
    headless: true,
    args: baseLaunchArgs,
  };

  // 1) Prefer explicit env path only when it exists.
  if (CHROME_EXECUTABLE_PATH && fs.existsSync(CHROME_EXECUTABLE_PATH)) {
    return puppeteer.launch({
      ...baseOptions,
      executablePath: CHROME_EXECUTABLE_PATH,
    });
  }

  // 2) Try Puppeteer's resolved browser path (from installed cache).
  try {
    const resolvedExecutablePath = puppeteer.executablePath();
    if (resolvedExecutablePath && fs.existsSync(resolvedExecutablePath)) {
      return puppeteer.launch({
        ...baseOptions,
        executablePath: resolvedExecutablePath,
      });
    }
  } catch (_) {
    // Ignore and continue to final fallback.
  }

  // 3) Final fallback: let Puppeteer resolve internally.
  return puppeteer.launch(baseOptions);
}
const interimCategoryNames = [
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

function buildInterimCategoryScoresHtml(report) {
  const categoryRows = interimCategoryNames
    .map((name, idx) => {
      const key = `cat${idx + 1}`;
      const value = report?.[key];
      const scoreText =
        typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(1)}%` : 'N/A';
      return `<tr><td>${name}</td><td>${scoreText}</td></tr>`;
    })
    .join('');

  return `
    <section class="dri-interim-scores">
      <h2>Category scores</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          ${categoryRows}
        </tbody>
      </table>
    </section>
  `;
}

function injectInterimCategoryScores(html, report) {
  const scoreSection = buildInterimCategoryScoresHtml(report);
  const scoreCss = `
    <style id="dri-interim-score-block">
      .dri-interim-scores { margin-top: 18px; border: 1px solid #f2c3c7; border-radius: 10px; padding: 12px; background: #fff; }
      .dri-interim-scores h2 { margin: 0 0 8px; color: #E30613; font-size: 16px; }
      .dri-interim-scores table { width: 100%; border-collapse: collapse; }
      .dri-interim-scores th, .dri-interim-scores td { text-align: left; padding: 6px 4px; border-bottom: 1px solid #eee; font-size: 12px; }
      .dri-interim-scores th { color: #374151; font-weight: 700; }
      .dri-interim-scores td:last-child, .dri-interim-scores th:last-child { text-align: right; font-weight: 700; }
    </style>
  `;

  const withScoreCss = html.includes('</head>')
    ? html.replace('</head>', `${scoreCss}</head>`)
    : `${scoreCss}${html}`;

  if (withScoreCss.includes('</footer>')) {
    return withScoreCss.replace('</footer>', `${scoreSection}</footer>`);
  }
  if (withScoreCss.includes('</body>')) {
    return withScoreCss.replace('</body>', `${scoreSection}</body>`);
  }
  return `${withScoreCss}${scoreSection}`;
}

const pdfFriendlyCss = `
  <style id="dri-pdf-friendly">
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    body {
      background: #ffffff !important;
      color: #1f2937 !important;
      margin: 0 !important;
      padding: 0 !important;
      font-size: 13px !important;
      line-height: 1.35 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .outer {
      background: #ffffff !important;
      padding: 8px !important;
      min-height: auto !important;
    }
    .outer::before {
      content: none !important;
      background: none !important;
      display: none !important;
    }
    .shell {
      max-width: 100% !important;
      border-radius: 10px !important;
      border: 1px solid #e5e7eb !important;
      box-shadow: none !important;
      min-height: calc(297mm - 20mm) !important;
      box-sizing: border-box !important;
    }
    .main {
      padding: 18px 20px !important;
    }
    .brand {
      padding: 16px 20px 6px !important;
    }
    .brand img {
      max-width: 92px !important;
    }
    .footer {
      padding: 12px 18px 14px !important;
      font-size: 11px !important;
      color: #6b7280 !important;
      background: #f9fafb !important;
    }
    h1, h2, h3 {
      line-height: 1.25 !important;
      margin: 0 0 6px !important;
      color: #111827 !important;
    }
    h4, h5, h6 {
      margin: 8px 0 4px !important;
      color: #111827 !important;
    }
    p, li {
      font-size: 12px !important;
      line-height: 1.35 !important;
      margin: 0 0 6px !important;
    }
    ul, ol {
      margin: 0 0 8px 18px !important;
      padding: 0 !important;
    }
    a {
      word-break: break-word !important;
    }
  </style>
`;

export const downloadDriInterimPdf = async (req, res) => {
  const responseId = String(req.params.responseId || '').trim();

  if (!responseId) {
    return res.status(400).json({ message: 'responseId is required' });
  }

  try {
    const payment = await prisma.driInterim10SummaryPayment.findUnique({
      where: { responseId },
      select: { paidStatus: true },
    });

    if (!payment?.paidStatus) {
      return res.status(403).json({ message: 'Interim report is locked until payment is completed' });
    }

    const report = await prisma.driresponseData.findUnique({
      where: { responseId },
      select: {
        htmlContent: true,
        cat1: true,
        cat2: true,
        cat3: true,
        cat4: true,
        cat5: true,
        cat6: true,
        cat7: true,
        cat8: true,
        cat9: true,
        cat10: true,
      },
    });

    if (!report?.htmlContent) {
      return res.status(404).json({ message: 'Interim report HTML content not found' });
    }

    const browser = await launchPdfBrowser();

    try {
      const page = await browser.newPage();
      const interimHtmlWithScores = injectInterimCategoryScores(report.htmlContent, report);
      const htmlWithPdfCss = interimHtmlWithScores.includes('</head>')
        ? interimHtmlWithScores.replace('</head>', `${pdfFriendlyCss}</head>`)
        : `${pdfFriendlyCss}${interimHtmlWithScores}`;

      await page.setContent(htmlWithPdfCss, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('screen');

      const pdfBytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      });

      const pdfBuffer = Buffer.from(pdfBytes);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', String(pdfBuffer.length));
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="dri-interim-report-${responseId}.pdf"`
      );
      return res.status(200).send(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error('[downloadDriInterimPdf]', err?.message || err);
    if (String(err?.message || '').toLowerCase().includes('could not find chrome')) {
      console.error(
        '[downloadDriInterimPdf] Chrome not found. Ensure Puppeteer browser install runs during build, or set PUPPETEER_EXECUTABLE_PATH / CHROME_PATH.'
      );
    }
    return res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

export const downloadDriFullPdf = async (req, res) => {
  const responseId = String(req.params.responseId || '').trim();

  if (!responseId) {
    return res.status(400).json({ message: 'responseId is required' });
  }

  try {
    const payment = await prisma.driFullReportPayment.findUnique({
      where: { responseId },
      select: { paidStatus: true },
    });

    if (!payment?.paidStatus) {
      return res.status(403).json({ message: 'Full report is locked until payment is completed' });
    }

    const report = await prisma.driresponseData.findUnique({
      where: { responseId },
      select: { fullHtmlContent: true },
    });

    if (!report?.fullHtmlContent) {
      return res.status(404).json({ message: 'Full report HTML content not found' });
    }

    const browser = await launchPdfBrowser();

    try {
      const page = await browser.newPage();
      const htmlWithPdfCss = report.fullHtmlContent.includes('</head>')
        ? report.fullHtmlContent.replace('</head>', `${pdfFriendlyCss}</head>`)
        : `${pdfFriendlyCss}${report.fullHtmlContent}`;

      await page.setContent(htmlWithPdfCss, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('screen');

      const pdfBytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      });

      const pdfBuffer = Buffer.from(pdfBytes);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', String(pdfBuffer.length));
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="dri-full-report-${responseId}.pdf"`
      );
      return res.status(200).send(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error('[downloadDriFullPdf]', err?.message || err);
    if (String(err?.message || '').toLowerCase().includes('could not find chrome')) {
      console.error(
        '[downloadDriFullPdf] Chrome not found. Ensure Puppeteer browser install runs during build, or set PUPPETEER_EXECUTABLE_PATH / CHROME_PATH.'
      );
    }
    return res.status(500).json({ message: 'Failed to generate full PDF' });
  }
};
