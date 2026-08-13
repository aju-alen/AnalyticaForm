import { prisma } from '../utils/prisma.js'
import { updateUserResponseLimit } from './auth-controllers.js';
import { generateIpAddressesForCountry } from '../utils/ipGenerator.js';
import { generateInterimSummaryFromFirstTen } from '../utils/dri-ten-summary.js';
import { resendEmailDRIndex } from '../utils/resendEmailTemplate.js';
import { sendZoomInterviewAuthorEmail } from '../utils/zoomInterviewAuthorEmail.js';
import { generateFullSummaryFromFifty } from '../utils/dri-50-summary.js';
import { shouldCreateZoomForResponse } from '../utils/consentProgress.js';
import { createZoomMeetingForHost, getValidZoomAccessToken } from '../utils/zoomApi.js';
import { FREE_RESPONSE_LIMIT, userHasActiveProSubscription } from '../utils/planLimits.js';
import { getSurveyClosedReason } from '../utils/surveyAvailability.js';
import bcrypt from 'bcrypt';

async function surveyHasReachedFreeResponseLimit(survey) {
    if (!survey || survey.surveyResponses < FREE_RESPONSE_LIMIT) return false;
    return !(await userHasActiveProSubscription(prisma, survey.userId));
}

function surveyResponseCookieName(surveyId) {
    return `da_survey_${surveyId}`;
}

function surveyCookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        path: '/',
    };
}

const SUPPORTED_COUNTRY_CODES = new Set(['AE', 'SA', 'CN', 'UK', 'US', 'QA', 'IN']);

function resolveTargetCountryCodes(survey) {
    const fromArray = Array.isArray(survey.targetCountries)
        ? survey.targetCountries.filter((c) => SUPPORTED_COUNTRY_CODES.has(c))
        : [];
    if (fromArray.length > 0) return fromArray;

    const legacy = survey.targetCountry;
    if (legacy && legacy !== 'NIL' && legacy !== 'MULTI' && SUPPORTED_COUNTRY_CODES.has(legacy)) {
        return [legacy];
    }
    return [];
}

function pickRandomCountryCode(codes) {
    return codes[Math.floor(Math.random() * codes.length)];
}

