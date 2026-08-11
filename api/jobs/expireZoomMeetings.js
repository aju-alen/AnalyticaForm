import { PrismaClient } from '@prisma/client';
import { deleteZoomMeeting, getValidZoomAccessToken } from '../utils/zoomApi.js';

const prisma = new PrismaClient();
const QUAL_TYPES = new Set(['QualitativeConsentForm', 'DynamicQualitativeConsentForm']);

function attachExpired(userResponse, meetingId) {
  if (!Array.isArray(userResponse)) return userResponse;
  return userResponse.map((form) => {
    if (!QUAL_TYPES.has(form.formType) || !form.zoomMeeting) return form;
    if (String(form.zoomMeeting.meetingId) !== String(meetingId)) return form;
    return {
      ...form,
      zoomMeeting: {
        ...form.zoomMeeting,
        status: 'expired',
      },
    };
  });
}

export async function runExpireZoomMeetings() {
  const recent = await prisma.userSurveyResponse.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      userResponse: true,
      survey: { select: { userId: true } },
    },
  });

  const now = Date.now();
  let expiredCount = 0;

  for (const row of recent) {
    const forms = Array.isArray(row.userResponse) ? row.userResponse : [];
    for (const form of forms) {
      const zm = form?.zoomMeeting;
      if (!zm || zm.status !== 'active' || !zm.meetingId || !zm.expiresAt) continue;
      if (new Date(zm.expiresAt).getTime() > now) continue;

      try {
        const tokenInfo = await getValidZoomAccessToken(row.survey.userId);
        if (tokenInfo?.accessToken) {
          await deleteZoomMeeting(tokenInfo.accessToken, zm.meetingId);
        }
      } catch (err) {
        console.error('[expireZoomMeetings] delete failed', row.id, err?.message || err);
      }

      const nextResponse = attachExpired(forms, zm.meetingId);
      await prisma.userSurveyResponse.update({
        where: { id: row.id },
        data: { userResponse: nextResponse },
      });
      expiredCount += 1;
    }
  }

  if (expiredCount > 0) {
    console.log(`[expireZoomMeetings] expired ${expiredCount} meeting(s)`);
  }
}
