import { PrismaClient } from '@prisma/client'
import { FREE_SURVEY_LIMIT, userHasActiveProSubscription } from '../utils/planLimits.js'
const prisma = new PrismaClient();

const isTruthyFlag = (value) => value === true || value === 'true';

async function requesterIsSuperAdmin(req) {
    if (isTruthyFlag(req.tokenSuperAdmin)) return true;
    if (req.tokenSuperAdmin === false || req.tokenSuperAdmin === 'false') return false;
    const user = await prisma.user.findUnique({
        where: { id: req.tokenId },
        select: { isSuperAdmin: true },
    });
    return Boolean(user?.isSuperAdmin);
}

async function requireSurveyAccess(req, res, surveyId, { allowSuperAdmin = false } = {}) {
    const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        select: { userId: true },
    });
    if (!survey) {
        res.status(404).send({ message: 'Survey not found' });
        return null;
    }
    if (survey.userId === req.tokenId) return survey;
    if (allowSuperAdmin && await requesterIsSuperAdmin(req)) return survey;
    res.status(403).send({ message: 'Unauthorized' });
    return null;
}

export const createNewSurvey = async (req, res) => {
    const { surveyTitle } = req.body;
    const userId = req.tokenId;
    console.log(surveyTitle, req.tokenId, 'req.body');
    try {
        const surveyCount = await prisma.survey.count({
            where: { userId },
        });
        if (surveyCount >= FREE_SURVEY_LIMIT) {
            const isPro = await userHasActiveProSubscription(prisma, userId);
            if (!isPro) {
                return res.status(403).send({
                    message: 'You can only create 5 surveys with a free account. Please upgrade to premium.',
                });
            }
        }

        const newSurvey = await prisma.survey.create({
            data: {
                surveyTitle,
                surveyDescription: "Test",
                userId,
                surveyStatus: 'Active',
            }
        });
        await prisma.$disconnect();
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
        await prisma.$disconnect();
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
        await prisma.$disconnect();
        res.status(200).json(getSurvey);
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

        const updateSurvey = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyTitle: req.body.surveyTitle,
                surveyForms: req.body.surveyForms,
                selectedItems: req.body.selectedItems,
                surveyIntroduction: req.body.surveyIntroduction,
                targetCountry: req.body.targetCountry,
                targetCountries: Array.isArray(req.body.targetCountries) ? req.body.targetCountries : []
            }
        });
        await prisma.$disconnect();
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

        const getAllResponse = await prisma.userSurveyResponse.findMany({
            where: {
                surveyId
            },
            include: {
                survey: {
                    select: {
                        surveyTitle: true,
                        surveyForms: true,
                    }
                }
            },
            ...(!isSubscribed ? { take: 500 } : {}),
        });
        
        await prisma.$disconnect();
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

        const surveyDetails = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { surveyTitle: true, surveyStatus: true }
        });

        if (!surveyDetails) {
            await prisma.$disconnect();
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

        await prisma.$disconnect();

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
        await prisma.$disconnect();
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
        const updateView = await prisma.survey.update({
            where: {
                id: surveyId
            },
            data: {
                surveyViews: {
                    increment: 1
                }
            }
        });
        await prisma.$disconnect();
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
        await prisma.$disconnect();
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
        await prisma.$disconnect();
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
        await prisma.$disconnect();
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

