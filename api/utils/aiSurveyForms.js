import { ulid } from 'ulid';
import { AI_SURVEY_MAX_QUESTIONS } from './planLimits.js';

export const ALLOWED_AI_FORM_TYPES = new Set([
    'SinglePointForm',
    'SingleCheckForm',
    'SelectDropDownForm',
    'CommentBoxForm',
    'SingleRowTextForm',
    'EmailAddressForm',
    'StarRatingForm',
    'SmileyRatingForm',
    'ThumbUpDownForm',
    'DateTimeForm',
    'PresentationTextForm',
    'SectionHeadingForm',
]);

const SMILEY_COLUMNS = [
    { id: 'a1f4d', value: 'VBad', icon: 'VD' },
    { id: 'a2k9m', value: 'Bad', icon: 'DD' },
    { id: 'a2n3m', value: 'Neutral', icon: 'NN' },
    { id: 'a2ll1', value: 'Good', icon: 'SS' },
    { id: 'a28c0', value: 'Perfect', icon: 'VS' },
];

const THUMB_COLUMNS = [
    { id: 'a1f4d', value: 'Love It', icon: 'LI' },
    { id: 'a2k9m', value: 'Hate It', icon: 'HI' },
];

function newId() {
    return ulid().toLowerCase();
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function quilParagraph(question) {
    return `<p>${escapeHtml(question)}</p>`;
}

function emptySelected() {
    return [{ question: '', answer: '', value: '', index: '' }];
}

function parseModelJson(raw) {
    const text = String(raw || '').trim();
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = (fenced ? fenced[1] : text).trim();
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
        throw new Error('Model did not return JSON.');
    }
    return JSON.parse(candidate.slice(start, end + 1));
}

function choiceValues(choices) {
    const values = (Array.isArray(choices) ? choices : [])
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .slice(0, 12);
    return values.length >= 2 ? values : ['Option 1', 'Option 2'];
}

function hydrateForm(item) {
    const formType = String(item?.formType || '');
    if (!ALLOWED_AI_FORM_TYPES.has(formType)) return null;
    const question = String(item?.question || '').trim();
    if (!question) return null;
    const id = newId();
    const formMandate = Boolean(item?.formMandate);
    const quilText = quilParagraph(question);

    if (formType === 'SinglePointForm') {
        return {
            id,
            question,
            quilText,
            formMandate,
            options: choiceValues(item.choices).map((value) => ({ id: newId(), value })),
            selectedValue: emptySelected(),
            formType,
            hasOtherOption: false,
        };
    }

    if (formType === 'SingleCheckForm') {
        return {
            id,
            question,
            quilText,
            formMandate,
            options: choiceValues(item.choices).map((value) => ({ id: newId(), value, rowQuestion: value })),
            selectedValue: [],
            formType,
            hasOtherOption: false,
        };
    }

    if (formType === 'SelectDropDownForm') {
        return {
            id,
            question,
            quilText,
            formMandate,
            options: choiceValues(item.choices).map((value) => ({ id: newId(), value, rowQuestion: value })),
            selectedValue: emptySelected(),
            formType,
        };
    }

    if (formType === 'CommentBoxForm' || formType === 'SingleRowTextForm' || formType === 'EmailAddressForm') {
        return {
            id,
            question,
            quilText,
            formMandate,
            options: [{ question, id: newId(), value: '' }],
            selectedValue: [{ question, answer: '', value: '', index: '' }],
            formType,
        };
    }

    if (formType === 'StarRatingForm') {
        const optId = '1pgr9';
        return {
            id,
            question,
            quilText,
            formMandate,
            options: [{ id: optId, value: '', question }],
            selectedValue: [{ id: optId, question, answer: '', value: '', index: '' }],
            formType,
        };
    }

    if (formType === 'SmileyRatingForm') {
        const rowId = 'az56j';
        return {
            id,
            question,
            quilText,
            formMandate,
            options: [{
                id: rowId,
                rowQuestion: question,
                columns: SMILEY_COLUMNS.map((col) => ({ ...col })),
            }],
            columnTextField: SMILEY_COLUMNS.map((col) => ({ ...col })),
            selectedValue: [{ id: rowId, question, answer: '', value: '', index: '' }],
            formType,
        };
    }

    if (formType === 'ThumbUpDownForm') {
        const rowId = 'azun9';
        return {
            id,
            question,
            quilText,
            formMandate,
            options: [{
                id: rowId,
                rowQuestion: question,
                columns: THUMB_COLUMNS.map((col) => ({ ...col })),
            }],
            columnTextField: THUMB_COLUMNS.map((col) => ({ ...col })),
            selectedValue: [{ id: rowId, question, answer: '', value: '', index: '' }],
            formType,
        };
    }

    if (formType === 'DateTimeForm') {
        return {
            id,
            question,
            formMandate: false,
            options: [{ id: newId(), value: '', question }],
            selectedValue: emptySelected(),
            formType,
        };
    }

    return {
        id,
        question,
        formMandate: false,
        options: [{ id: newId(), value: '' }],
        selectedValue: emptySelected(),
        formType,
    };
}

export function hydrateAiSurveyDraft(parsed) {
    const surveyTitle = String(parsed?.surveyTitle || '').trim().slice(0, 180);
    const items = Array.isArray(parsed?.questions) ? parsed.questions : [];
    const surveyForms = items
        .map(hydrateForm)
        .filter(Boolean)
        .slice(0, AI_SURVEY_MAX_QUESTIONS);
    if (!surveyForms.length) {
        throw new Error('No supported questions were generated.');
    }
    return {
        surveyTitle,
        surveyForms,
        selectedItems: surveyForms.map((form) => form.formType),
    };
}

export function parseAndHydrateAiSurvey(raw) {
    return hydrateAiSurveyDraft(parseModelJson(raw));
}
