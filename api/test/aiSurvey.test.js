import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hydrateAiSurveyDraft, parseAndHydrateAiSurvey } from '../utils/aiSurveyForms.js';
import { getUtcMonthRange } from '../utils/aiSurveyLimits.js';
import { AI_SURVEY_GENERATIONS_PER_MONTH, AI_SURVEY_MAX_QUESTIONS, AI_SURVEY_PROMPT_MAX_CHARS } from '../utils/planLimits.js';

describe('AI survey limits', () => {
    it('meters two completed drafts per calendar month', () => {
        assert.equal(AI_SURVEY_GENERATIONS_PER_MONTH, 2);
        assert.equal(AI_SURVEY_PROMPT_MAX_CHARS, 4000);
        assert.equal(AI_SURVEY_MAX_QUESTIONS, 25);
    });

    it('uses UTC month bounds', () => {
        const { start, end } = getUtcMonthRange(new Date('2026-08-13T16:00:00.000Z'));
        assert.equal(start.toISOString(), '2026-08-01T00:00:00.000Z');
        assert.equal(end.toISOString(), '2026-09-01T00:00:00.000Z');
    });

    it('rolls the range at UTC year boundary', () => {
        const { start, end } = getUtcMonthRange(new Date('2026-12-31T23:59:59.000Z'));
        assert.equal(start.toISOString(), '2026-12-01T00:00:00.000Z');
        assert.equal(end.toISOString(), '2027-01-01T00:00:00.000Z');
    });
});

describe('AI survey hydrator', () => {
    it('hydrates choice and text questions with ids', () => {
        const draft = hydrateAiSurveyDraft({
            surveyTitle: 'NPS follow-up',
            questions: [
                {
                    formType: 'SinglePointForm',
                    question: 'How did you hear about us?',
                    choices: ['Search', 'Friend'],
                    formMandate: true,
                },
                {
                    formType: 'CommentBoxForm',
                    question: 'Anything else?',
                },
            ],
        });
        assert.equal(draft.surveyTitle, 'NPS follow-up');
        assert.equal(draft.surveyForms.length, 2);
        assert.deepEqual(draft.selectedItems, ['SinglePointForm', 'CommentBoxForm']);
        assert.equal(draft.surveyForms[0].options.length, 2);
        assert.ok(draft.surveyForms[0].id);
        assert.equal(draft.surveyForms[0].formMandate, true);
        assert.match(draft.surveyForms[0].quilText, /How did you hear about us\?/);
        assert.equal(draft.surveyForms[0].hasOtherOption, false);
        assert.deepEqual(draft.surveyForms[0].selectedValue, [{ question: '', answer: '', value: '', index: '' }]);
        assert.equal(draft.surveyForms[1].options.length, 1);
        assert.equal(draft.surveyForms[1].options[0].question, 'Anything else?');
        assert.notEqual(draft.surveyForms[0].id, draft.surveyForms[1].id);
        const optionIds = draft.surveyForms[0].options.map((option) => option.id);
        assert.equal(new Set(optionIds).size, optionIds.length);
    });

    it('parses fenced JSON and skips unsupported types', () => {
        const draft = parseAndHydrateAiSurvey(`\`\`\`json
{"surveyTitle":"Draft","questions":[{"formType":"MapForm","question":"Where?"},{"formType":"StarRatingForm","question":"Rate us"}]}
\`\`\``);
        assert.equal(draft.surveyForms.length, 1);
        assert.equal(draft.surveyForms[0].formType, 'StarRatingForm');
        assert.equal(draft.surveyForms[0].options[0].id, draft.surveyForms[0].selectedValue[0].id);
        assert.equal(draft.surveyForms[0].options[0].question, 'Rate us');
    });

    it('fills two default choices when the model sends too few', () => {
        const draft = hydrateAiSurveyDraft({
            questions: [{ formType: 'SelectDropDownForm', question: 'Pick one', choices: ['Only'] }],
        });
        assert.equal(draft.surveyForms[0].options.length, 2);
        assert.equal(draft.surveyForms[0].options[0].rowQuestion, 'Option 1');
    });

    it('caps at 25 questions', () => {
        const questions = Array.from({ length: 30 }, (_, i) => ({
            formType: 'SingleRowTextForm',
            question: `Q${i + 1}`,
        }));
        const draft = hydrateAiSurveyDraft({ questions });
        assert.equal(draft.surveyForms.length, 25);
    });

    it('rejects empty or unusable model output', () => {
        assert.throws(() => parseAndHydrateAiSurvey('not json'), /JSON/);
        assert.throws(
            () => hydrateAiSurveyDraft({ questions: [{ formType: 'MapForm', question: 'Where?' }] }),
            /No supported questions/,
        );
    });

    it('escapes HTML in quilText', () => {
        const draft = hydrateAiSurveyDraft({
            questions: [{ formType: 'CommentBoxForm', question: 'A <script>alert(1)</script>' }],
        });
        assert.match(draft.surveyForms[0].quilText, /&lt;script&gt;/);
        assert.doesNotMatch(draft.surveyForms[0].quilText, /<script>/);
    });

    it('uses the original checkbox and scale skeletons', () => {
        const draft = hydrateAiSurveyDraft({
            questions: [
                { formType: 'SingleCheckForm', question: 'Pick any', choices: ['A', 'B'] },
                { formType: 'SmileyRatingForm', question: 'How do you feel?' },
                { formType: 'ThumbUpDownForm', question: 'Would you recommend us?' },
                { formType: 'PresentationTextForm', question: 'Please continue' },
            ],
        });
        const [check, smiley, thumbs, heading] = draft.surveyForms;
        assert.deepEqual(check.selectedValue, []);
        assert.equal(check.options[0].rowQuestion, 'A');
        assert.equal(smiley.columnTextField.length, 5);
        assert.equal(smiley.options[0].columns.length, 5);
        assert.equal(smiley.options[0].rowQuestion, 'How do you feel?');
        assert.equal(thumbs.columnTextField.length, 2);
        assert.equal(thumbs.options[0].columns.length, 2);
        assert.equal(thumbs.options[0].id, 'azun9');
        assert.equal(heading.question, 'Please continue');
        assert.equal(heading.quilText, undefined);
    });
});
