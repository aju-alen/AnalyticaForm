import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import { userHasActiveProSubscription } from '../utils/planLimits.js';
import {
    INVITE_CONTACT_LIMIT,
    INVITE_RECIPIENTS_PER_CAMPAIGN,
    INVITE_CAMPAIGNS_PER_SURVEY_PER_DAY,
    INVITE_SENDS_PER_USER_PER_DAY,
} from '../utils/planLimits.js';
import { requireSurveyAccess } from '../utils/surveyAccess.js';
import {
    assertCanUseInvites,
    assertSurveyInvitable,
    getInviteQuotaForRequester,
    normalizeEmail,
    parseEmailList,
} from '../utils/surveyInvite.js';

function newInviteToken() {
    return crypto.randomBytes(32).toString('hex');
}

export const listContacts = async (req, res) => {
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const contacts = await prisma.surveyContact.findMany({
            where: { userId: req.tokenId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                unsubscribedAt: true,
                createdAt: true,
            },
        });
        res.status(200).json({ contacts });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const createContact = async (req, res) => {
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const email = normalizeEmail(req.body.email);
        if (!email) {
            return res.status(400).send({ message: 'A valid email is required.' });
        }
        const name = typeof req.body.name === 'string' ? req.body.name.trim() || null : null;
        const count = await prisma.surveyContact.count({ where: { userId: req.tokenId } });
        if (count >= INVITE_CONTACT_LIMIT) {
            return res.status(403).send({ message: 'Contact limit reached.' });
        }
        const existing = await prisma.surveyContact.findUnique({
            where: { userId_email: { userId: req.tokenId, email } },
        });
        if (existing) {
            return res.status(409).send({ message: 'That email is already in your contact list.' });
        }
        const contact = await prisma.surveyContact.create({
            data: { userId: req.tokenId, email, name },
            select: { id: true, email: true, name: true, unsubscribedAt: true, createdAt: true },
        });
        res.status(201).json({ contact });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const importContacts = async (req, res) => {
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const parsed = parseEmailList(req.body.rawText);
        const existing = await prisma.surveyContact.findMany({
            where: { userId: req.tokenId },
            select: { email: true },
        });
        const existingSet = new Set(existing.map((row) => row.email));
        let created = 0;
        let skipped = 0;
        const invalid = String(req.body.rawText || '').trim() && parsed.length === 0 ? 1 : 0;
        let remaining = INVITE_CONTACT_LIMIT - existing.length;
        const rawTokens = String(req.body.rawText || '').split(/[\n;,]+/).map((t) => t.trim()).filter(Boolean);
        const invalidCount = Math.max(0, rawTokens.length - parsed.length) + (invalid && parsed.length === 0 ? 0 : 0);

        for (const entry of parsed) {
            if (existingSet.has(entry.email)) {
                skipped += 1;
                continue;
            }
            if (remaining <= 0) {
                skipped += 1;
                continue;
            }
            await prisma.surveyContact.create({
                data: {
                    userId: req.tokenId,
                    email: entry.email,
                    name: entry.name,
                },
            });
            existingSet.add(entry.email);
            created += 1;
            remaining -= 1;
        }
        res.status(200).json({ created, skipped, invalid: invalidCount });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const deleteContact = async (req, res) => {
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const contactId = req.params.contactId;
        const contact = await prisma.surveyContact.findFirst({
            where: { id: contactId, userId: req.tokenId },
        });
        if (!contact) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        await prisma.surveyContact.delete({ where: { id: contactId } });
        res.status(200).send({ message: 'Contact deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const listCampaigns = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { surveyTitle: true, surveyStatus: true },
        });
        const campaigns = await prisma.surveyInviteCampaign.findMany({
            where: { surveyId },
            orderBy: { createdAt: 'desc' },
            include: {
                recipients: {
                    select: { status: true, unsubscribedAt: true },
                },
            },
        });
        const payload = campaigns.map((campaign) => {
            const counts = {
                queued: 0,
                sent: 0,
                failed: 0,
                opened: 0,
                completed: 0,
                unsubscribed: 0,
            };
            campaign.recipients.forEach((row) => {
                if (row.unsubscribedAt) counts.unsubscribed += 1;
                if (counts[row.status] != null) counts[row.status] += 1;
            });
            return {
                id: campaign.id,
                subject: campaign.subject,
                status: campaign.status,
                reminderAfterHours: campaign.reminderAfterHours,
                createdAt: campaign.createdAt,
                counts,
            };
        });
        const inviteQuota = await getInviteQuotaForRequester(req);
        res.status(200).json({
            surveyTitle: survey?.surveyTitle || '',
            surveyStatus: survey?.surveyStatus || '',
            campaigns: payload,
            inviteQuota,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const createCampaign = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;

        const subject = String(req.body.subject || '').trim();
        if (!subject || subject.length > 120) {
            return res.status(400).send({ message: 'Subject is required and must be 120 characters or fewer.' });
        }
        const message = String(req.body.message || '').trim();
        if (message.length > 2000) {
            return res.status(400).send({ message: 'Message must be 2000 characters or fewer.' });
        }

        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: {
                surveyStatus: true,
                surveyResponses: true,
                closesAt: true,
                maxResponses: true,
                userId: true,
            },
        });
        if (!survey) {
            return res.status(404).send({ message: 'Survey not found' });
        }
        const isOwnerPro = await userHasActiveProSubscription(prisma, survey.userId);
        const closedReason = assertSurveyInvitable(survey, isOwnerPro);
        if (closedReason) {
            return res.status(400).send({ message: closedReason });
        }

        const contactIds = Array.isArray(req.body.contactIds) ? req.body.contactIds.filter(Boolean) : [];
        const selectedContacts = contactIds.length
            ? await prisma.surveyContact.findMany({
                where: {
                    userId: req.tokenId,
                    id: { in: contactIds },
                    unsubscribedAt: null,
                },
            })
            : [];

        const extraParsed = parseEmailList(req.body.extraEmails);
        const existingContacts = await prisma.surveyContact.findMany({
            where: { userId: req.tokenId },
            select: { email: true, name: true, unsubscribedAt: true },
        });
        const byEmail = new Map(existingContacts.map((row) => [row.email, row]));
        let contactCount = existingContacts.length;
        const extraRecipients = [];
        for (const entry of extraParsed) {
            const current = byEmail.get(entry.email);
            if (current?.unsubscribedAt) continue;
            if (!current) {
                if (contactCount >= INVITE_CONTACT_LIMIT) continue;
                const created = await prisma.surveyContact.create({
                    data: { userId: req.tokenId, email: entry.email, name: entry.name },
                });
                byEmail.set(entry.email, created);
                contactCount += 1;
                extraRecipients.push({ email: created.email, name: created.name });
            } else {
                extraRecipients.push({ email: current.email, name: entry.name || current.name });
            }
        }

        const merged = new Map();
        selectedContacts.forEach((row) => {
            merged.set(row.email, { email: row.email, name: row.name });
        });
        extraRecipients.forEach((row) => {
            if (!merged.has(row.email)) merged.set(row.email, row);
        });
        const recipients = [...merged.values()];
        if (recipients.length === 0) {
            return res.status(400).send({ message: 'Add at least one recipient.' });
        }
        if (recipients.length > INVITE_RECIPIENTS_PER_CAMPAIGN) {
            return res.status(400).send({ message: 'A campaign can have at most 200 recipients.' });
        }

        const inviteQuota = await getInviteQuotaForRequester(req);
        if (!inviteQuota.unlimited) {
            if (inviteQuota.campaignsRemaining < 1) {
                return res.status(403).send({
                    message: 'Free accounts can send 1 invitation campaign per month. Upgrade to Premium for more.',
                });
            }
            if (recipients.length > inviteQuota.recipientsRemaining) {
                return res.status(403).send({
                    message: inviteQuota.recipientsRemaining === 0
                        ? 'Free accounts can invite 10 people per month. Upgrade to Premium for more.'
                        : `Free accounts can invite 10 people per month. You have ${inviteQuota.recipientsRemaining} left this month.`,
                });
            }
        } else {
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const campaignsToday = await prisma.surveyInviteCampaign.count({
                where: { surveyId, createdAt: { gte: dayAgo } },
            });
            if (campaignsToday >= INVITE_CAMPAIGNS_PER_SURVEY_PER_DAY) {
                return res.status(400).send({ message: 'You can send at most 5 invitation campaigns per survey per day.' });
            }

            const sentToday = await prisma.surveyInviteRecipient.count({
                where: {
                    sentAt: { gte: dayAgo },
                    campaign: { survey: { userId: req.tokenId } },
                },
            });
            if (sentToday + recipients.length > INVITE_SENDS_PER_USER_PER_DAY) {
                return res.status(400).send({ message: 'Daily invitation send limit reached.' });
            }
        }

        const campaign = await prisma.surveyInviteCampaign.create({
            data: {
                surveyId,
                subject,
                message,
                status: 'queued',
                reminderAfterHours: req.body.sendReminder ? 72 : null,
            },
        });
        await prisma.surveyInviteRecipient.createMany({
            data: recipients.map((row) => ({
                campaignId: campaign.id,
                email: row.email,
                name: row.name || null,
                token: newInviteToken(),
                status: 'queued',
            })),
        });
        res.status(201).json({ campaignId: campaign.id, queued: recipients.length });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const listCampaignRecipients = async (req, res) => {
    const { surveyId, campaignId } = req.params;
    try {
        if (!await assertCanUseInvites(req, res)) return;
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;
        const campaign = await prisma.surveyInviteCampaign.findFirst({
            where: { id: campaignId, surveyId },
            select: { id: true },
        });
        if (!campaign) {
            return res.status(404).send({ message: 'Campaign not found' });
        }
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 50));
        const where = { campaignId };
        const total = await prisma.surveyInviteRecipient.count({ where });
        const recipients = await prisma.surveyInviteRecipient.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                sentAt: true,
                openedAt: true,
                completedAt: true,
                unsubscribedAt: true,
            },
        });
        res.status(200).json({
            recipients,
            page,
            pageSize,
            total,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const trackInvite = async (req, res) => {
    try {
        const token = String(req.params.token || '').trim();
        if (!token) return res.status(204).send();
        const recipient = await prisma.surveyInviteRecipient.findUnique({
            where: { token },
            select: { id: true, status: true, unsubscribedAt: true },
        });
        if (!recipient || recipient.unsubscribedAt) {
            return res.status(204).send();
        }
        if (recipient.status === 'sent') {
            await prisma.surveyInviteRecipient.update({
                where: { id: recipient.id },
                data: { status: 'opened', openedAt: new Date() },
            });
        }
        return res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(204).send();
    }
};

export const unsubscribeInvite = async (req, res) => {
    const token = String(req.params.token || '').trim();
    const htmlPage = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body style="font-family:Arial,sans-serif;padding:32px;"><h1>${title}</h1><p>${body}</p></body></html>`;
    try {
        const recipient = await prisma.surveyInviteRecipient.findUnique({
            where: { token },
            include: {
                campaign: {
                    select: {
                        survey: { select: { userId: true } },
                    },
                },
            },
        });
        if (!recipient) {
            res.status(404).type('html').send(htmlPage('Not found', 'This unsubscribe link is not valid.'));
            return;
        }
        const now = new Date();
        await prisma.surveyInviteRecipient.update({
            where: { id: recipient.id },
            data: { unsubscribedAt: recipient.unsubscribedAt || now },
        });
        await prisma.surveyContact.updateMany({
            where: {
                userId: recipient.campaign.survey.userId,
                email: recipient.email,
            },
            data: { unsubscribedAt: now },
        });
        res.status(200).type('html').send(htmlPage('Unsubscribed', 'You will no longer receive invitations for this survey.'));
    } catch (err) {
        console.log(err);
        res.status(500).type('html').send(htmlPage('Error', 'Could not unsubscribe right now.'));
    }
};
