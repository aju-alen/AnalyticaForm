import { prisma } from './prisma.js';
import { userHasActiveProSubscription } from './planLimits.js';
import { requesterIsSuperAdmin } from './surveyAccess.js';
import { getSurveyClosedReason } from './surveyAvailability.js';

export function getPublicAppUrl() {
    const frontend =
        process.env.STRIPE_FRONTEND_URL ||
        process.env.FRONTEND_URL?.replace(/[\[\]`"']/g, '').split(',')[0] ||
        'http://localhost:5173';
    return String(frontend).includes('http')
        ? String(frontend).replace(/\/$/, '')
        : 'http://localhost:5173';
}

export function getApiPublicUrl() {
    const fromEnv = String(process.env.API_PUBLIC_URL || '').trim().replace(/\/$/, '');
    if (fromEnv) return fromEnv;
    return 'http://localhost:3001';
}

export function normalizeEmail(value) {
    const email = String(value || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
    return email;
}

export function parseEmailList(rawText) {
    const text = String(rawText || '');
    const lines = text.split(/[\n;]+/);
    const found = [];
    const seen = new Set();

    const take = (email, name) => {
        const normalized = normalizeEmail(email);
        if (!normalized || seen.has(normalized)) return;
        seen.add(normalized);
        const trimmedName = String(name || '').trim() || null;
        found.push({ email: normalized, name: trimmedName });
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const angleMatch = trimmed.match(/^(.+?)\s*<([^>]+)>\s*$/);
        if (angleMatch) {
            take(angleMatch[2], angleMatch[1].replace(/^["']|["']$/g, ''));
            continue;
        }
        const emailNameMatch = trimmed.match(/^([^\s@]+@[^\s@]+\.[^\s@]+)\s*,\s*(.+)$/);
        if (emailNameMatch) {
            take(emailNameMatch[1], emailNameMatch[2]);
            continue;
        }
        const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);
        parts.forEach((part) => {
            const nestedAngle = part.match(/^(.+?)\s*<([^>]+)>\s*$/);
            if (nestedAngle) {
                take(nestedAngle[2], nestedAngle[1]);
                return;
            }
            take(part, null);
        });
    }
    return found;
}

export function escapeInviteHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function buildInviteLink(surveyId, token) {
    return `${getPublicAppUrl()}/user-survey/${surveyId}?invite=${encodeURIComponent(token)}`;
}

export function buildUnsubscribeLink(token) {
    return `${getApiPublicUrl()}/api/survey-invites/unsubscribe/${encodeURIComponent(token)}`;
}

export async function assertCanUseInvites(req, res) {
    const isPro = await userHasActiveProSubscription(prisma, req.tokenId);
    if (isPro || await requesterIsSuperAdmin(req)) return true;
    res.status(403).send({ message: 'Email invitations are available on the Premium plan.' });
    return false;
}

export function assertSurveyInvitable(survey, isOwnerPro) {
    return getSurveyClosedReason(survey, { isOwnerPro });
}
