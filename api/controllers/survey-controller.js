import { prisma } from '../utils/prisma.js'
import { assertCanCreateSurvey, userHasActiveProSubscription } from '../utils/planLimits.js'
import { requesterIsSuperAdmin, requireSurveyAccess } from '../utils/surveyAccess.js'
import { loadResponsesForExport } from '../utils/surveyExport.js'
import { buildQuestionAnalytics, extractAnswerLabels, findResponseMatch, getAnalyzableQuestions } from '../utils/questionAnalytics.js'
import bcrypt from 'bcrypt';

export const createNewSurvey = async (req, res) => {
    const { surveyTitle } = req.body;
    const userId = req.tokenId;
    console.log(surveyTitle, req.tokenId, 'req.body');
    try {
        const createLimit = await assertCanCreateSurvey(prisma, userId);
        if (!createLimit.ok) {
            return res.status(403).send({ message: createLimit.message });
        }

        const newSurvey = await prisma.survey.create({
            data: {
                surveyTitle,
                surveyDescription: "Test",
                userId,
                surveyStatus: 'Draft',
            }
        });
        res.status(201).send({ message: 'Survey created successfully', newSurvey });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getUserSurvey = async (req, res) => {
    const userId = req.tokenId;
    try {
        const getSurveyAll = await prisma.survey.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                surveyTitle: true,
                surveyStatus: true,
                surveyIntroduction: true,
                createdAt: true,
                updatedAt: true,
                surveyResponses: true,
                userId: true,
                surveyViews: true,
                surveyCompleted: true,
            }
        });
        res.status(200).send(getSurveyAll);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}
export const getSurveyById = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const getSurvey = await prisma.survey.findUnique({
            where: {
                id: surveyId
            }
        });
        if (!getSurvey) {
            return res.status(404).send({ message: 'Survey not found' });
        }
        const { accessPasswordHash, ...rest } = getSurvey;
        res.status(200).json({ ...rest, passwordRequired: Boolean(accessPasswordHash) });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

const parseTimeStringToSeconds = (value = '') => {
    if (!value) return 0;
    const minuteMatch = value.match(/(\d+)\s*m/);
    const secondMatch = value.match(/(\d+)\s*s/);
    const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
    const seconds = secondMatch ? Number(secondMatch[1]) : 0;
    return minutes * 60 + seconds;
};

const formatSecondsToLabel = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
};

