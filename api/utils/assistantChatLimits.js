import { prisma } from './prisma.js';
import {
    FREE_ASSISTANT_CHATS_PER_MONTH,
    getUtcMonthRange,
    userHasActiveProSubscription,
} from './planLimits.js';
import { requesterIsSuperAdmin } from './surveyAccess.js';

export async function getAssistantChatUsage(userId, { unlimited = false } = {}) {
    const { start, end } = getUtcMonthRange();
    const resetsAt = end.toISOString();
    if (unlimited) {
        return {
            allowed: true,
            unlimited: true,
            limit: null,
            used: 0,
            remaining: null,
            resetsAt,
        };
    }
    const used = await prisma.assistantChatUsage.count({
        where: {
            userId,
            createdAt: { gte: start, lt: end },
        },
    });
    const remaining = Math.max(0, FREE_ASSISTANT_CHATS_PER_MONTH - used);
    return {
        allowed: remaining > 0,
        unlimited: false,
        limit: FREE_ASSISTANT_CHATS_PER_MONTH,
        used,
        remaining,
        resetsAt,
        periodStart: start.toISOString(),
    };
}

export async function getAssistantChatQuotaForRequester(req) {
    const unlimited = await requesterIsSuperAdmin(req)
        || await userHasActiveProSubscription(prisma, req.tokenId);
    return getAssistantChatUsage(req.tokenId, { unlimited });
}

export async function assertCanUseAssistantChat(req, res) {
    const usage = await getAssistantChatQuotaForRequester(req);
    if (usage.unlimited || usage.remaining > 0) {
        return { ok: true, usage };
    }
    res.status(429).json({
        error: true,
        message: `You have used your ${FREE_ASSISTANT_CHATS_PER_MONTH} DA Assistant chats this month. Upgrade to Premium for unlimited chat.`,
        remaining: 0,
        resetsAt: usage.resetsAt,
    });
    return { ok: false, usage };
}

export async function recordAssistantChatUsage(userId) {
    await prisma.assistantChatUsage.create({
        data: { userId },
    });
}
