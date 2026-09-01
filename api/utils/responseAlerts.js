import { prisma } from './prisma.js';
import { RESPONSE_ALERT_MILESTONES, userHasActiveProSubscription } from './planLimits.js';
import { resendEmailBoiler } from './resendEmailTemplate.js';
import { getPublicAppUrl } from './surveyInvite.js';

function milestoneList(sent) {
    return Array.isArray(sent) ? sent.map(String) : [];
}

function analyticsUrl(surveyId) {
    return `${getPublicAppUrl()}/dashboard/analytics/${surveyId}`;
}

function milestoneEmailHtml({ name, title, count, kind, link }) {
    const closed = kind === 'closed_max' || kind === 'closed_date';
    const reason = kind === 'closed_max'
        ? 'Your survey has reached its maximum number of responses and is no longer collecting answers.'
        : kind === 'closed_date'
            ? 'Your survey close date has been reached and it is no longer collecting answers.'
            : `Your survey has reached ${count} complete responses.`;
    return `
    <html>
    <body>
        <div>
            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Dubai Analytica" style="display:block;margin:auto;width:50%;" />
        </div>
        <div>
            <p>Dear ${name || 'there'},</p>
            <p>${reason}</p>
            <p>Survey: <strong>${title}</strong></p>
            <p>Current complete responses: <strong>${count}</strong></p>
            ${closed ? '<p>Respondents can no longer submit new answers.</p>' : ''}
            <p><a href="${link}">View survey analytics</a></p>
            <p>Thank you for using Dubai Analytica.</p>
        </div>
    </body>
    </html>`;
}

function subjectForKind(kind, title) {
    if (kind === 'closed_max' || kind === 'closed_date') {
        return `Your survey is no longer collecting responses: ${title}`;
    }
    return `Your survey reached ${kind} responses: ${title}`;
}

export async function maybeSendResponseMilestoneEmails(surveyId) {
    const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        select: {
            id: true,
            surveyTitle: true,
            surveyResponses: true,
            maxResponses: true,
            closesAt: true,
            alertMilestonesSent: true,
            userId: true,
            user: {
                select: { firstName: true, email: true },
            },
        },
    });
    if (!survey?.user?.email) return;

    const isPro = await userHasActiveProSubscription(prisma, survey.userId);
    const sent = milestoneList(survey.alertMilestonesSent);
    const keysToAdd = [];
    const count = survey.surveyResponses || 0;
    const milestones = isPro ? RESPONSE_ALERT_MILESTONES : [10];

    for (const n of milestones) {
        const key = String(n);
        if (count >= n && !sent.includes(key)) {
            keysToAdd.push(key);
        }
    }

    if (isPro) {
        if (Number.isFinite(survey.maxResponses) && survey.maxResponses > 0
            && count >= survey.maxResponses && !sent.includes('closed_max')) {
            keysToAdd.push('closed_max');
        }
        if (survey.closesAt && new Date(survey.closesAt).getTime() <= Date.now()
            && !sent.includes('closed_date')) {
            keysToAdd.push('closed_date');
        }
    }

    if (keysToAdd.length === 0) return;

    const link = analyticsUrl(survey.id);
    const name = survey.user.firstName;
    const title = survey.surveyTitle || 'Survey';

    for (const kind of keysToAdd) {
        const html = milestoneEmailHtml({ name, title, count, kind, link });
        await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            survey.user.email,
            subjectForKind(kind, title),
            html,
        );
    }

    await prisma.survey.update({
        where: { id: surveyId },
        data: { alertMilestonesSent: [...sent, ...keysToAdd] },
    });
}
