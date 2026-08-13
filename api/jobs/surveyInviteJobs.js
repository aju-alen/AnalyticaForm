import { prisma } from '../utils/prisma.js';
import { userHasActiveProSubscription } from '../utils/planLimits.js';
import { INVITE_SEND_BATCH, INVITE_SENDS_PER_USER_PER_DAY } from '../utils/planLimits.js';
import { getSurveyClosedReason } from '../utils/surveyAvailability.js';
import { buildInviteLink, buildUnsubscribeLink } from '../utils/surveyInvite.js';
import { buildInviteEmailHtml, buildInviteEmailSubject } from '../utils/surveyInviteEmail.js';
import { resendEmailBoiler } from '../utils/resendEmailTemplate.js';

async function refreshCampaignStatus(campaignId) {
    const remaining = await prisma.surveyInviteRecipient.count({
        where: { campaignId, status: 'queued' },
    });
    await prisma.surveyInviteCampaign.update({
        where: { id: campaignId },
        data: { status: remaining === 0 ? 'sent' : 'sending' },
    });
}

export async function runSurveyInviteSends() {
    const queued = await prisma.surveyInviteRecipient.findMany({
        where: { status: 'queued' },
        orderBy: { createdAt: 'asc' },
        take: INVITE_SEND_BATCH,
        include: {
            campaign: {
                include: {
                    survey: {
                        select: {
                            id: true,
                            surveyTitle: true,
                            surveyStatus: true,
                            surveyResponses: true,
                            closesAt: true,
                            maxResponses: true,
                            userId: true,
                            user: { select: { firstName: true } },
                        },
                    },
                },
            },
        },
    });

    const touchedCampaigns = new Set();

    for (const recipient of queued) {
        touchedCampaigns.add(recipient.campaignId);
        if (recipient.unsubscribedAt) {
            await prisma.surveyInviteRecipient.update({
                where: { id: recipient.id },
                data: { status: 'failed', errorMessage: 'Unsubscribed' },
            });
            continue;
        }
        const survey = recipient.campaign.survey;
        const isOwnerPro = await userHasActiveProSubscription(prisma, survey.userId);
        const closedReason = getSurveyClosedReason(survey, { isOwnerPro });
        if (closedReason) {
            await prisma.surveyInviteRecipient.update({
                where: { id: recipient.id },
                data: { status: 'failed', errorMessage: 'Survey unavailable' },
            });
            continue;
        }
        const inviteUrl = buildInviteLink(survey.id, recipient.token);
        const unsubscribeUrl = buildUnsubscribeLink(recipient.token);
        const html = buildInviteEmailHtml({
            surveyTitle: survey.surveyTitle,
            authorFirstName: survey.user?.firstName,
            message: recipient.campaign.message,
            inviteUrl,
            unsubscribeUrl,
            isReminder: false,
        });
        const subject = buildInviteEmailSubject(recipient.campaign.subject, false);
        try {
            await resendEmailBoiler(
                process.env.GMAIL_AUTH_USER_SUPPORT,
                recipient.email,
                subject,
                html,
            );
            await prisma.surveyInviteRecipient.update({
                where: { id: recipient.id },
                data: { status: 'sent', sentAt: new Date(), errorMessage: null },
            });
        } catch (err) {
            const message = String(err?.message || 'Send failed').slice(0, 191);
            await prisma.surveyInviteRecipient.update({
                where: { id: recipient.id },
                data: { status: 'failed', errorMessage: message },
            });
        }
    }

    for (const campaignId of touchedCampaigns) {
        await refreshCampaignStatus(campaignId);
    }
}

export async function runSurveyInviteReminders() {
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const candidates = await prisma.surveyInviteRecipient.findMany({
        where: {
            remindedAt: null,
            unsubscribedAt: null,
            status: { in: ['sent', 'opened'] },
            sentAt: { not: null },
            campaign: { reminderAfterHours: { not: null } },
        },
        orderBy: { sentAt: 'asc' },
        take: 100,
        include: {
            campaign: {
                include: {
                    survey: {
                        select: {
                            id: true,
                            surveyTitle: true,
                            surveyStatus: true,
                            surveyResponses: true,
                            closesAt: true,
                            maxResponses: true,
                            userId: true,
                            user: { select: { firstName: true } },
                        },
                    },
                },
            },
        },
    });

    let sentThisTick = 0;
    for (const recipient of candidates) {
        if (sentThisTick >= INVITE_SEND_BATCH) break;
        const hours = recipient.campaign.reminderAfterHours;
        if (!hours || !recipient.sentAt) continue;
        if (recipient.sentAt.getTime() + hours * 60 * 60 * 1000 > now) continue;

        const sentToday = await prisma.surveyInviteRecipient.count({
            where: {
                OR: [
                    { sentAt: { gte: dayAgo } },
                    { remindedAt: { gte: dayAgo } },
                ],
                campaign: { survey: { userId: recipient.campaign.survey.userId } },
            },
        });
        if (sentToday >= INVITE_SENDS_PER_USER_PER_DAY) continue;

        const survey = recipient.campaign.survey;
        const isOwnerPro = await userHasActiveProSubscription(prisma, survey.userId);
        const closedReason = getSurveyClosedReason(survey, { isOwnerPro });
        if (closedReason) continue;

        const inviteUrl = buildInviteLink(survey.id, recipient.token);
        const unsubscribeUrl = buildUnsubscribeLink(recipient.token);
        const html = buildInviteEmailHtml({
            surveyTitle: survey.surveyTitle,
            authorFirstName: survey.user?.firstName,
            message: recipient.campaign.message,
            inviteUrl,
            unsubscribeUrl,
            isReminder: true,
        });
        const subject = buildInviteEmailSubject(recipient.campaign.subject, true);
        try {
            await resendEmailBoiler(
                process.env.GMAIL_AUTH_USER_SUPPORT,
                recipient.email,
                subject,
                html,
            );
            await prisma.surveyInviteRecipient.update({
                where: { id: recipient.id },
                data: { remindedAt: new Date() },
            });
            sentThisTick += 1;
        } catch (err) {
            console.error('[survey invite reminder]', err?.message || err);
        }
    }
}
