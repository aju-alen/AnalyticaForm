export const FREE_SURVEY_LIMIT = 5;
export const FREE_RESPONSE_LIMIT = 500;
export const INVITE_CONTACT_LIMIT = 2000;
export const INVITE_RECIPIENTS_PER_CAMPAIGN = 200;
export const INVITE_CAMPAIGNS_PER_SURVEY_PER_DAY = 5;
export const INVITE_SENDS_PER_USER_PER_DAY = 500;
export const INVITE_SEND_BATCH = 25;

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
