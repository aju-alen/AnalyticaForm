import { resendEmailBoiler } from './resendEmailTemplate.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildZoomInterviewAuthorEmailHtml({
  authorName,
  surveyTitle,
  joinUrl,
  respondentName,
  respondentEmail,
  responseId,
  expiresAt,
}) {
  const respondentLine = [respondentName, respondentEmail].filter(Boolean).join(' · ') || 'Not provided';
  const expiresLine = expiresAt
    ? new Date(expiresAt).toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC'
    : '2 hours from creation';

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px;">
      <p style="margin:0 0 12px;">Hello ${escapeHtml(authorName || 'there')},</p>
      <p style="margin:0 0 12px;">
        A respondent agreed to your interview consent (including AV recording) on
        <strong>${escapeHtml(surveyTitle || 'your survey')}</strong>.
        A unique Zoom meeting was created for this response.
      </p>
      <p style="margin:0 0 8px;"><strong>Respondent:</strong> ${escapeHtml(respondentLine)}</p>
      <p style="margin:0 0 8px;"><strong>Response ID:</strong> ${escapeHtml(responseId || '')}</p>
      <p style="margin:0 0 16px;"><strong>Link expires:</strong> ${escapeHtml(expiresLine)}</p>
      <p style="margin:0 0 12px;">Join URL (you are the host):</p>
      <p style="margin:0 0 20px;">
        <a href="${escapeHtml(joinUrl)}" style="color:#2563eb;word-break:break-all;">${escapeHtml(joinUrl)}</a>
      </p>
      <p style="margin:0;font-size:13px;color:#6b7280;">
        The respondent also received this link on their confirmation screen.
      </p>
    </div>
  `;
}

/**
 * Notify survey author when a Zoom interview link is created after consent.
 */
export async function sendZoomInterviewAuthorEmail({
  authorEmail,
  authorName,
  surveyTitle,
  joinUrl,
  respondentName,
  respondentEmail,
  responseId,
  expiresAt,
}) {
  const to = String(authorEmail || '').trim();
  if (!to || !joinUrl) return;

  const from =
    process.env.GMAIL_AUTH_USER_SUPPORT ||
    process.env.GMAIL_AUTH_USER ||
    process.env.RESEND_EMAILID_PHD_DEFENCE_READINESS;

  const html = buildZoomInterviewAuthorEmailHtml({
    authorName,
    surveyTitle,
    joinUrl,
    respondentName,
    respondentEmail,
    responseId,
    expiresAt,
  });

  await resendEmailBoiler(
    from,
    to,
    `Zoom interview scheduled — ${surveyTitle || 'Survey'}`,
    html
  );
}
