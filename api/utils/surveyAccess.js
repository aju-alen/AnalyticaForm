import { prisma } from './prisma.js';

const isTruthyFlag = (value) => value === true || value === 'true';

export async function requesterIsSuperAdmin(req) {
    if (isTruthyFlag(req.tokenSuperAdmin)) return true;
    if (req.tokenSuperAdmin === false || req.tokenSuperAdmin === 'false') return false;
    const user = await prisma.user.findUnique({
        where: { id: req.tokenId },
        select: { isSuperAdmin: true },
    });
    return Boolean(user?.isSuperAdmin);
}

export async function requireSurveyAccess(req, res, surveyId, { allowSuperAdmin = false } = {}) {
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
