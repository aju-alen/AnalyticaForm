export const FREE_SURVEY_LIMIT = 5;
export const FREE_RESPONSE_LIMIT = 500;
export const INVITE_CONTACT_LIMIT = 2000;
export const INVITE_RECIPIENTS_PER_CAMPAIGN = 200;
export const INVITE_CAMPAIGNS_PER_SURVEY_PER_DAY = 5;
export const INVITE_SENDS_PER_USER_PER_DAY = 500;
export const INVITE_SEND_BATCH = 25;
export const AI_SURVEY_GENERATIONS_PER_MONTH = 2;
export const AI_SURVEY_PROMPT_MAX_CHARS = 4000;
export const AI_SURVEY_MAX_QUESTIONS = 25;

export async function userHasActiveProSubscription(prisma, userId) {
    if (!userId) return false;
    const proMember = await prisma.proMember.findFirst({
        where: { userId },
        select: { subscriptionPeriodEnd: true },
    });
    if (!proMember?.subscriptionPeriodEnd) return false;
    const nowUnix = Math.floor(Date.now() / 1000);
    return proMember.subscriptionPeriodEnd > nowUnix;
}

export async function assertCanCreateSurvey(prisma, userId) {
    const surveyCount = await prisma.survey.count({ where: { userId } });
    if (surveyCount < FREE_SURVEY_LIMIT) return { ok: true };
    if (await userHasActiveProSubscription(prisma, userId)) return { ok: true };
    return {
        ok: false,
        message: 'You can only create 5 surveys with a free account. Please upgrade to premium.',
    };
}
