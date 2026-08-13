export const FREE_SURVEY_LIMIT = 5;
export const FREE_RESPONSE_LIMIT = 500;

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
