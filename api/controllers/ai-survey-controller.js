import { prisma } from '../utils/prisma.js';
import { requireSurveyAccess, requesterIsSuperAdmin } from '../utils/surveyAccess.js';
import {
    AI_SURVEY_GENERATIONS_PER_MONTH,
    AI_SURVEY_PROMPT_MAX_CHARS,
} from '../utils/planLimits.js';
import {
    assertCanUseAiSurvey,
    countAiSurveyGenerationsThisMonth,
    getAiSurveyUsage,
} from '../utils/aiSurveyLimits.js';
import { parseAndHydrateAiSurvey } from '../utils/aiSurveyForms.js';
import { generateSurveyDraftFromPrompt } from './open-ai-controller.js';

export const getAiSurveyUsageForUser = async (req, res) => {
    try {
        const unlimited = await requesterIsSuperAdmin(req);
        if (!unlimited) {
            return res.status(200).json({
                allowed: false,
                unlimited: false,
                limit: AI_SURVEY_GENERATIONS_PER_MONTH,
                used: 0,
                remaining: 0,
                resetsAt: null,
                message: 'AI survey drafts are currently limited to super admins.',
            });
        }
        const usage = await getAiSurveyUsage(req.tokenId, { unlimited });
        res.status(200).json(usage);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const generateAiSurvey = async (req, res) => {
    const surveyId = req.params.surveyId;
    const prompt = String(req.body?.prompt || '').trim();
    try {
        const surveyAccess = await requireSurveyAccess(req, res, surveyId);
        if (!surveyAccess) return;

        const access = await assertCanUseAiSurvey(req, res);
        if (!access.ok) return;

        if (!prompt) {
            return res.status(400).send({ message: 'Describe the survey you want to create.' });
        }
        if (prompt.length > AI_SURVEY_PROMPT_MAX_CHARS) {
            return res.status(400).send({
                message: `Prompt must be at most ${AI_SURVEY_PROMPT_MAX_CHARS} characters.`,
            });
        }

        if (!access.unlimited) {
            const used = await countAiSurveyGenerationsThisMonth(req.tokenId);
            if (used >= AI_SURVEY_GENERATIONS_PER_MONTH) {
                const usage = await getAiSurveyUsage(req.tokenId);
                return res.status(403).send({
                    message: 'AI survey limit reached for this month.',
                    ...usage,
                });
            }
        }

        let rawText;
        try {
            rawText = await generateSurveyDraftFromPrompt(prompt);
        } catch (err) {
            console.error('AI survey Vertex error', err);
            return res.status(502).send({ message: 'AI draft failed. Your monthly limit was not used.' });
        }

        let draft;
        try {
            draft = parseAndHydrateAiSurvey(rawText);
        } catch (err) {
            return res.status(422).send({
                message: err.message || 'AI did not return a usable survey. Your monthly limit was not used.',
            });
        }

        const updateData = {
            surveyForms: draft.surveyForms,
            selectedItems: draft.selectedItems,
        };
        if (draft.surveyTitle) {
            updateData.surveyTitle = draft.surveyTitle;
        }

        await prisma.$transaction([
            prisma.survey.update({
                where: { id: surveyId },
                data: updateData,
            }),
            prisma.aiSurveyGeneration.create({
                data: {
                    userId: req.tokenId,
                    surveyId,
                    prompt: prompt.slice(0, AI_SURVEY_PROMPT_MAX_CHARS),
                },
            }),
        ]);

        const usage = await getAiSurveyUsage(req.tokenId, { unlimited: access.unlimited });
        const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
        const { accessPasswordHash, ...rest } = survey;
        res.status(200).json({
            survey: { ...rest, passwordRequired: Boolean(accessPasswordHash) },
            usage,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};
