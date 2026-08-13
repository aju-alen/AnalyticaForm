import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getSurveyClosedReason } from '../utils/surveyAvailability.js';

describe('submit / close rules', () => {
    it('blocks draft surveys', () => {
        const reason = getSurveyClosedReason({
            surveyStatus: 'Draft',
            surveyResponses: 0,
        });
        assert.match(reason, /not published/i);
    });

    it('allows an active survey under the free cap', () => {
        const reason = getSurveyClosedReason({
            surveyStatus: 'Active',
            surveyResponses: 10,
            maxResponses: null,
        }, { isOwnerPro: false });
        assert.equal(reason, null);
    });

    it('blocks a free survey at 500 responses', () => {
        const reason = getSurveyClosedReason({
            surveyStatus: 'Active',
            surveyResponses: 500,
        }, { isOwnerPro: false });
        assert.match(reason, /allotted responses/i);
    });

    it('does not apply the free 500 cap for Pro owners', () => {
        const reason = getSurveyClosedReason({
            surveyStatus: 'Active',
            surveyResponses: 500,
        }, { isOwnerPro: true });
        assert.equal(reason, null);
    });

    it('blocks when the author maxResponses cap is reached', () => {
        const reason = getSurveyClosedReason({
            surveyStatus: 'Active',
            surveyResponses: 3,
            maxResponses: 3,
        }, { isOwnerPro: true });
        assert.match(reason, /allotted responses/i);
    });

    it('blocks after closesAt', () => {
        const reason = getSurveyClosedReason({
            surveyStatus: 'Active',
            surveyResponses: 0,
            closesAt: new Date(Date.now() - 1000),
        });
        assert.match(reason, /closed/i);
    });
});
