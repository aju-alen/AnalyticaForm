import { FREE_RESPONSE_LIMIT } from './planLimits.js';

export function getSurveyClosedReason(survey, { isOwnerPro = false } = {}) {
    if (!survey) return 'Survey not found.';
    if (survey.surveyStatus === 'Draft') {
        return 'This survey is not published yet.';
    }
    if (survey.surveyStatus !== 'Active') {
        return 'This survey is not active. Please contact the host.';
    }
    if (survey.closesAt && new Date(survey.closesAt).getTime() <= Date.now()) {
        return 'This survey is closed.';
    }
    const authorCap = Number.isFinite(survey.maxResponses) && survey.maxResponses > 0
        ? survey.maxResponses
        : null;
    const freeCap = isOwnerPro ? null : FREE_RESPONSE_LIMIT;
    const caps = [authorCap, freeCap].filter((n) => n != null);
    if (caps.length > 0 && survey.surveyResponses >= Math.min(...caps)) {
        return 'This survey has exceeded its allotted responses. Please contact the host.';
    }
    return null;
}

export function stripSurveySecrets(survey) {
    if (!survey) return survey;
    const { accessPasswordHash, userId, targetCountry, targetCountries, selectedItems, formQuestions, ...rest } = survey;
    return {
        ...rest,
        passwordRequired: Boolean(accessPasswordHash),
    };
}
