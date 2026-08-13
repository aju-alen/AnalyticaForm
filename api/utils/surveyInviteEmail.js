import { escapeInviteHtml } from './surveyInvite.js';

export function buildInviteEmailSubject(subject, isReminder) {
    const base = String(subject || '').trim();
    if (!isReminder) return base.slice(0, 120);
    const prefixed = `Reminder: ${base}`;
    return prefixed.slice(0, 120);
}

export function buildInviteEmailHtml({
    surveyTitle,
    authorFirstName,
    message,
    inviteUrl,
    unsubscribeUrl,
    isReminder,
}) {
    const title = escapeInviteHtml(surveyTitle || 'Survey');
    const author = escapeInviteHtml(authorFirstName || 'A Dubai Analytica user');
    const messageHtml = escapeInviteHtml(message || '').replace(/\n/g, '<br/>');
    const invite = escapeInviteHtml(inviteUrl || '');
    const unsub = escapeInviteHtml(unsubscribeUrl || '');
    const reminderLine = isReminder
        ? '<p>This is a reminder to complete the survey.</p>'
        : '';
    const messageBlock = messageHtml
        ? `<p>${messageHtml}</p>`
        : '';

    return `<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;">
  <p>Hello,</p>
  ${reminderLine}
  <p>${author} invited you to take <strong>${title}</strong>.</p>
  ${messageBlock}
  <p style="margin:24px 0;">
    <a href="${invite}" style="display:inline-block;background:#1976d2;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;">
      Take the survey
    </a>
  </p>
  <p>If the button does not work, copy and paste this link into your browser:<br/>
    <a href="${invite}">${invite}</a>
  </p>
  <p style="font-size:13px;color:#6b7280;">
    <a href="${unsub}">Unsubscribe</a>
  </p>
  <p style="font-size:13px;color:#6b7280;">
    You received this because ${author} invited you via Dubai Analytica.
  </p>
</body>
</html>`;
}