export const getSingleSurveyDataForUser = async (req, res) => {
    const surveyId = req.params.surveyId;
    try{
        const getSurveyData = await prisma.survey.findUnique({
            where:{
                id:surveyId
            },
            select: {
                id: true,
                surveyTitle: true,
                surveyDescription: true,
                surveyStatus: true,
                surveyForms: true,
                surveyIntroduction: true,
                surveyResponses: true,
                userId: true,
                closesAt: true,
                maxResponses: true,
                accessPasswordHash: true,
                oneResponsePerPerson: true,
            },
        });
        if (!getSurveyData) {
            return res.status(404).send({ message: 'Survey not found' });
        }
        const isOwnerPro = await userHasActiveProSubscription(prisma, getSurveyData.userId);
        const closedReason = getSurveyClosedReason(getSurveyData, { isOwnerPro });
        const passwordRequired = Boolean(getSurveyData.accessPasswordHash);
        const providedPassword = String(req.headers['x-survey-password'] || req.query.accessPassword || '').trim();
        let passwordOk = !passwordRequired;
        if (passwordRequired && providedPassword) {
            passwordOk = await bcrypt.compare(providedPassword, getSurveyData.accessPasswordHash);
        }

        let alreadyResponded = false;
        const cookieId = req.cookies?.[surveyResponseCookieName(surveyId)];
        if (getSurveyData.oneResponsePerPerson && cookieId) {
            const existing = await prisma.userSurveyResponse.findFirst({
                where: { id: String(cookieId), surveyId },
                select: { isComplete: true },
            });
            alreadyResponded = Boolean(existing?.isComplete);
        }

        const publicSurvey = {
            id: getSurveyData.id,
            surveyTitle: getSurveyData.surveyTitle,
            surveyDescription: getSurveyData.surveyDescription,
            surveyStatus: getSurveyData.surveyStatus,
            surveyIntroduction: getSurveyData.surveyIntroduction,
            surveyResponses: getSurveyData.surveyResponses,
            responseLimitReached: Boolean(closedReason && /allotted responses/i.test(closedReason)),
            isClosed: Boolean(closedReason),
            closedReason,
            passwordRequired,
            oneResponsePerPerson: getSurveyData.oneResponsePerPerson,
            closesAt: getSurveyData.closesAt,
            maxResponses: getSurveyData.maxResponses,
            alreadyResponded,
            surveyForms: (!closedReason && passwordOk && !alreadyResponded) ? getSurveyData.surveyForms : [],
        };
        res.status(200).json(publicSurvey);
    }catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

export const postSingleSurveyDataForUser = async (req, res) => {
    console.log("-----------------",req.body, '--------req.body in postSingleSurveyDataForUser');

    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const surveyId = req.params.surveyId;
    if(req.body.userName === ''){
        req.body.userName = undefined;
    }
    if(req.body.userEmail === ''){
        req.body.userEmail = undefined;
    }
    console.log(req.body.targetCountry, 'req.body.targetCountry in postSingleSurveyDataForUser');
    
   
    try{
        const getCountryDataFromSurvey = await prisma.survey.findUnique({
            where:{
                id:surveyId
            },
            select:{
                targetCountry: true,
                targetCountries: true,
            }
        });
        if (!getCountryDataFromSurvey) {
            return res.status(404).send({ message: 'Survey not found' });
        }
        let ipAddress;
        const targetCodes = resolveTargetCountryCodes(getCountryDataFromSurvey);

        if (targetCodes.length === 0) {
            ipAddress = userIP.split(',')[0];
        } else {
            const chosenCountry = pickRandomCountryCode(targetCodes);
            ipAddress = generateIpAddressesForCountry(chosenCountry, 1);
            console.log(chosenCountry, targetCodes, 'chosenCountry and targetCodes in postSingleSurveyDataForUser');
        }
        console.log(ipAddress, 'ipAddress in postSingleSurveyDataForUser');

        const surveyMeta = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: {
                surveyTitle: true,
                surveyForms: true,
                userId: true,
                surveyResponses: true,
                surveyStatus: true,
                closesAt: true,
                maxResponses: true,
                accessPasswordHash: true,
                oneResponsePerPerson: true,
            },
        });
        if (!surveyMeta) {
            return res.status(404).send({ message: 'Survey not found' });
        }

        if (req.body.preview === true || req.body.preview === 'true' || req.query.preview === '1') {
            return res.status(403).send({ message: 'Preview responses are not saved.' });
        }

        const isComplete = req.body.isComplete !== false && req.body.isComplete !== 'false';

        if (surveyMeta.accessPasswordHash) {
            const providedPassword = String(req.body.accessPassword || req.headers['x-survey-password'] || '').trim();
            const passwordOk = providedPassword
                ? await bcrypt.compare(providedPassword, surveyMeta.accessPasswordHash)
                : false;
            if (!passwordOk) {
                return res.status(403).send({ message: 'A valid survey password is required.' });
            }
        }

        const requestedResponseId = String(req.body.responseId || '').trim();
        const cookieName = surveyResponseCookieName(surveyId);
        let existingResponse = null;
        if (requestedResponseId) {
            existingResponse = await prisma.userSurveyResponse.findFirst({
                where: {
                    id: requestedResponseId,
                    surveyId,
                },
            });
        }
        if (!existingResponse && req.cookies?.[cookieName]) {
            existingResponse = await prisma.userSurveyResponse.findFirst({
                where: {
                    id: String(req.cookies[cookieName]),
                    surveyId,
                },
            });
        }
        if (surveyMeta.oneResponsePerPerson && existingResponse?.isComplete) {
            return res.status(403).send({ message: 'You have already submitted a response to this survey.' });
        }
        if (!existingResponse) {
            const isOwnerPro = await userHasActiveProSubscription(prisma, surveyMeta.userId);
            const closedReason = getSurveyClosedReason(surveyMeta, { isOwnerPro });
            if (closedReason) {
                return res.status(403).send({ message: closedReason });
            }
        }

        let userResponsePayload = Array.isArray(req.body.userResponse)
            ? req.body.userResponse
            : [];
        let zoomJoinUrl = null;

        const alreadyHasActiveZoom = userResponsePayload.some(
            (form) => form?.zoomMeeting?.status === 'active' && form?.zoomMeeting?.joinUrl
        );
        const zoomCheck = shouldCreateZoomForResponse(
            surveyMeta?.surveyForms,
            userResponsePayload
        );
        if (zoomCheck.ok && !alreadyHasActiveZoom && req.body.skipZoom !== true && req.body.skipZoom !== 'true') {
            try {
                const tokenInfo = await getValidZoomAccessToken(surveyMeta.userId);
                if (!tokenInfo?.accessToken) {
                    userResponsePayload = userResponsePayload.map((form) => {
                        if (form.id !== zoomCheck.answered?.id && form.formType !== zoomCheck.formDef?.formType) {
                            return form;
                        }
                        if (zoomCheck.answered?.id && form.id !== zoomCheck.answered.id) return form;
                        return {
                            ...form,
                            zoomMeeting: {
                                status: 'failed',
                                error: 'Survey author has not connected Zoom',
                            },
                        };
                    });
                } else {
                    const meeting = await createZoomMeetingForHost(tokenInfo.accessToken, {
                        topic: `${surveyMeta.surveyTitle || 'Survey'} — interview`,
                        durationMinutes: 120,
                    });
                    zoomJoinUrl = meeting.joinUrl;
                    userResponsePayload = userResponsePayload.map((form) => {
                        if (zoomCheck.answered?.id && form.id === zoomCheck.answered.id) {
                            return {
                                ...form,
                                zoomMeeting: {
                                    ...meeting,
                                    hostUserId: tokenInfo.connection.zoomUserId,
                                },
                            };
                        }
                        if (!zoomCheck.answered?.id && form.formType === zoomCheck.formDef?.formType) {
                            return {
                                ...form,
                                zoomMeeting: {
                                    ...meeting,
                                    hostUserId: tokenInfo.connection.zoomUserId,
                                },
                            };
                        }
                        return form;
                    });
                }
            } catch (zoomErr) {
                console.error('[zoom create meeting]', zoomErr?.message || zoomErr);
                userResponsePayload = userResponsePayload.map((form) => {
                    const match =
                        (zoomCheck.answered?.id && form.id === zoomCheck.answered.id) ||
                        (!zoomCheck.answered?.id && form.formType === zoomCheck.formDef?.formType);
                    if (!match) return form;
                    return {
                        ...form,
                        zoomMeeting: {
                            status: 'failed',
                            error: zoomErr?.message || 'Failed to create Zoom meeting',
                        },
                    };
                });
            }
        }

        let savedUserResponse;
        let isUpdate = false;

        const wasComplete = Boolean(existingResponse?.isComplete);
        const existingId = existingResponse?.id || requestedResponseId;

        if (existingResponse) {
            savedUserResponse = await prisma.userSurveyResponse.update({
                where: { id: existingId },
                data: {
                    userResponse: userResponsePayload,
                    userName:req.body.userName,
                    userEmail:req.body.userEmail,
                    formQuestions:req.body.formQuestions,
                    introduction:req.body.introduction,
                    ipAddress:ipAddress,
                    userTimeSpent:req.body.userTimeSpent,
                    isComplete,
                },
            });
            isUpdate = true;
            if (!wasComplete && isComplete) {
                await prisma.survey.update({
                    where: { id: surveyId },
                    data: {
                        surveyResponses: { increment: 1 },
                        surveyCompleted: { increment: 1 },
                    },
                });
            }
        }

        if (!savedUserResponse) {
            savedUserResponse = await prisma.userSurveyResponse.create({
                data:{
                    surveyId,
                    userResponse: userResponsePayload,
                    userName:req.body.userName,
                    userEmail:req.body.userEmail,
                    formQuestions:req.body.formQuestions,
                    introduction:req.body.introduction,
                    ipAddress:ipAddress,
                    userTimeSpent:req.body.userTimeSpent,
                    isComplete,
                }
            });

            if (isComplete) {
                await prisma.survey.update({
                    where:{
                        id:surveyId
                    },
                    data:{
                        surveyResponses:{
                            increment:1
                        },
                        surveyCompleted: {
                            increment: 1
                        }
                    }
                });
            }
        }
        res.cookie(cookieName, savedUserResponse.id, surveyCookieOptions());
        const getResponseCount = await prisma.survey.findUnique({
            where:{
                id:surveyId
            },

            select: {
                surveyResponses: true, // Select the specific field from the Survey model
                surveyTitle: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            
        });
        console.log(getResponseCount,'getResponseCount');
        try {
            const configuredSurveyId = process.env.DEFENCE_READINESS_SURVEY_ID;
            const responses = Array.isArray(req.body.userResponse) ? req.body.userResponse : [];
            if (configuredSurveyId && surveyId === configuredSurveyId && responses.length >= 50) {
                await generateFullSummaryFromFifty(responses, savedUserResponse.id);
                const recipientEmail = String(req.body.userEmail || savedUserResponse?.userEmail || '').trim();
                if (recipientEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
                    const driBase = String(process.env.DRI_BASE_URL || 'http://localhost:5174').replace(/\/$/, '');
                    const fullLockedLink = `${driBase}/full-payment-summary/${encodeURIComponent(String(savedUserResponse.id))}`;
                    const fullReadyHtml = `
                      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;">
                        <h2 style="margin-bottom:8px;">Your full DRI results are ready</h2>
                        <p style="margin:0 0 12px;">
                          Your 50-question Defence Readiness assessment has been processed successfully.
                        </p>
                        <p style="margin:0 0 16px;">
                          Open your locked full score page here:
                        </p>
                        <p style="margin:0 0 20px;">
                          <a href="${fullLockedLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;">
                            View full DRI results
                          </a>
                        </p>
                        <p style="margin:0;font-size:13px;color:#6b7280;">
                          If the button does not work, copy and paste this link into your browser:<br/>
                          <a href="${fullLockedLink}">${fullLockedLink}</a>
                        </p>
                      </div>
                    `;
                    await resendEmailDRIndex(
                        process.env.RESEND_EMAILID_PHD_DEFENCE_READINESS || '',
                        recipientEmail,
                        'Your full DRI results are ready',
                        fullReadyHtml
                    );
                }
            }
        } catch (fullSummaryErr) {
            console.error('[DRI full 50 summary]', fullSummaryErr?.message || fullSummaryErr);
        }
        if(getResponseCount.surveyResponses === 450 ){
            updateUserResponseLimit( getResponseCount.user.firstName, getResponseCount.user.email, getResponseCount.surveyTitle, 450 );
        }
        if(getResponseCount.surveyResponses === 475 ){
            updateUserResponseLimit( getResponseCount.user.firstName, getResponseCount.user.email, getResponseCount.surveyTitle, 475 );
        }
        if (!zoomJoinUrl) {
            const fromSaved = (Array.isArray(savedUserResponse?.userResponse)
                ? savedUserResponse.userResponse
                : []
            ).find((form) => form?.zoomMeeting?.joinUrl)?.zoomMeeting?.joinUrl;
            zoomJoinUrl = fromSaved || null;
        }

        if (zoomJoinUrl && getResponseCount?.user?.email) {
            try {
                const zoomForm = (Array.isArray(savedUserResponse?.userResponse)
                    ? savedUserResponse.userResponse
                    : []
                ).find((form) => form?.zoomMeeting?.joinUrl === zoomJoinUrl);
                await sendZoomInterviewAuthorEmail({
                    authorEmail: getResponseCount.user.email,
                    authorName: `${getResponseCount.user.firstName || ''} ${getResponseCount.user.lastName || ''}`.trim(),
                    surveyTitle: getResponseCount.surveyTitle,
                    joinUrl: zoomJoinUrl,
                    respondentName: req.body.userName || savedUserResponse?.userName,
                    respondentEmail: req.body.userEmail || savedUserResponse?.userEmail,
                    responseId: savedUserResponse?.id,
                    expiresAt: zoomForm?.zoomMeeting?.expiresAt,
                });
            } catch (emailErr) {
                console.error('[zoom author email]', emailErr?.message || emailErr);
            }
        }

        res.status(201).send({
            message:'User response submitted successfully',
            createUserResponse: savedUserResponse,
            isUpdate,
            zoomMeeting: zoomJoinUrl ? { joinUrl: zoomJoinUrl } : null,
        });

    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }

}

