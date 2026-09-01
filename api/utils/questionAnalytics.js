export const DISPLAY_ONLY_FORM_TYPES = new Set([
    'IntroductionForm',
    'PresentationTextForm',
    'SectionHeadingForm',
    'SectionSubHeadingForm',
    'PdfViewerForm',
]);

export function extractAnswerLabels(selectedValue) {
    if (selectedValue == null) return [];
    const list = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    return list
        .map((entry) => {
            if (entry == null) return '';
            if (typeof entry !== 'object') return String(entry).trim();
            return String(entry.answer ?? entry.value ?? entry.label ?? entry.rowQuestion ?? '').trim();
        })
        .filter(Boolean);
}

export function getAnalyzableQuestions(surveyForms) {
    const forms = Array.isArray(surveyForms) ? surveyForms : [];
    return forms.filter((form) => form && !DISPLAY_ONLY_FORM_TYPES.has(form.formType));
}

export function findResponseMatch(answeredForms, form) {
    const list = Array.isArray(answeredForms) ? answeredForms : [];
    return list.find((item) => item?.id === form.id)
        || list.find((item) => item?.formType === form.formType && item?.question === form.question);
}

export function buildQuestionAnalytics(surveyForms, responses) {
    const questions = getAnalyzableQuestions(surveyForms);
    return questions.map((form) => {
        const counts = {};
        let answered = 0;
        responses.forEach((row) => {
            const match = findResponseMatch(row.userResponse, form);
            const labels = extractAnswerLabels(match?.selectedValue);
            if (labels.length === 0) return;
            answered += 1;
            labels.forEach((label) => {
                counts[label] = (counts[label] || 0) + 1;
            });
        });
        const options = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([label, count]) => ({
                label,
                count,
                percent: responses.length ? Math.round((count / responses.length) * 1000) / 10 : 0,
            }));
        return {
            id: form.id,
            formType: form.formType,
            question: form.question || form.quilText || form.subheading || form.formType,
            answered,
            total: responses.length,
            options,
        };
    });
}
