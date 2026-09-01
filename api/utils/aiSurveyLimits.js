import { prisma } from './prisma.js';
import { AI_SURVEY_GENERATIONS_PER_MONTH, getUtcMonthRange } from './planLimits.js';
import { requesterIsSuperAdmin } from './surveyAccess.js';

export { getUtcMonthRange };

export async function countAiSurveyGenerationsThisMonth(userId, now = new Date()) {
    const { start, end } = getUtcMonthRange(now);
    return prisma.aiSurveyGeneration.count({
        where: {
            userId,
            createdAt: { gte: start, lt: end },
        },
    });
}

export async function assertCanUseAiSurvey(req, res) {
    if (await requesterIsSuperAdmin(req)) return { ok: true, unlimited: true };
    res.status(403).send({ message: 'AI survey drafts are currently limited to super admins.' });
    return { ok: false };
}

export async function getAiSurveyUsage(userId, { unlimited = false } = {}) {
    const { start, end } = getUtcMonthRange();
    if (unlimited) {
        return {
            allowed: true,
            unlimited: true,
            limit: null,
            used: 0,
            remaining: null,
            resetsAt: end.toISOString(),
        };
    }
    const used = await countAiSurveyGenerationsThisMonth(userId);
    const remaining = Math.max(0, AI_SURVEY_GENERATIONS_PER_MONTH - used);
    return {
        allowed: true,
        unlimited: false,
        limit: AI_SURVEY_GENERATIONS_PER_MONTH,
        used,
        remaining,
        resetsAt: end.toISOString(),
        periodStart: start.toISOString(),
    };
}