export const getDefenceReadinessInterimResponseForUser = async (req, res) => {
    const surveyId = req.params.surveyId;
    const responseId = String(req.params.responseId || '').trim();
    const configuredSurveyId = process.env.DEFENCE_READINESS_SURVEY_ID;

    if (!configuredSurveyId || surveyId !== configuredSurveyId) {
        return res.status(403).send({ message: 'Forbidden for this survey' });
    }

    if (!responseId) {
        return res.status(400).send({ message: 'responseId is required' });
    }

    try {
        const responseData = await prisma.userSurveyResponse.findFirst({
            where: {
                id: responseId,
                surveyId,
            },
            select: {
                id: true,
                userEmail: true,
                userResponse: true,
                formQuestions: true,
            },
        });

        if (!responseData) {
            return res.status(404).send({ message: 'Response not found' });
        }

        return res.status(200).send({
            responseId: responseData.id,
            userEmail: responseData.userEmail,
            userResponse: Array.isArray(responseData.userResponse) ? responseData.userResponse : [],
            formQuestions: responseData.formQuestions ?? [],
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
}

export const postDefenceReadinessInterimSummaryForUser = async (req, res) => {
    const surveyId = req.params.surveyId;
    const configuredSurveyId = process.env.DEFENCE_READINESS_SURVEY_ID;
    const guardedDriSurveyId = 'cmlyr2y9d00d7110v520atode';

    if (!configuredSurveyId || surveyId !== configuredSurveyId) {
        return res.status(403).send({ message: 'Forbidden for this survey' });
    }

    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const trimmedEmail = (req.body.userEmail || '').trim();

    if (!trimmedEmail) {
        return res.status(400).send({ message: 'userEmail is required' });
    }

    const safeFirstTenResponses = Array.isArray(req.body.userResponse)
        ? req.body.userResponse.slice(0, 10)
        : [];

    try {
        if (surveyId === guardedDriSurveyId) {
            const existingInterimResponse = await prisma.userSurveyResponse.findFirst({
                where: {
                    surveyId,
                    userEmail: trimmedEmail,
                },
                select: { id: true },
            });

            if (existingInterimResponse) {
                return res.status(409).send({
                    message: 'This email has already been used to create a DRI interim summary. Please refer to the previously sent email link.',
                    code: 'DRI_EMAIL_ALREADY_USED',
                });
            }
        }

        const driSurvey = await prisma.survey.findUnique({
            where: { id: surveyId },
            select: { userId: true, surveyResponses: true },
        });
        if (!driSurvey) {
            return res.status(404).send({ message: 'Survey not found' });
        }
        if (await surveyHasReachedFreeResponseLimit(driSurvey)) {
            return res.status(403).send({
                message: 'This survey has exceeded its allotted responses. Please contact the host.',
            });
        }

        const createUserResponse = await prisma.userSurveyResponse.create({
            data: {
                surveyId,
                userEmail: trimmedEmail,
                userName: 'Anonymous',
                userResponse: safeFirstTenResponses,
                formQuestions: Array.isArray(req.body.formQuestions) ? req.body.formQuestions : [],
                introduction: false,
                ipAddress: Array.isArray(userIP) ? userIP[0] : String(userIP || ''),
                userTimeSpent: req.body.userTimeSpent || '0m 0s',
                isComplete: false,
            },
        });
        const interimSummary = await generateInterimSummaryFromFirstTen(
            safeFirstTenResponses,
            createUserResponse.id
        );
        let interimEmailSent = false;
        if (interimSummary?.content) {
            try {
                await resendEmailDRIndex(
                    process.env.RESEND_EMAILID_PHD_DEFENCE_READINESS || '',
                    trimmedEmail,
                    'Your DRI Interim Summary (Q1-Q10)',
                    interimSummary.content
                );
                await prisma.userSurveyResponse.update({
                    where: { id: createUserResponse.id },
                    data: { responseConfirmationEmailSentAt: new Date() },
                });
                interimEmailSent = true;
            } catch (emailErr) {
                console.error('[Interim DRI email]', emailErr?.message || emailErr);
            }
        }

        res.status(201).send({
            message: 'Defence readiness interim response saved successfully',
            createUserResponse,
            interimSummary,
            interimCtaUrl: interimSummary?.ctaUrl || null,
            interimEmailSent,
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}