export const updateSurveyById = async (req, res) => {
    const surveyId = req.params.surveyId;
    console.log(req.body, 'req.body in update');
    try {
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;

        const data = {
            surveyTitle: req.body.surveyTitle,
            surveyForms: req.body.surveyForms,
            selectedItems: req.body.selectedItems,
            surveyIntroduction: req.body.surveyIntroduction,
            targetCountry: req.body.targetCountry,
            targetCountries: Array.isArray(req.body.targetCountries) ? req.body.targetCountries : [],
            oneResponsePerPerson: Boolean(req.body.oneResponsePerPerson),
            surveyLayout: req.body.surveyLayout === 'onePage' ? 'onePage' : 'oneQuestion',
            hidePoweredBy: false,
        };
        const requesterPro = await userHasActiveProSubscription(prisma, req.tokenId);
        if (requesterPro || await requesterIsSuperAdmin(req)) {
            if (typeof req.body.brandLogoUrl === 'string') {
                data.brandLogoUrl = req.body.brandLogoUrl.trim() || null;
            }
            if (req.body.clearBrandLogo) {
                data.brandLogoUrl = null;
            }
            if (typeof req.body.brandColor === 'string') {
                const color = req.body.brandColor.trim();
                data.brandColor = /^#([0-9a-fA-F]{6})$/.test(color) ? color : null;
            }
            if (req.body.brandColor === '' || req.body.brandColor === null) {
                data.brandColor = null;
            }
            data.hidePoweredBy = Boolean(req.body.hidePoweredBy);
        }
        if (req.body.closesAt === null || req.body.closesAt === '') {
            data.closesAt = null;
        } else if (req.body.closesAt) {
            data.closesAt = new Date(req.body.closesAt);
        }
        if (req.body.maxResponses === null || req.body.maxResponses === '') {
            data.maxResponses = null;
        } else if (req.body.maxResponses != null) {
            const n = parseInt(req.body.maxResponses, 10);
            data.maxResponses = Number.isFinite(n) && n > 0 ? n : null;
        }
        if (req.body.clearAccessPassword) {
            data.accessPasswordHash = null;
        } else if (typeof req.body.accessPassword === 'string' && req.body.accessPassword.trim()) {
            data.accessPasswordHash = await bcrypt.hash(req.body.accessPassword.trim(), 10);
        }

        const updateSurvey = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data,
        });
        console.log(updateSurvey, 'updateSurvey');
        res.status(200).json({ message: 'Survey updated successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getAllSurveyResponse = async (req, res) => {

    const {surveyId,isSubscribed} = req.params;
    
    try {
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const isOwnerPro = String(isSubscribed) === 'true';
        const getAllResponse = await loadResponsesForExport(prisma, surveyId, { isOwnerPro });
        
        res.status(200).send(getAllResponse);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const getSurveyResponsesPaginated = async (req, res) => {
    const { surveyId } = req.params;
    const page = Math.max(parseInt(req.query.page ?? '1', 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit ?? '10', 10) || 10, 1);
    const skip = (page - 1) * limit;

    try {
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const isPro = await userHasActiveProSubscription(prisma, req.tokenId)
            || await requesterIsSuperAdmin(req);
        if (!isPro) {
            return res.status(403).send({ message: 'Individual responses are available on the Premium plan.' });
        }

        const surveyDetails = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { surveyTitle: true, surveyStatus: true }
        });

        if (!surveyDetails) {
            return res.status(404).send({ message: 'Survey not found' });
        }

        const [responses, totalResponses, metaData] = await Promise.all([
            prisma.userSurveyResponse.findMany({
                where: { surveyId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.userSurveyResponse.count({
                where: { surveyId }
            }),
            prisma.userSurveyResponse.findMany({
                where: { surveyId },
                orderBy: { createdAt: 'desc' },
                select: {
                    userEmail: true,
                    userName: true,
                    userTimeSpent: true,
                    createdAt: true
                }
            })
        ]);

        const totalPages = Math.max(1, Math.ceil(totalResponses / limit));
        const totalSeconds = metaData.reduce((sum, item) => sum + parseTimeStringToSeconds(item.userTimeSpent), 0);
        const uniqueParticipants = new Set(
            metaData.map(
                (item) => `${item.userEmail || 'Anonymous'}-${item.userName || 'Anonymous'}`
            )
        ).size;
        const recentSubmissions = metaData.filter(
            (item) => item.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length;

        return res.status(200).json({
            surveyTitle: surveyDetails.surveyTitle,
            surveyStatus: surveyDetails.surveyStatus,
            responses,
            pagination: {
                page,
                limit,
                totalPages,
                totalResponses,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            stats: {
                totalResponses,
                avgTimeSpent: metaData.length ? formatSecondsToLabel(totalSeconds / metaData.length) : '0m 0s',
                uniqueParticipants,
                recentSubmissions,
                lastResponseAt: metaData.length ? metaData[0].createdAt : null
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const getAllSurveyOfOneUser = async (req, res) => {
    try{
        const userId = req.params.userId;
        if (userId !== req.tokenId && !(await requesterIsSuperAdmin(req))) {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        const getAllSurvey = await prisma.survey.findMany({
            where: {
                userId
            },
            select:{
                surveyTitle:true,
                surveyStatus:true,
                surveyIntroduction:true,
                createdAt:true,
                updatedAt:true,
                surveyResponses:true,
                id:true,
                userId:true,
                surveyViews:true,
                surveyCompleted:true,
            }
        });
        res.status(200).send(getAllSurvey);

    }
    catch (err){
        console.log(err);
        res.status(500).send({ message: 'Could not get all surveys of one user' });
    }
}

export const updateUserView = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { surveyStatus: true },
        });
        if (!survey || survey.surveyStatus !== 'Active') {
            return res.status(200).send({ message: 'Survey view not counted' });
        }
        await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyViews: {
                    increment: 1
                }
            }
        });
        res.status(200).send({ message: 'Survey view updated successfully' });

    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}



export const deleteUserSurvey = async (req, res) => {
    const surveyId = req.params.surveyId;
    console.log(surveyId, 'surveyId');
    console.log(req.tokenId,'req.tokenId');
    try{
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;

        const deleteUserResponse = await prisma.userSurveyResponse.deleteMany({
            where:{
                surveyId:surveyId
            }
        });
        const deleteUserSurvey = await prisma.survey.delete({
            where:{
                id:surveyId
            }
        });
        res.status(200).send({message:'Survey deleted successfully'});

    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

export const updateUserStatus = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const allowed = ['Draft', 'Active', 'Disable'];
        if (!allowed.includes(req.body.surveyStatus)) {
            return res.status(400).send({ message: 'Invalid survey status' });
        }
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;

        const updateStatus = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyStatus: req.body.surveyStatus
            }
        });
        res.status(200).send({ message: 'Survey status updated successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const getIpOfSingleSurvey = async (req, res) => {
    const {surveyId} = req.params;
    try{
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const getIpOfOneSurvey = await prisma.userSurveyResponse.findMany({
            where:{
                surveyId,
            },
            select:{
                ipAddress:true
            }
        }); 
        const formatedData = getIpOfOneSurvey.map((data)=>data.ipAddress);
console.log(formatedData,'formatedData');
const sendData = JSON.stringify(formatedData)

        res.status(200).json(sendData);
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

export const cloneUserSurvey = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;

        const source = await prisma.survey.findUnique({ where: { id: surveyId } });
        if (!source) {
            return res.status(404).send({ message: 'Survey not found' });
        }

        const createLimit = await assertCanCreateSurvey(prisma, req.tokenId);
        if (!createLimit.ok) {
            return res.status(403).send({ message: createLimit.message });
        }

        const cloned = await prisma.survey.create({
            data: {
                surveyTitle: `${source.surveyTitle || 'Survey'} (copy)`,
                surveyDescription: source.surveyDescription || 'Test',
                userId: req.tokenId,
                surveyStatus: 'Draft',
                surveyForms: source.surveyForms ?? [],
                selectedItems: source.selectedItems ?? [],
                surveyIntroduction: source.surveyIntroduction,
                formQuestions: source.formQuestions ?? [],
                targetCountry: source.targetCountry,
                targetCountries: source.targetCountries ?? [],
                closesAt: source.closesAt,
                maxResponses: source.maxResponses,
                oneResponsePerPerson: source.oneResponsePerPerson,
                accessPasswordHash: source.accessPasswordHash,
                surveyLayout: source.surveyLayout || 'oneQuestion',
                brandLogoUrl: source.brandLogoUrl,
                brandColor: source.brandColor,
                hidePoweredBy: source.hidePoweredBy,
            },
        });
        const { accessPasswordHash, ...rest } = cloned;
        res.status(201).send({
            message: 'Survey cloned successfully',
            newSurvey: { ...rest, passwordRequired: Boolean(accessPasswordHash) },
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getQuestionAnalytics = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: {
                surveyTitle: true,
                surveyForms: true,
                surveyViews: true,
                surveyResponses: true,
                surveyCompleted: true,
            },
        });
        if (!survey) {
            return res.status(404).send({ message: 'Survey not found' });
        }

        const responses = await prisma.userSurveyResponse.findMany({
            where: { surveyId, isComplete: true },
            select: { userResponse: true },
        });

        const questions = buildQuestionAnalytics(survey.surveyForms, responses);

        const views = survey.surveyViews || 0;
        const completionRate = views > 0
            ? Math.round((survey.surveyResponses / views) * 1000) / 10
            : 0;

        res.status(200).json({
            surveyTitle: survey.surveyTitle,
            totalResponses: responses.length,
            surveyViews: views,
            completionRate,
            questions,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getTrendAnalytics = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const access = await requireSurveyAccess(req, res, surveyId, { allowSuperAdmin: true });
        if (!access) return;

        const isPro = await userHasActiveProSubscription(prisma, req.tokenId)
            || await requesterIsSuperAdmin(req);
        if (!isPro) {
            return res.status(403).send({ message: 'Trends and drop-off are available on the Premium plan.' });
        }

        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { surveyTitle: true, surveyForms: true },
        });
        if (!survey) {
            return res.status(404).send({ message: 'Survey not found' });
        }

        const responses = await prisma.userSurveyResponse.findMany({
            where: { surveyId },
            select: { createdAt: true, isComplete: true, userResponse: true },
        });

        const byDay = {};
        responses.filter((row) => row.isComplete).forEach((row) => {
            const date = row.createdAt.toISOString().slice(0, 10);
            byDay[date] = (byDay[date] || 0) + 1;
        });
        const responsesByDay = Object.entries(byDay)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count }));

        const questions = getAnalyzableQuestions(survey.surveyForms);
        const dropOffRows = [];
        questions.forEach((form, index) => {
            const answered = responses.filter((row) => {
                const match = findResponseMatch(row.userResponse, form);
                return extractAnswerLabels(match?.selectedValue).length > 0;
            }).length;
            const previousAnswered = index === 0 ? responses.length : dropOffRows[index - 1].answered;
            dropOffRows.push({
                id: form.id,
                question: form.question || form.quilText || form.subheading || form.formType,
                answered,
                total: responses.length,
                percent: responses.length ? Math.round((answered / responses.length) * 1000) / 10 : 0,
                dropOffFromPrevious: Math.max(0, previousAnswered - answered),
            });
        });

        res.status(200).json({
            surveyTitle: survey.surveyTitle,
            responsesByDay,
            dropOff: dropOffRows,
            viewsOverTime: { available: false },
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};


