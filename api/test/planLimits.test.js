import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FREE_SURVEY_LIMIT, FREE_RESPONSE_LIMIT, userHasActiveProSubscription, assertCanCreateSurvey } from '../utils/planLimits.js';

const futureUnix = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
const pastUnix = Math.floor(Date.now() / 1000) - 60;

function mockPrisma({ surveyCount = 0, subscriptionPeriodEnd = null } = {}) {
    return {
        survey: {
            count: async () => surveyCount,
        },
        proMember: {
            findFirst: async () => (subscriptionPeriodEnd == null ? null : { subscriptionPeriodEnd }),
        },
    };
}

describe('free-tier limits', () => {
    it('caps free accounts at 5 surveys', () => {
        assert.equal(FREE_SURVEY_LIMIT, 5);
        assert.equal(FREE_RESPONSE_LIMIT, 500);
    });

    it('treats a future subscriptionPeriodEnd as active Pro', async () => {
        const prisma = mockPrisma({ subscriptionPeriodEnd: futureUnix });
        assert.equal(await userHasActiveProSubscription(prisma, 'user-1'), true);
    });

    it('treats an expired subscription as not Pro', async () => {
        const prisma = mockPrisma({ subscriptionPeriodEnd: pastUnix });
        assert.equal(await userHasActiveProSubscription(prisma, 'user-1'), false);
    });

    it('blocks a sixth survey for a free user', async () => {
        const prisma = mockPrisma({ surveyCount: 5, subscriptionPeriodEnd: null });
        const result = await assertCanCreateSurvey(prisma, 'user-1');
        assert.equal(result.ok, false);
        assert.match(result.message, /5 surveys/);
    });

    it('allows a sixth survey for an active Pro user', async () => {
        const prisma = mockPrisma({ surveyCount: 5, subscriptionPeriodEnd: futureUnix });
        const result = await assertCanCreateSurvey(prisma, 'user-1');
        assert.equal(result.ok, true);
    });

    it('allows a first survey for a free user', async () => {
        const prisma = mockPrisma({ surveyCount: 0, subscriptionPeriodEnd: null });
        const result = await assertCanCreateSurvey(prisma, 'user-1');
        assert.equal(result.ok, true);
    });
});
