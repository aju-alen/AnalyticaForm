import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { requireSurveyAccess } from '../utils/surveyAccess.js';

function mockRes() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        send(payload) {
            this.body = payload;
            return this;
        },
    };
}

function mockPrisma({ survey = null, isSuperAdmin = false } = {}) {
    return {
        survey: {
            findUnique: async () => survey,
        },
        user: {
            findUnique: async () => ({ isSuperAdmin }),
        },
    };
}

describe('survey ownership', () => {
    it('returns 404 when the survey does not exist', async () => {
        const res = mockRes();
        const result = await requireSurveyAccess(
            { tokenId: 'owner-1' },
            res,
            'missing',
            { db: mockPrisma({ survey: null }) },
        );
        assert.equal(result, null);
        assert.equal(res.statusCode, 404);
    });

    it('allows the owner', async () => {
        const res = mockRes();
        const survey = { userId: 'owner-1' };
        const result = await requireSurveyAccess(
            { tokenId: 'owner-1' },
            res,
            'survey-1',
            { db: mockPrisma({ survey }) },
        );
        assert.equal(result, survey);
        assert.equal(res.statusCode, 200);
    });

    it('rejects a non-owner', async () => {
        const res = mockRes();
        const result = await requireSurveyAccess(
            { tokenId: 'intruder' },
            res,
            'survey-1',
            { db: mockPrisma({ survey: { userId: 'owner-1' } }) },
        );
        assert.equal(result, null);
        assert.equal(res.statusCode, 403);
        assert.equal(res.body.message, 'Unauthorized');
    });

    it('allows a super-admin when that flag is on', async () => {
        const res = mockRes();
        const survey = { userId: 'owner-1' };
        const result = await requireSurveyAccess(
            { tokenId: 'admin-1', tokenSuperAdmin: true },
            res,
            'survey-1',
            { allowSuperAdmin: true, db: mockPrisma({ survey }) },
        );
        assert.equal(result, survey);
    });
});
